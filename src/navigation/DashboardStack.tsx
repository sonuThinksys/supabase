import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './Routes';
import { DashboardStackParamList } from './types';
import DashboardScreen from '../screens/Dashboard';
import MyTasksScreen from '../screens/MyTasks';
import CreateTaskScreen from '../screens/MyTasks/CreateTask';
import CreateTagScreen from '../screens/Tags/CreateTags';
import TagsListScreen from '../screens/Tags/TagsList';
import ProjectsStack from './ProjectsStack';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export default function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.DASHBOARD} component={DashboardScreen} />
      <Stack.Screen name={Routes.MY_TASKS} component={MyTasksScreen} />
      <Stack.Screen name={Routes.PROJECTS} component={ProjectsStack} />
      <Stack.Screen name={Routes.CREATE_TASK} component={CreateTaskScreen} />
      <Stack.Screen name={Routes.CREATE_TAG} component={CreateTagScreen} />
      <Stack.Screen name={Routes.TAGS_LIST} component={TagsListScreen} />
    </Stack.Navigator>
  );
}