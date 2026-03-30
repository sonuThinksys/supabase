import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { supabase } from '../../supabase/client';
import { Colors } from '../../theme/colors';
import { Routes } from '../../navigation/Routes';
import Header from '../../components/Header';
import TaskItem from './TaskItem';
import ResolveTask from './ResolveTask';
import { fetchUserTodos, fetchAllTodos } from '../../services/taskService';
import { useAppSelector } from '../../store/hooks';
import { styles } from './MyTasks.styles';
import { MY_TASKS_STRINGS, FilterType } from './MyTasks.constants';

export default function MyTasksScreen() {
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const resolveRefs = useRef<Record<string, (() => void) | null>>({});
  const closeRefs = useRef<Record<string, (() => void) | null>>({});
  const role = useAppSelector(state => state.user.role);
  const isAdmin = role === 'admin';

  const filteredTasks = tasks.filter(
    item => filter === 'all' || item.status === filter,
  );

  const fetchTasks = useCallback(async (refreshing = false) => {
    if (!refreshing) { setLoading(true); }
    const result = isAdmin
      ? await fetchAllTodos()
      : await fetchUserTodos();
    setTasks(result?.data ?? []);
    if (!refreshing) { setLoading(false); }
  }, [isAdmin]);

  useEffect(() => {
    if (isFocused) { fetchTasks(); }
  }, [isFocused, fetchTasks]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await supabase.from('task').delete().eq('id', id);
    } catch (error) {
      console.log('deleteTask error:', error);
    }
  }, []);

  const onOpenResolve = useCallback((item: any) => {
    setShowResolve(true);
    setSelectedTask(item);
  }, []);

  const onCloseResolve = useCallback(() => {
    setShowResolve(false);
    closeRefs.current[selectedTask?.id]?.();
  }, [selectedTask]);

  const onResolved = useCallback(async () => {
    try {
      setShowResolve(false);
      fetchTasks();
      if (filter === 'pending') {
        resolveRefs.current[selectedTask?.id]?.();
      } else {
        closeRefs.current[selectedTask?.id]?.();
      }
    } catch (error) {
      console.log('onResolved error:', error);
    }
  }, [fetchTasks, filter, selectedTask]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchTasks(true);
    setIsRefreshing(false);
  }, [fetchTasks]);

  const onPressCreate = useCallback(() => {
    navigation.navigate(Routes.CREATE_TASK);
  }, [navigation]);

  const onPressAll = useCallback(() => setFilter('all'), []);
  const onPressPending = useCallback(() => setFilter('pending'), []);
  const onPressCompleted = useCallback(() => setFilter('completed'), []);

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  const renderItem: ListRenderItem<any> = useCallback(({ item }) => (
    <TaskItem
      item={item}
      isAdmin={isAdmin}
      onDelete={deleteTask}
      onResolve={onOpenResolve}
      resolveRef={{
        get current() { return resolveRefs.current[item.id]; },
        set current(fn) { resolveRefs.current[item.id] = fn; },
      }}
      closeRef={{
        get current() { return closeRefs.current[item.id]; },
        set current(fn) { closeRefs.current[item.id] = fn; },
      }}
    />
  ), [deleteTask, isAdmin, onOpenResolve]);

  const renderEmpty = useCallback(() => {
    if(loading) return null;
    return <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{MY_TASKS_STRINGS.EMPTY}</Text>
    </View>
  }, [loading]);

  return (
    <>
      <Header title={MY_TASKS_STRINGS.HEADER_TITLE} />
      {isAdmin && (
        <ResolveTask
          visible={showResolve}
          task={selectedTask}
          onClose={onCloseResolve}
          onResolved={onResolved}
        />
      )}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      <View style={styles.container}>
        {/* Filter tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={onPressAll}>
            <Text style={[styles.tab, filter === 'all' && styles.tabActive]}>
              {MY_TASKS_STRINGS.FILTER_ALL}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressPending}>
            <Text style={[styles.tab, filter === 'pending' && styles.tabActive]}>
              {MY_TASKS_STRINGS.FILTER_PENDING}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressCompleted}>
            <Text style={[styles.tab, filter === 'completed' && styles.tabActive]}>
              {MY_TASKS_STRINGS.FILTER_COMPLETED}
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAB */}
        <TouchableOpacity style={styles.fab} onPress={onPressCreate}>
          <Text style={styles.fabText}>{MY_TASKS_STRINGS.FAB_ICON}</Text>
        </TouchableOpacity>

        {/* Task list */}
        <FlatList
          data={filteredTasks}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </>
  );
}
