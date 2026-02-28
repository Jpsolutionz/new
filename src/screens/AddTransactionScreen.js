import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const AddTransactionScreen = ({ route, navigation }) => {
  const { ledgerId, type } = route.params;
  const { addTransaction } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [interestRate, setInterestRate] = useState('0');
  
  // Format date as DD-MM-YYYY
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  const [date, setDate] = useState(getCurrentDate());
  const [loading, setLoading] = useState(false);

  // Calculate interest amount automatically
  const calculateInterestAmount = () => {
    const numAmount = parseFloat(amount) || 0;
    const numRate = parseFloat(interestRate) || 0;
    return (numAmount * numRate) / 100;
  };

  const handleAddTransaction = async () => {
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter amount');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Validate date format DD-MM-YYYY
    const datePattern = /^\d{2}-\d{2}-\d{4}$/;
    if (!datePattern.test(date)) {
      Alert.alert('Error', 'Please enter date in DD-MM-YYYY format');
      return;
    }

    setLoading(true);
    try {
      await addTransaction(ledgerId, {
        type,
        amount: numAmount,
        description: description || `${type} Transaction`,
        date,
        interestRate: type === 'CREDIT' ? (parseFloat(interestRate) || 0) : 0,
      });

      Alert.alert('Success', 'Transaction added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formSection}>
            <View
              style={[
                styles.typeCard,
                type === 'DEBIT'
                  ? styles.debitCard
                  : styles.creditCard,
              ]}
            >
              <Text style={styles.typeText}>
                {type === 'DEBIT' ? '💸 Debit' : '💰 Credit'}
              </Text>
            </View>

            <Text style={styles.label}>Amount *</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                editable={!loading}
              />
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Goods Purchase, Payment Received"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              editable={!loading}
            />

            {type === 'CREDIT' && (
              <>
                <Text style={styles.label}>Interest Rate (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 5 for 5% interest"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={interestRate}
                  onChangeText={setInterestRate}
                  editable={!loading}
                />
                <Text style={styles.hint}>
                  Set interest rate for this credit amount (default: 0%)
                </Text>
                
                {(amount && parseFloat(amount) > 0 && parseFloat(interestRate) > 0) && (
                  <View style={styles.interestCalculation}>
                    <Text style={styles.calculationLabel}>Interest Amount:</Text>
                    <Text style={styles.calculationValue}>
                      ₹{calculateInterestAmount().toFixed(2)}
                    </Text>
                  </View>
                )}
              </>
            )}

            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD-MM-YYYY (e.g., 17-02-2026)"
              placeholderTextColor="#999"
              value={date}
              onChangeText={setDate}
              editable={!loading}
              maxLength={10}
            />

            <TouchableOpacity
              style={[styles.addButton, loading && styles.disabledButton]}
              onPress={handleAddTransaction}
              disabled={loading}
            >
              <Text style={styles.addButtonText}>
                {loading ? 'Adding...' : 'Add Transaction'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeCard: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  debitCard: {
    backgroundColor: '#FFE8E8',
  },
  creditCard: {
    backgroundColor: '#E8F5E9',
  },
  typeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  interestCalculation: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calculationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  calculationValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
});

export default AddTransactionScreen;