import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
  Share,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import TransactionItem from '../components/TransactionItem';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const LedgerDetailsScreen = ({ route, navigation }) => {
  const { ledger } = route.params;
  const { state, deleteTransaction } = useContext(AuthContext);
  const [currentLedger, setCurrentLedger] = useState(ledger);

  useEffect(() => {
    const updatedLedger = state.ledgers.find((l) => l.id === ledger.id);
    if (updatedLedger) {
      setCurrentLedger(updatedLedger);
    }
  }, [state.ledgers]);

  const transactions = currentLedger?.transactions || [];
  const totalCredit = transactions
    .filter((t) => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions
    .filter((t) => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleDeleteTransaction = (transactionId) => {
    Alert.alert('Delete Transaction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTransaction(ledger.id, transactionId),
      },
    ]);
  };

  const handleShare = async () => {
    try {
      const message = `
Ledger: ${currentLedger.name}
Mobile: ${currentLedger.mobile}
Balance: ₹${currentLedger.currentBalance}
Credit: ₹${totalCredit}
Debit: ₹${totalDebit}

Managed by Just Perfect Solutionz
      `.trim();

      await Share.share({
        message,
        title: `${currentLedger.name} - Ledger`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Get user's company name from AsyncStorage for top of PDF
      const userCompanyName = await AsyncStorage.getItem('companyName') || 'Company Name';
      
      // Fixed company name for footer
      const managedBy = 'JUST PERFECT SOLUTIONZ';
      
      // Generate HTML content for PDF
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .company-header { text-align: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 3px solid #0066cc; }
    .company-name { font-size: 24px; font-weight: bold; color: #0066cc; margin: 0; }
    .header { text-align: center; margin-bottom: 30px; padding-bottom: 10px; }
    .header h1 { color: #333; margin: 10px 0; font-size: 20px; }
    .info { margin: 20px 0; }
    .info-row { margin: 8px 0; }
    .label { font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #0066cc; color: white; }
    .credit { color: #4CAF50; font-weight: bold; }
    .debit { color: #FF6B6B; font-weight: bold; }
    .summary { margin-top: 30px; border-top: 2px solid #0066cc; padding-top: 20px; }
    .summary-row { margin: 10px 0; font-size: 16px; }
    .total { font-size: 18px; font-weight: bold; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="company-header">
    <h1 class="company-name">${userCompanyName}</h1>
  </div>
  
  <div class="header">
    <h1>Ledger Statement</h1>
    <p>Generated on ${new Date().toLocaleDateString()}</p>
  </div>
  
  <div class="info">
    <div class="info-row">
      <span class="label">Name:</span> ${currentLedger.name}
    </div>
    <div class="info-row">
      <span class="label">Mobile:</span> ${currentLedger.mobile || 'N/A'}
    </div>
    ${currentLedger.notes ? `<div class="info-row"><span class="label">Notes:</span> ${currentLedger.notes}</div>` : ''}
  </div>
  
  <h2>Transactions</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Type</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${transactions.length === 0 ? '<tr><td colspan="4" style="text-align: center;">No transactions</td></tr>' : 
        transactions.map(txn => `
          <tr>
            <td>${new Date(txn.date || txn.created_at).toLocaleDateString()}</td>
            <td>${txn.description}</td>
            <td class="${txn.type.toLowerCase()}">${txn.type}</td>
            <td class="${txn.type.toLowerCase()}">₹${txn.amount}</td>
          </tr>
        `).join('')
      }
    </tbody>
  </table>
  
  <div class="summary">
    <div class="summary-row">
      <span class="label">Total Credit:</span>
      <span class="credit">₹${totalCredit}</span>
    </div>
    <div class="summary-row">
      <span class="label">Total Debit:</span>
      <span class="debit">₹${totalDebit}</span>
    </div>
    <div class="summary-row total">
      <span class="label">Current Balance:</span>
      <span class="${currentLedger.currentBalance >= 0 ? 'credit' : 'debit'}">₹${Math.abs(currentLedger.currentBalance)}</span>
    </div>
  </div>
  
  <div class="footer">
    <p>Managed by ${managedBy}</p>
    <p>This is a computer-generated document</p>
  </div>
</body>
</html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      // Share or save the PDF
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `${currentLedger.name} - Ledger Statement`,
          UTI: 'com.adobe.pdf',
        });
      }
      
      Alert.alert('Success', 'PDF generated successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ledger Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.ledgerHeader}>
            <View>
              <Text style={styles.ledgerName}>{currentLedger.name}</Text>
              <Text style={styles.ledgerMobile}>{currentLedger.mobile}</Text>
            </View>
            <Text style={styles.balance}>₹{currentLedger.currentBalance}</Text>
          </View>

          {currentLedger.notes && (
            <Text style={styles.notes}>Note: {currentLedger.notes}</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.debitButton]}
            onPress={() => {
              // Check if there's any credit balance before allowing debit
              const currentBalance = currentLedger.currentBalance || 0;
              if (currentBalance <= 0) {
                Alert.alert(
                  'Cannot Add Debit',
                  'Please add credit amount first before adding debit.',
                  [{ text: 'OK' }]
                );
                return;
              }
              navigation.navigate('AddTransaction', {
                ledgerId: ledger.id,
                type: 'DEBIT',
              });
            }}
          >
            <Text style={styles.actionButtonText}>- Debit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.creditButton]}
            onPress={() =>
              navigation.navigate('AddTransaction', {
                ledgerId: ledger.id,
                type: 'CREDIT',
              })
            }
          >
            <Text style={styles.actionButtonText}>+ Credit</Text>
          </TouchableOpacity>
        </View>

        {/* Share & Download */}
        <View style={styles.shareSection}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Text style={styles.shareButtonText}>📤 Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadPDF}
          >
            <Text style={styles.downloadButtonText}>📥 Download PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Transactions</Text>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No transactions yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add a debit or credit to get started
              </Text>
            </View>
          ) : (
            <FlatList
              data={[...transactions].reverse()}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TransactionItem
                  transaction={item}
                  onDelete={() => handleDeleteTransaction(item.id)}
                />
              )}
            />
          )}
        </View>

        {/* Summary */}
        {transactions.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Credit:</Text>
              <Text style={styles.creditText}>₹{totalCredit}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Debit:</Text>
              <Text style={styles.debitText}>₹{totalDebit}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryRowBold]}>
              <Text style={styles.summaryLabelBold}>Balance:</Text>
              <Text
                style={[
                  styles.balanceText,
                  currentLedger.currentBalance < 0
                    ? styles.negativeBal
                    : styles.positiveBal,
                ]}
              >
                ₹{currentLedger.currentBalance}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ledgerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  ledgerMobile: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  notes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  debitButton: {
    backgroundColor: '#FF6B6B',
  },
  creditButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  shareSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryRowBold: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  creditText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  debitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positiveBal: {
    color: '#4CAF50',
  },
  negativeBal: {
    color: '#FF6B6B',
  },
});

export default LedgerDetailsScreen;