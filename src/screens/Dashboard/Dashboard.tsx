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
import { supabase } from '../../supabase/client';
import Header from '../../components/Header';
import { Colors } from '../../theme/colors';
import { Routes } from '../../navigation/Routes';
import { fetchAllTodos } from '../../services/todoService';
import { styles } from './Dashboard.styles';
import {
  DASHBOARD_STRINGS,
  RECENT_TASKS_LIMIT,
  PRIORITY_DOT_COLOR,
} from './Dashboard.constants';
import { useAppSelector } from '../../store/hooks';

interface Todo {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

// ── Sub-components ────────────────────────────────────────────────────────────

type StatCardProps = { value: number; label: string; valueStyle?: object };

function StatCard({ value, label, valueStyle }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, valueStyle]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

type ListHeaderProps = { total: number; pending: number; completed: number };

function DashboardListHeader({ total, pending, completed }: ListHeaderProps) {
  return (
    <>
      <View style={styles.statsRow}>
        <StatCard value={total} label={DASHBOARD_STRINGS.STAT_TOTAL} />
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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fetchTodos = useCallback(async (isRefreshing = false) => {
    if (!isRefreshing) { setLoading(true); }
    const result = await fetchAllTodos();
    setTodos((result?.data as Todo[]) ?? []);
    if (!isRefreshing) { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchTodos();
    const channel = supabase
      .channel('dashboard-todos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        () => fetchTodos(true),
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchTodos]);

  const stats = useMemo(() => ({
    total: todos.length,
    pending: todos.filter(t => t.status === 'pending').length,
    completed: todos.filter(t => t.status === 'completed').length,
  }), [todos]);

  const recentTodos = useMemo(
    () => todos.slice(0, RECENT_TASKS_LIMIT),
    [todos],
  );

  const onPressMyTasks = useCallback(() => {
    navigation.navigate(Routes.MY_TASKS);
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTodos(true);
    setRefreshing(false);
  }, [fetchTodos]);

  const keyExtractor = useCallback((item: Todo) => item.id, []);

  const renderItem: ListRenderItem<Todo> = useCallback(({ item }) => {
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
            {isCompleted ? DASHBOARD_STRINGS.STATUS_DONE : DASHBOARD_STRINGS.STATUS_PENDING}
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
        pending={stats.pending}
        completed={stats.completed}
      />
    ),
    [stats],
  );

  const headerRight = (
    <TouchableOpacity style={styles.headerBtn} onPress={onPressMyTasks}>
      <Text style={styles.headerBtnText}>{DASHBOARD_STRINGS.HEADER_BTN}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Header title={DASHBOARD_STRINGS.HEADER_TITLE} />
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
