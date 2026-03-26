
import {AppRegistry} from 'react-native';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import App from './App';
import {name as appName} from './app.json';
if (__DEV__) {
    require("./ReactotronConfig");
  }
AppRegistry.registerComponent(appName, () => App);
