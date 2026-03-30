import { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  fetchTodosByProject,
  fetchProjectMembers,
  ProjectMember,
} from '../../../services/taskService';
import { useAppSelector } from '../../../store/hooks';
import { styles } from './ProjectTodos.styles';
import {
  PRIORITY_COLOR,
  PROJECT_TODOS_STRINGS,
  ROLE_FILTERS,
  RoleFilter,
} from './ProjectTodos.constants';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

type Props = {
  navigation: NativeStackNavigationProp<ProjectsStackParamList>;
  route: RouteProp<ProjectsStackParamList, typeof Routes.PROJECT_TODOS>;
};

// ── MemberCard ────────────────────────────────────────────────────────────────

function MemberCard({ member }: { member: ProjectMember }) {
  const initial = member.profiles.email.charAt(0).toUpperCase();
  const shortEmail =
    member.profiles.email.length > 9
      ? member.profiles.email.slice(0, 9) + '…'
      : member.profiles.email;

  return (
    <View style={styles.memberCard}>
      <View style={styles.memberAvatar}>
        <Text style={styles.memberAvatarText}>{initial}</Text>
      </View>
      <Text style={styles.memberEmail}>{shortEmail}</Text>
      <View style={styles.memberRoleBadge}>
        <Text style={styles.memberRoleText}>{member.role}</Text>
      </View>
    </View>
  );
}

// ── ProjectTodosScreen ────────────────────────────────────────────────────────

export default function ProjectTodosScreen({ navigation, route }: Props) {
  const { projectId, projectName } = route.params;
  const role = useAppSelector(state => state.user.role);
  const isAdmin = role === 'admin';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [todosResult, membersData] = await Promise.all([
      fetchTodosByProject(projectId),
      fetchProjectMembers(projectId),
    ]);

    if (todosResult?.data) {
      setTasks(todosResult.data as Task[]);
    } else {
      setError(PROJECT_TODOS_STRINGS.ERROR_LOAD);
    }
    setMembers(membersData);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredMembers = useMemo(
    () =>
      roleFilter === 'all'
        ? members
        : members.filter(m => m.role === roleFilter),
    [members, roleFilter],
  );

  const onPressAddMember = useCallback(() => {
    navigation.navigate(Routes.ADD_PROJECT_MEMBER, { projectId, projectName });
  }, [navigation, projectId, projectName]);

  const onPressTask = useCallback(
    (task: Task) => {
      navigation.navigate(Routes.TODO_DETAIL, {
        taskId: task.id,
        todoTitle: task.title,
        priority: task.priority,
        status: task.status,
      } as any);
    },
    [navigation],
  );

  // ── Members section rendered as FlatList header ───────────────

  const memberKeyExtractor = useCallback((item: ProjectMember) => item.id, []);

  const renderMember: ListRenderItem<ProjectMember> = useCallback(
    ({ item }) => <MemberCard member={item} />,
    [],
  );

  const renderMembersHeader = useCallback(
    () => (
      <View style={styles.membersSection}>
        <Text style={styles.sectionLabel}>
          {PROJECT_TODOS_STRINGS.SECTION_MEMBERS} ({members.length})
        </Text>

        {/* Role filter chips */}
        <View style={styles.filterRow}>
          {ROLE_FILTERS.map(filter => {
            const isActive = roleFilter === filter.value;
            const onPress = () => setRoleFilter(filter.value);
            return (
              <TouchableOpacity
                key={filter.value}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={onPress}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Horizontal members list */}
        {filteredMembers.length === 0 ? (
          <Text style={styles.emptyMembersText}>{PROJECT_TODOS_STRINGS.EMPTY_MEMBERS}</Text>
        ) : (
          <FlatList
            data={filteredMembers}
            keyExtractor={memberKeyExtractor}
            renderItem={renderMember}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.memberListContent}
          />
        )}
      </View>
    ),
    [members.length, roleFilter, filteredMembers, memberKeyExtractor, renderMember],
  );

  // ── Task items ────────────────────────────────────────────────

  const todoKeyExtractor = useCallback((item: Task) => item.id, []);

  const renderTask: ListRenderItem<Task> = useCallback(
    ({ item }) => {
      const onPress = () => onPressTask(item);
      return (
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={onPress}
          activeOpacity={0.75}
        >
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
              <View
                style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLOR[item.priority] }]}
              >
                <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  item.status === 'completed' && styles.statusBadgeCompleted,
                ]}
              >
                <Text style={styles.statusText}>
                  {item.status === 'completed'
                    ? PROJECT_TODOS_STRINGS.STATUS_COMPLETED
                    : PROJECT_TODOS_STRINGS.STATUS_PENDING}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [onPressTask],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{PROJECT_TODOS_STRINGS.EMPTY}</Text>
      </View>
    ),
    [],
  );

  return (
    <>
      <Header title={projectName} showBack />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadData}>
              <Text style={styles.retryText}>{PROJECT_TODOS_STRINGS.RETRY}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={todoKeyExtractor}
            renderItem={renderTask}
            ListHeaderComponent={renderMembersHeader}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {isAdmin && (
          <TouchableOpacity style={styles.fab} onPress={onPressAddMember} activeOpacity={0.85}>
            <Text style={styles.fabText}>{PROJECT_TODOS_STRINGS.FAB_MEMBERS}</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
