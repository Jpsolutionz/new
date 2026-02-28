import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={[styles.card, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 75,
  },
  icon: {
    fontSize: 20,
    marginBottom: 3,
  },
  title: {
    fontSize: 9,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 3,
    textAlign: 'center',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 8,
    color: '#fff',
    opacity: 0.85,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default StatCard;