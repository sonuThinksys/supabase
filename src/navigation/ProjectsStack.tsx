import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './Routes';
import { ProjectsStackParamList } from './types';
import ProjectsScreen from '../screens/Projects/ProjectsList';
import CreateProjectScreen from '../screens/Projects/CreateProject';
import ProjectTodosScreen from '../screens/Projects/ProjectTodos';
import AddProjectMemberScreen from '../screens/Projects/AddProjectMember';

const Stack = createNativeStackNavigator<ProjectsStackParamList>();

export default function ProjectsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.PROJECTS} component={ProjectsScreen} />
      <Stack.Screen name={Routes.CREATE_PROJECT} component={CreateProjectScreen} />
      <Stack.Screen name={Routes.PROJECT_TODOS} component={ProjectTodosScreen} />
      <Stack.Screen name={Routes.ADD_PROJECT_MEMBER} component={AddProjectMemberScreen} />
    </Stack.Navigator>
  );
}