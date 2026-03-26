import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../theme/colors';
import Header from '../../components/Header';
import { createTag } from '../../services/todoService';
import { Routes } from '../../navigation/Routes';
export default function CreateTagScreen({ navigation }: { navigation: any }) {
  const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const addTag = async () => {
    if (!tag.trim()) return;
     try {
      setLoading(true);
      const newTag = await createTag(tag);
      if (newTag) {
        setTags([...tags, newTag]);
        setTag('');
        navigation.navigate(Routes.MAIN_APP, {
          screen: Routes.DASHBOARD
        });
      }
     } catch (error) {
      console.log("error=========", error);
      Alert.alert('Error', 'Failed to add tag');
     } finally {
      setLoading(false);
     }
  };

  return (
    <>
    <Header title="Create Tag"  rightComponent={<TouchableOpacity disabled={loading} style={{ opacity: loading ? 0.5 : 1, borderRadius: 10, padding: 6,borderWidth: 1, borderColor: Colors.primary }} onPress={() => {
        addTag();
    }}>
      {loading ? <ActivityIndicator size="small" color={Colors.primary} /> : <Text style={{ color: Colors.primary,fontWeight: 'bold',fontSize: 12 }}>Save</Text>}
    </TouchableOpacity>}/>
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Add Tag</Text>

        <View style={styles.row}>
          <TextInput
            placeholder="Enter tag name"
            value={tag}
            onChangeText={setTag}
            style={[styles.input, { flex: 1 }]}
          />

          <TouchableOpacity style={styles.addBtn} onPress={addTag}>
            <Text style={{ color: '#fff' }}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Tag List */}
        <FlatList
          data={tags}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tag}>
              <Text style={{ color: '#fff' }}>{item.name}</Text>
            </View>
          )}
          numColumns={3}
        />
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingVertical: 16,
    },
  
    content: {
      padding: 16,
      flex:1,
      justifyContent: 'space-between',
    },
  
    label: {
      fontWeight: '600',
      marginBottom: 8,
    },
  
    input: {
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
    },
  
    button: {
      backgroundColor: Colors.primary,
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
    },
  
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    addBtn: {
      backgroundColor: Colors.primary,
      padding: 12,
      borderRadius: 10,
      marginLeft: 8,
    },
  
    tag: {
      backgroundColor: Colors.secondary,
      padding: 10,
      borderRadius: 20,
      margin: 5,
    },
  });