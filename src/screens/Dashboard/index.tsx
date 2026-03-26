import { View, FlatList, Text, Alert, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { Activity, useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { getPriorityStyle, getStatusStyle } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { Colors } from '../../theme/colors';
export default function DashboardScreen() {
  const navigation = useNavigation();
  const [todos, setTodos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);  
  const fetchTodos = async (isRefreshing = false) => {
    try {
     !isRefreshing && setIsLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      Alert.alert('User not found');
      return;
    }
    const { data }:any = await supabase
      .from('todos')
      .select('*')
    setTodos(data);
    } catch (error) {
      console.log(error, 'error');
    } finally {
     !isRefreshing && setIsLoading(false);  
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setIsLoading(true);
      await supabase.from('todos').delete().eq('id', id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setIsLoading(false);  
    }
  };

  useEffect(() => {
    fetchTodos();
    const channel = supabase
      .channel('todos-changes')
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'todos',
        },
        (payload) => {
          console.log('Realtime change:', payload);
          fetchTodos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


const taskItem = ({ item }: { item: any }) => {
  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.row}>
        <Text style={styles.title}>{item?.title}</Text>
        <Pressable style={styles.deleteButton} disabled={isLoading} onPress={() => deleteTodo(item.id)}>
         <Text style={styles.deleteButtonText}>{ isLoading ? "Deleting..." : "Delete"}</Text> 
        </Pressable>
      </View>
      <View style={styles.metaRow}>
        <View style={[styles.badge, getPriorityStyle(item?.priority)]}>
          <Text style={styles.badgeText}>{item?.priority}</Text>
        </View>
        <View style={[styles.badge, getStatusStyle(item?.status)]}>
          <Text style={styles.badgeText}>{item?.status}</Text>
        </View>
      </View>
    
    </View>
  );
}

const onRefresh = async () => {
  setRefreshing(true);
  await fetchTodos(true);
  setRefreshing(false);
}

  return (
    <>
    <Header
      title="Dashboard"
      rightComponent={
        <Pressable style={styles.addButton} onPress={() => navigation.navigate('CreateTask' as never)}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      }
    />
    <View style={styles.container}>
      { isLoading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View> : <FlatList
        data={todos}
        style={styles.flatList}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item: any) => Math.random().toString()}
        renderItem={taskItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>No Tasks Found</Text>
          </View>
        )}
      />}
    </View>
    </>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    borderColor: 'gray',
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  flatList: {
    marginTop: 10,
  },
  contentContainer: {
   flexGrow: 1,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    flex: 1,
  },

  metaRow: {
    flexDirection: 'row',
    marginTop: 10,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },

  badgeText: {
    fontSize: 12,
    color: '#fff',
    textTransform: 'capitalize',
  },

  loading: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
    padding: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  addButton: {
    padding: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  addButtonIcon: {
    width: 20,
    height: 20,
  },
});