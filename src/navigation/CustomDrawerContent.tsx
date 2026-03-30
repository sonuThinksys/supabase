import { FlatList, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { supabase } from '../supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { useNavigationState } from '@react-navigation/native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Routes } from './Routes';
import { Colors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../store/hooks';

// ─── Constants ───────────────────────────────────────────────────────────────

const DRAWER_STRINGS = {
  DASHBOARD: 'Dashboard',
  MY_TASKS: 'My Tasks',
  PROJECTS: 'Projects',
  // CREATE_TAG: 'Create Tag',
  TAGS: 'Tags',
  VOICE_ASSISTANT: '🎙️ Voice Assistant',
  LOGOUT: 'Logout',
};

type MenuItem = { label: string; route: string; adminOnly?: boolean };

const MENU_ITEMS: MenuItem[] = [
  { label: DRAWER_STRINGS.DASHBOARD,       route: Routes.DASHBOARD       },
  { label: DRAWER_STRINGS.MY_TASKS,        route: Routes.MY_TASKS        },
  { label: DRAWER_STRINGS.PROJECTS,        route: Routes.PROJECTS        },
  { label: DRAWER_STRINGS.TAGS,            route: Routes.TAGS_LIST,       adminOnly: true },
  { label: DRAWER_STRINGS.VOICE_ASSISTANT, route: Routes.VOICE_ASSISTANT },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

// useNavigationState inside drawer content receives the Drawer's own state.
// Structure: Drawer state → active drawer screen (DashboardStack) → active stack screen
const getActiveRoute = (state: any): string => {
  try {
    const drawerActive = state.routes[state.index];        // e.g. DashboardStack route
    const stackState   = drawerActive?.state;
    if (!stackState) return Routes.DASHBOARD;              // stack not yet initialised
    const leaf = stackState.routes[stackState.index ?? 0]; // active screen in stack
    return leaf?.name ?? Routes.DASHBOARD;
  } catch {
    return Routes.DASHBOARD;
  }
};

// ─── DrawerMenuItem ───────────────────────────────────────────────────────────

type DrawerMenuItemProps = {
  item: MenuItem;
  isSelected: boolean;
  onSelect: (route: string) => void;
};

function DrawerMenuItem({ item, isSelected, onSelect }: DrawerMenuItemProps) {
  const handlePress = useCallback(() => {
    onSelect(item.route);
  }, [onSelect, item.route]);
  return (
    <TouchableOpacity
      style={[styles.menuItem, isSelected && styles.menuItemSelected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {isSelected && <View style={styles.selectedBar} />}
      <Text style={[styles.menuItemText, isSelected && styles.menuItemTextSelected]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── CustomDrawerContent ──────────────────────────────────────────────────────

export default function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<any>(null);
  const activeRoute  = useNavigationState(getActiveRoute);
  const role = useAppSelector(state => state.user.role);
  const isAdmin = role === 'admin';
  const FilterMenuItems = MENU_ITEMS.filter(item => {
    if (item.adminOnly) { return isAdmin; }
    return true;
  });
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);
  const onSelectItem = useCallback((route: string) => {
    if (route === Routes.DASHBOARD) {
      // Reset DashboardStack back to its root screen
      navigation.navigate(Routes.DASHBOARD, { screen: Routes.DASHBOARD });
    } else {
      // Navigate to a nested screen inside DashboardStack
      navigation.navigate(Routes.DASHBOARD, { screen: route });
    }
    navigation.closeDrawer();
  }, [navigation]);

  const onLogout = useCallback(() => {
    supabase.auth.signOut();
  }, []);

  const keyExtractor = useCallback((item: MenuItem) => item.route, []);

  const renderItem = useCallback(({ item }: { item: MenuItem }) => (
    <DrawerMenuItem
      item={item}
      isSelected={activeRoute === item.route}
      onSelect={onSelectItem}
    />
  ), [activeRoute, onSelectItem]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.headerText} numberOfLines={1}>{user?.email}</Text>
      </View>
      <View style={styles.divider} />
      {/* Menu */}
      <FlatList
        data={FilterMenuItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={styles.menuList}
      />

      <View style={styles.divider} />

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <Button color={Colors.primary} title={DRAWER_STRINGS.LOGOUT} onPress={onLogout} />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },

  // Header
  header: {
    padding: 10,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    flexShrink: 1,
  },
  // Divider
  divider: {
    borderTopWidth: 1,
    borderColor: Colors.borderColor,
    marginTop: 10,
  },
  // Menu list
  menuList: {
    flex: 1,
    marginTop: 8,
  },
  // Menu item
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 2,
    overflow: 'hidden',
  },
  menuItemSelected: {
    backgroundColor: Colors.pageBg,
  },
  selectedBar: {
    width: 4,
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    marginRight: 10,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  menuItemText: {
    fontSize: 15,
    color: Colors.subText,
    paddingLeft: 8,
  },
  menuItemTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  // Logout
  logoutContainer: {
    paddingVertical: 12,
  },
}); 