module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    "node_modules/(?!(react-redux|@react-native|react-native|@react-navigation|@react-native-async-storage\\/async-storage|react-native-drawer-layout|@reduxjs\\/toolkit|immer)/)"
  ],
};
