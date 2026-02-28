import React from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';

const LoadingSpinner = () => {
  const logo = require('../../assets/images/icon.png');

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <ActivityIndicator size="large" color="#0066cc" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});

export default LoadingSpinner;