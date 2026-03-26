import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/Dashboard';
import MyTasksScreen from '../screens/MyTasks/index';
import ProjectsScreen from '../screens/Projects/index';
import CreateTagScreen from '../screens/Tags/CreateTags';
import CustomDrawerContent from './CustomDrawerContent';
import { Routes } from './Routes';
import CreateProjectScreen from '../screens/Projects/CreateProject';
import DashboardStack from './DashboardStack';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={() => <CustomDrawerContent />} 
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        width: 280,
      },
    }}
    initialRouteName={Routes.DASHBOARD}
    >
      <Drawer.Screen name={Routes.DASHBOARD} component={DashboardStack} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}

