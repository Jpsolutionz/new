import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

const LedgerCard = ({ ledger, onDelete, onPress }) => {
  const [showRemove, setShowRemove] = useState(false);

  const handleLongPress = () => {
    setShowRemove(true);
  };

  const handleRemove = () => {
    Alert.alert(
      'Delete Ledger',
      `Are you sure you want to delete "${ledger.name}"?`,
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => setShowRemove(false)
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            onDelete();
            setShowRemove(false);
          },
        },
      ]
    );
  };

  const handlePress = () => {
    if (showRemove) {
      setShowRemove(false);
    } else if (onPress) {
      onPress();
    }
  };

  // Use ledger's own interest rate
  const interestRate = ledger.interestRate || 0;
  
  // Calculate interest on credit amount
  const creditAmount = ledger.totalCredit || 0;
  const interest = (creditAmount * parseFloat(interestRate)) / 100;

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{ledger.name}</Text>
        <Text style={styles.mobile}>{ledger.mobile || 'No phone'}</Text>
        <Text style={styles.creditAmount}>
          Total Credit: ₹{ledger.totalCredit || 0}
        </Text>
        {interestRate > 0 && (
          <Text style={styles.interestAmount}>
            Interest @ {interestRate}%: ₹{interest.toFixed(2)}
          </Text>
        )}
      </View>
      <View style={styles.actions}>
        <Text
          style={[
            styles.balance,
            (ledger.balance || ledger.currentBalance || 0) < 0
              ? styles.negativeBalance
              : styles.positiveBalance,
          ]}
        >
          ₹{Math.abs(ledger.balance || ledger.currentBalance || 0)}
        </Text>
        {showRemove && (
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={handleRemove}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  mobile: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  creditAmount: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  interestAmount: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginTop: 2,
  },
  actions: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  positiveBalance: {
    color: '#4CAF50',
  },
  negativeBalance: {
    color: '#FF6B6B',
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default LedgerCard;