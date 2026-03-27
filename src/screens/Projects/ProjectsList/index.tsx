import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../../../navigation/types';
import { Routes } from '../../../navigation/Routes';
import Header from '../../../components/Header';
import { fetchProjectsService } from '../../../services/todoService';
import { Colors } from '../../../theme/colors';
import { styles } from './ProjectsList.styles';
import { PROJECTS_STRINGS } from './ProjectsList.constants';
import { useAppSelector } from '../../../store/hooks';

interface Project {
  id: string;
  name: string;
  tasks: number;
}

type Props = {
  navigation: NativeStackNavigationProp<ProjectsStackParamList>;
};

type ProjectCardProps = {
  project: Project;
  onPress: (id: string, name: string) => void;
};

function ProjectCard({ project, onPress }: ProjectCardProps) {
  const handlePress = useCallback(
    () => onPress(project.id, project.name),
    [onPress, project.id, project.name],
  );

  const displayName = project.name.charAt(0).toUpperCase() + project.name.slice(1);

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Text style={styles.cardTitle}>{displayName}</Text>
      <Text style={styles.cardCount}>
        {project.tasks} {PROJECTS_STRINGS.TASK_LABEL(project.tasks)}
      </Text>
    </TouchableOpacity>
  );
}

export default function ProjectsScreen({ navigation }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const role = useAppSelector(state => state.user.role);
  const isAdmin = role === 'admin';
  const fetchProjects = useCallback(async (isRefreshing = false) => {
    !isRefreshing && setLoading(true);
    setError(null);
    try {
      const result = await fetchProjectsService();
      if (result?.data) {
        setProjects(
          result.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            tasks: item.todos[0]?.count ?? 0,
          })),
        );
      } else {
        setError(PROJECTS_STRINGS.ERROR_LOAD);
      }
    } catch {
      setError(PROJECTS_STRINGS.ERROR_LOAD);
    } finally {
      !isRefreshing && setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const onPressProject = useCallback(
    (projectId: string, projectName: string) => {
      navigation.navigate(Routes.PROJECT_TODOS, { projectId, projectName });
    },
    [navigation],
  );

  const onPressCreate = useCallback(
    () => navigation.navigate(Routes.CREATE_PROJECT),
    [navigation],
  );

  const renderItem: ListRenderItem<Project> = useCallback(
    ({ item }) => <ProjectCard project={item} onPress={onPressProject} />,
    [onPressProject],
  );

    const renderEmpty = useCallback(() => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{PROJECTS_STRINGS.EMPTY}</Text>
      </View>
    ), []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProjects(true);
    setRefreshing(false);
  }, [fetchProjects]);
  const keyExtractor = useCallback((item: Project) => item.id, []);

  return (
    <>
      <Header title={PROJECTS_STRINGS.HEADER_TITLE} />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchProjects}>
              <Text style={styles.retryText}>{PROJECTS_STRINGS.RETRY}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={projects}
            keyExtractor={keyExtractor}
            numColumns={2}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
          />
        )}
        {isAdmin && (
          <TouchableOpacity style={styles.fab} onPress={onPressCreate}>
            <Text style={styles.fabText}>{PROJECTS_STRINGS.FAB_LABEL}</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}