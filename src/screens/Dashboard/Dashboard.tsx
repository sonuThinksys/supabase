import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../supabase/client';
import Header from '../../components/Header';
import { Colors } from '../../theme/colors';
import { Routes } from '../../navigation/Routes';
import { fetchAllTodos } from '../../services/taskService';
import { styles } from './Dashboard.styles';
import {
  DASHBOARD_STRINGS,
  RECENT_TASKS_LIMIT,
  PRIORITY_DOT_COLOR,
} from './Dashboard.constants';
import { useAppSelector } from '../../store/hooks';
import DashboardVoiceModal from './DashboardVoiceModal';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'todo';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

// ── Sub-components ────────────────────────────────────────────────────────────

type StatCardProps = { value: number; label: string; valueStyle?: object };

const STATUS={
  pending: 'Pending',
  completed: 'Done',
  todo: 'Not Started',
}

function StatCard({ value, label, valueStyle }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, valueStyle]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

type ListHeaderProps = { total: number; todo: number; pending: number; completed: number };

function DashboardListHeader({ total, todo, pending, completed }: ListHeaderProps) {
  return (
    <>
      <View style={styles.statsRow}>
        <StatCard value={total} label={DASHBOARD_STRINGS.STAT_TOTAL} />
        <StatCard
          value={todo}
          label={DASHBOARD_STRINGS.STAT_TODO}
          valueStyle={styles.statValuePending}
        />
        <StatCard
          value={pending}
          label={DASHBOARD_STRINGS.STAT_PENDING}
          valueStyle={styles.statValuePending}
        />
        <StatCard
          value={completed}
          label={DASHBOARD_STRINGS.STAT_COMPLETED}
          valueStyle={styles.statValueCompleted}
        />
      </View>
      <Text style={styles.sectionTitle}>{DASHBOARD_STRINGS.SECTION_RECENT}</Text>
    </>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const userId = useAppSelector(state => state.user.userId) ?? '';
  const role = useAppSelector(state => state.user.role);
  const isAdmin = role === 'admin';

  const [tasks, setTodos] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const fetchTodos = useCallback(async (isRefreshing = false) => {
    if (!isRefreshing) { setLoading(true); }
    const result = await fetchAllTodos();
    setTodos((result?.data as Task[]) ?? []);
    if (!isRefreshing) { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchTodos();

    const existing = supabase.getChannels().find(ch => ch.topic === 'realtime:dashboard-tasks');
    if (existing) { supabase.removeChannel(existing); }

    const channel = supabase
      .channel('dashboard-tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'task' },
        () => fetchTodos(true),
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchTodos]);

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  const recentTodos = useMemo(
    () => tasks.slice(0, RECENT_TASKS_LIMIT),
    [tasks],
  );

  const onPressMyTasks = useCallback(() => {
    navigation.navigate(Routes.MY_TASKS);
  }, [navigation]);

  const onOpenVoice = useCallback(() => { setVoiceModalVisible(true); }, []);
  const onCloseVoice = useCallback(() => { setVoiceModalVisible(false); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTodos(true);
    setRefreshing(false);
  }, [fetchTodos]);

  const keyExtractor = useCallback((item: Task) => item.id, []);

  const renderItem: ListRenderItem<Task> = useCallback(({ item }) => {
    const isCompleted = item.status === 'completed';
    return (
      <View style={styles.taskCard}>
        <View style={styles.taskLeft}>
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: PRIORITY_DOT_COLOR[item.priority] },
            ]}
          />
          <Text style={styles.taskTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <View style={[styles.statusBadge, isCompleted && styles.statusBadgeCompleted]}>
          <Text style={[styles.statusText, isCompleted && styles.statusTextCompleted]}>
            {/* {isCompleted ? DASHBOARD_STRINGS.STATUS_DONE : DASHBOARD_STRINGS.STATUS_PENDING} */}
            {STATUS[item.status] ? `${STATUS[item.status]}` : ''}
          </Text>
        </View>
      </View>
    );
  }, []);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{DASHBOARD_STRINGS.EMPTY_TITLE}</Text>
      <Text style={styles.emptySubText}>{DASHBOARD_STRINGS.EMPTY_SUB}</Text>
    </View>
  ), []);

  const ListHeader = useCallback(
    () => (
      <DashboardListHeader
        total={stats.total}
        todo={stats.todo}
        pending={stats.pending}
        completed={stats.completed}
      />
    ),
    [stats],
  );

  const headerRight = (
    <TouchableOpacity style={styles.micHeaderBtn} onPress={onOpenVoice}>
      <Icon name="mic" size={20} color={Colors.card} />
    </TouchableOpacity>
  );

  return (
    <>
      <Header title={DASHBOARD_STRINGS.HEADER_TITLE} rightComponent={headerRight} />
      <DashboardVoiceModal
        visible={voiceModalVisible}
        onClose={onCloseVoice}
        userId={userId}
        isAdmin={isAdmin}
      />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={recentTodos}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={renderEmpty}
            onRefresh={onRefresh}
            refreshing={refreshing}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </>
  );
}
