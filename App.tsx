import { Provider } from 'react-redux';
import AppNavigator from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}