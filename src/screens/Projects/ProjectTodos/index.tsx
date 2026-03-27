import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProjectsStackParamList } from '../../../navigation/types';
import { Routes } from '../../../navigation/Routes';
import { Colors } from '../../../theme/colors';
import Header from '../../../components/Header';
import { fetchTodosByProject } from '../../../services/todoService';
import { useAppSelector } from '../../../store/hooks';
import { styles } from './ProjectTodos.styles';
import { PRIORITY_COLOR, PROJECT_TODOS_STRINGS } from './ProjectTodos.constants';

interface Todo {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

type Props = {
  navigation: NativeStackNavigationProp<ProjectsStackParamList>;
  route: RouteProp<ProjectsStackParamList, 'ProjectTodos'>;
};

export default function ProjectTodosScreen({ navigation, route }: Props) {
  const { projectId, projectName } = route.params;
  const role = useAppSelector(state => state.user.role);
  const isAdmin = role === 'admin';

  const onPressAddMember = useCallback(() => {
    navigation.navigate(Routes.ADD_PROJECT_MEMBER, { projectId, projectName });
  }, [navigation, projectId, projectName]);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchTodosByProject(projectId);
    if (result?.data) {
      setTodos(result.data as Todo[]);
    } else {
      setError(PROJECT_TODOS_STRINGS.ERROR_LOAD);
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const renderItem: ListRenderItem<Todo> = useCallback(({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View
          style={[
            styles.statusDot,
            item.status === 'completed' && styles.statusDotCompleted,
          ]}
        />
        <Text style={styles.todoTitle}>{item.title}</Text>
      </View>
      <View style={styles.badgeRow}>
        <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLOR[item.priority] }]}>
          <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'completed' && styles.statusBadgeCompleted]}>
          <Text style={styles.statusText}>
            {item.status === 'completed'
              ? PROJECT_TODOS_STRINGS.STATUS_COMPLETED
              : PROJECT_TODOS_STRINGS.STATUS_PENDING}
          </Text>
        </View>
      </View>
    </View>
  ), []);

  const keyExtractor = useCallback((item: Todo) => item.id, []);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{PROJECT_TODOS_STRINGS.EMPTY}</Text>
    </View>
  ), []);

  return (
    <>
      <Header title={projectName} showBack/>
      <View style={styles.container}>
        {isAdmin && (
          <TouchableOpacity style={styles.fab} onPress={onPressAddMember} activeOpacity={0.85}>
            <Text style={styles.fabText}>{PROJECT_TODOS_STRINGS.FAB_MEMBERS}</Text>
          </TouchableOpacity>
        )}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadTodos}>
              <Text style={styles.retryText}>{PROJECT_TODOS_STRINGS.RETRY}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
}