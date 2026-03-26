import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';
import Header from '../../components/Header';
import { supabase } from '../../supabase/client';
import TaskItem from './TaskItem';
import ResolveTask from './ResolveTask';
import { resolveTask } from '../../services/todoService';
export default function MyTasksScreen() {
    const isFocused = useIsFocused();
    const [filter, setFilter] = useState('all');
    const navigation = useNavigation<any>();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showResolve, setShowResolve] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const resolveRefs = useRef<Record<string, (() => void) | null>>({});
    const closeRefs = useRef<Record<string, (() => void) | null>>({});
    const filteredTasks = tasks.filter(
        (item) => filter === 'all' || item.status === filter
    );

    const fetchTasks = async (isRefreshing = false) => {
        !isRefreshing && setLoading(true);
        const { data, error } = await supabase.from('todos').select('*');
        if (error) {
            console.log("error=========", error);
        }
        setTasks(data || []);
        !isRefreshing && setLoading(false);
    }

    useEffect(() => {
        if (isFocused) {
            fetchTasks();
        }
    }, [isFocused]);

    const deleteTodo = async (id: string) => {
        try {
            const { error } = await supabase.from('todos').delete().eq('id', id);
            if (error) {
                console.log("error=========", error);
            }
        } catch (error) {
            console.log("error=========", error);
        }
    };

    return (
        <>
            <Header title="My Tasks" />
            <ResolveTask visible={showResolve} onClose={() => {
                setShowResolve(false);
                closeRefs.current[selectedTask?.id]?.();
            }} task={selectedTask} onResolved={async (id) => {
                try {
                    await resolveTask(id);
                    setShowResolve(false);
                    fetchTasks();
                    if (filter === 'pending') {
                        resolveRefs.current[selectedTask.id]?.();
                    } else {
                        closeRefs.current[selectedTask?.id]?.();
                    }
                } catch (error) {
                    console.log("error=========", error);
                }
            }} />
            <View style={styles.container}>
                <View style={styles.tabs}>
                    {['all', 'pending', 'completed'].map((item) => (
                        <TouchableOpacity key={item} onPress={() => setFilter(item)}>
                            <Text style={[styles.tab, filter === item && styles.active]}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate(Routes.CREATE_TASK)}
                >
                    <Text style={{ color: '#fff', fontSize: 20 }}>+</Text>
                </TouchableOpacity>
                {/* List */}
                <FlatList
                    onRefresh={async () => {
                        try {
                            setIsRefreshing(true);
                            await fetchTasks(true);
                        } catch (error) {
                            console.log("error=========", error);
                        } finally {
                            setIsRefreshing(false);
                        }
                    }}
                    refreshing={isRefreshing}
                    data={filteredTasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TaskItem
                            item={item}
                            onDelete={() => deleteTodo(item.id)}
                            onResolve={(item) => {
                                setShowResolve(true);
                                setSelectedTask(item);
                            }}
                            resolveRef={{
                                get current() { return resolveRefs.current[item.id]; },
                                set current(fn) { resolveRefs.current[item.id] = fn; }
                            }}
                            closeRef={{
                                get current() { return closeRefs.current[item.id]; },
                                set current(fn) { closeRefs.current[item.id] = fn; }
                            }}
                        />
                    )}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, padding: 16, position: 'relative' },
    header: { fontSize: 22, fontWeight: 'bold' },
    tabs: { flexDirection: 'row', marginBottom: 15 },
    tab: { marginRight: 15, color: Colors.subText },
    active: { color: Colors.primary, fontWeight: 'bold' },
    card: {
        backgroundColor: Colors.card,
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
    },
    status: { marginTop: 5, color: Colors.subText },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#0e898f',
        width: 40,
        height: 40,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    deleteBox: {
        backgroundColor: Colors.error,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteIcon: { width: 20, height: 20, tintColor: '#fff' },
});