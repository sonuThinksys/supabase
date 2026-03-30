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
import Header from '../../../components/Header';
import { Colors } from '../../../theme/colors';
import { fetchSubtasksForTodo, toggleSubtaskStatus, updateTaskStatus } from '../../../services/taskService';
import { styles } from './TodoDetail.styles';
import { TODO_DETAIL_STRINGS, PRIORITY_COLOR } from './TodoDetail.constants';

interface Subtask {
  id: string;
  title: string;
  is_completed: boolean;
}

type Props = {
  navigation: NativeStackNavigationProp<ProjectsStackParamList>;
  route: RouteProp<ProjectsStackParamList, typeof Routes.TODO_DETAIL>;
};

export default function TodoDetailScreen({ route }: Props) {
  const { taskId, todoTitle, priority, status: initialStatus } = route.params as any;

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [todoStatus, setTodoStatus] = useState<'pending' | 'completed'>(initialStatus ?? 'pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubtasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchSubtasksForTodo(taskId);
    if (result?.data) {
      setSubtasks(result.data as Subtask[]);
    } else {
      setError(TODO_DETAIL_STRINGS.ERROR_LOAD);
    }
    setLoading(false);
  }, [taskId]);

  useEffect(() => {
    loadSubtasks();
  }, [loadSubtasks]);

  const onToggleSubtask = useCallback(
    async (subtaskId: string, current: boolean) => {
      const updated = subtasks.map(s =>
        s.id === subtaskId ? { ...s, is_completed: !current } : s,
      );
      setSubtasks(updated);

      // Derive new todo status:
      // all subtasks completed → 'completed', otherwise → 'pending'
      const allDone = updated.length > 0 && updated.every(s => s.is_completed);
      const newStatus: 'pending' | 'completed' = allDone ? 'completed' : 'pending';
      setTodoStatus(newStatus);

      await toggleSubtaskStatus(subtaskId, !current);
      await updateTaskStatus(taskId, newStatus);
    },
    [subtasks, taskId],
  );

  const keyExtractor = useCallback((item: Subtask) => item.id, []);

  const renderItem: ListRenderItem<Subtask> = useCallback(
    ({ item }) => {
      const onPress = () => onToggleSubtask(item.id, item.is_completed);
      return (
        <TouchableOpacity style={styles.subtaskRow} onPress={onPress} activeOpacity={0.7}>
          <View style={[styles.checkbox, item.is_completed && styles.checkboxChecked]}>
            {item.is_completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text
            style={[
              styles.subtaskTitle,
              item.is_completed && styles.subtaskTitleCompleted,
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [onToggleSubtask],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{TODO_DETAIL_STRINGS.EMPTY_SUBTASKS}</Text>
      </View>
    ),
    [],
  );

  const renderHeader = useCallback(
    () => (
      <>
        <View style={styles.metaCard}>
          <Text style={styles.todoTitle}>{todoTitle}</Text>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: PRIORITY_COLOR[priority as 'low' | 'medium' | 'high'] ?? Colors.iconGray },
              ]}
            >
              <Text style={styles.priorityText}>{(priority ?? 'low').toUpperCase()}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                todoStatus === 'completed' && styles.statusBadgeCompleted,
              ]}
            >
              <Text style={styles.statusText}>
                {todoStatus === 'completed'
                  ? TODO_DETAIL_STRINGS.STATUS_COMPLETED
                  : TODO_DETAIL_STRINGS.STATUS_PENDING}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.sectionHeader}>{TODO_DETAIL_STRINGS.SECTION_SUBTASKS}</Text>
      </>
    ),
    [todoTitle, priority, todoStatus],
  );

  return (
    <>
      <Header title={todoTitle} showBack />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadSubtasks}>
              <Text style={styles.retryText}>{TODO_DETAIL_STRINGS.RETRY}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={subtasks}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
}
