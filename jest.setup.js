import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock(
  '@react-native-async-storage/async-storage',
  () => mockAsyncStorage
);

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      getSession: jest.fn(),
    },
  }),
}));

jest.mock('react-native-config', () => ({
  SUPABASE_URL: 'test-url',
  SUPABASE_ANON_KEY: 'test-key',
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    NavigationContainer: ({ children }) => children,
    createNavigatorFactory: () => jest.fn(),
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock('@react-navigation/drawer', () => ({
  createDrawerNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));
// Mocking react-native-vector-icons to prevent errors during testing
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');
jest.mock('react-native-vector-icons/Feather', () => 'Icon');

// Mocking react-native-voice to prevent errors during testing
jest.mock('@react-native-voice/voice', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  cancel: jest.fn(),
  destroy: jest.fn(),
  removeAllListeners: jest.fn(),

  onSpeechStart: jest.fn(),
  onSpeechEnd: jest.fn(),
  onSpeechResults: jest.fn(),
  onSpeechError: jest.fn(),
}));

// Mocking react-native-tts to prevent errors during testing
jest.mock('react-native-tts', () => ({
  __esModule: true,
  default: {
    speak: jest.fn(),
    stop: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    setDefaultLanguage: jest.fn(),
    setDefaultRate: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

// Mocking react-native-gesture-handler to prevent errors during testing
jest.mock('react-native-gesture-handler', () => ({
  Swipeable: 'Swipeable',
  DrawerLayout: 'DrawerLayout',
  ScrollView: 'ScrollView',
  Slider: 'Slider',
  Switch: 'Switch',
  TextInput: 'TextInput',
  ToolbarAndroid: 'ToolbarAndroid',
  ViewPagerAndroid: 'ViewPagerAndroid',
  DrawerLayoutAndroid: 'DrawerLayoutAndroid',
  WebView: 'WebView',
  NativeViewGestureHandler: 'NativeViewGestureHandler',
  TapGestureHandler: 'TapGestureHandler',
  FlingGestureHandler: 'FlingGestureHandler',
  ForceTouchGestureHandler: 'ForceTouchGestureHandler',
  LongPressGestureHandler: 'LongPressGestureHandler',
  PanGestureHandler: 'PanGestureHandler',
  PinchGestureHandler: 'PinchGestureHandler',
  RotationGestureHandler: 'RotationGestureHandler',
  RawButton: 'RawButton',
  BaseButton: 'BaseButton',
  RectButton: 'RectButton',
  BorderlessButton: 'BorderlessButton',
  FlatList: 'FlatList',
  gestureHandlerRootHOC: jest.fn(c => c),
  GestureHandlerRootView: ({ children }) => children,
  State: {
    BEGAN: 'BEGAN',
    FAILED: 'FAILED',
    ACTIVE: 'ACTIVE',
    END: 'END',
    CANCELLED: 'CANCELLED',
    UNDETERMINED: 'UNDETERMINED',
  },
  Directions: {
    RIGHT: 1,
    LEFT: 2,
    UP: 4,
    DOWN: 8,
  },
}));