import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppRegistry } from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello! App is Working!</Text>
      <Text style={styles.subtext}>If you see this, React Native is rendering correctly</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default App;

// Register the app for web
AppRegistry.registerComponent('main', () => App);
