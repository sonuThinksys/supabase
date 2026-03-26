import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabase/client';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Routes } from './Routes';
import { Colors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomDrawerContent() {
    const navigation = useNavigation<any>();
    const [user, setUser] = useState<any>(null);
    const insets = useSafeAreaInsets();
    useEffect(() => {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
      });
    }, []);
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{user?.email}</Text>
        </View>
        <View style={styles.divider} />
        <View style={{flex:1}}>
          <TouchableOpacity style={styles.content} onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: Routes.MAIN_APP as never, params: { screen: Routes.DASHBOARD } }],
            });
          }}>
            <Text>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.content} onPress={() => navigation.navigate(Routes.MAIN_APP,{
            screen: Routes.DASHBOARD,
            params: {
              screen: Routes.MY_TASKS,
            },
          })}>
            <Text>My Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.content}  onPress={() => navigation.navigate(Routes.MAIN_APP,{
            screen: Routes.DASHBOARD,
            params: {
              screen: Routes.PROJECTS,
            },
          })}>
            <Text>Projects</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.content}  onPress={() => navigation.navigate(Routes.MAIN_APP,{
            screen: Routes.DASHBOARD,
            params: {
              screen: Routes.CREATE_TAG,
            },
          })}>
            <Text>Create Tag</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
       <View style={styles.content}>
         <Button title="Logout" onPress={() => supabase.auth.signOut()} />
       </View>
      </View>
    );
  }


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
    },
    content: {
      padding: 10,
      borderBottomWidth: 1,
      borderColor: Colors.borderColor,
    },
    header: {
        padding: 10,
        paddingBottom: 0,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    divider: {
      borderTopWidth: 1,
      borderColor: 'lightgray',
      marginTop: 10,
    },
    contentText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  }); 