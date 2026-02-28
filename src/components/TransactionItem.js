import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const TransactionItem = ({ transaction, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isDebit = transaction.type === 'DEBIT';

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>

      <View style={styles.rightContent}>
        <Text
          style={[
            styles.amount,
            isDebit ? styles.debitAmount : styles.creditAmount,
          ]}
        >
          {isDebit ? '-' : '+'} ₹{transaction.amount}
        </Text>
        <Text style={styles.balance}>Bal: ₹{transaction.balance}</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
      >
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  leftContent: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  rightContent: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  debitAmount: {
    color: '#FF6B6B',
  },
  creditAmount: {
    color: '#4CAF50',
  },
  balance: {
    fontSize: 11,
    color: '#999',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});

export default TransactionItem;