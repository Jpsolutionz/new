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
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LedgerCard from '../components/LedgerCard';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

const DashboardScreen = ({ navigation }) => {
  const { state, signOut, loadLedgers, deleteLedger } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPeople: 0,
    totalCredit: 0,
    totalDebit: 0,
    totalInterest: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLedgers, setFilteredLedgers] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerAnimation] = useState(new Animated.Value(-300));
  const [showDateModal, setShowDateModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      console.log('Dashboard focused - loading ledgers');
      const loadData = async () => {
        setRefreshing(true);
        await loadLedgers();
        setRefreshing(false);
      };
      loadData();
    }, [loadLedgers])
  );

  // Log ledgers whenever they change
  useEffect(() => {
    console.log('Ledgers updated in Dashboard:', state.ledgers.length, 'ledgers');
    console.log('Ledger details:', JSON.stringify(state.ledgers, null, 2));
    calculateStats();
    filterLedgers(searchQuery);
  }, [state.ledgers]);

  // Filter ledgers when search query changes
  useEffect(() => {
    filterLedgers(searchQuery);
  }, [searchQuery, state.ledgers]);

  const filterLedgers = (query) => {
    if (!query.trim()) {
      setFilteredLedgers(state.ledgers);
    } else {
      const filtered = state.ledgers.filter(ledger =>
        ledger.name.toLowerCase().includes(query.toLowerCase()) ||
        (ledger.mobile && ledger.mobile.includes(query)) ||
        (ledger.notes && ledger.notes.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredLedgers(filtered);
    }
  };

  const calculateStats = () => {
    // Total People = number of ledgers
    const totalPeople = state.ledgers.length;
    
    // Total Credit = sum of all credit amounts across all ledgers
    let totalCredit = 0;
    let totalDebit = 0;
    let totalInterest = 0;
    
    state.ledgers.forEach((ledger) => {
      if (ledger.transactions && ledger.transactions.length > 0) {
        ledger.transactions.forEach((txn) => {
          if (txn.type === 'CREDIT') {
            totalCredit += txn.amount;
          } else if (txn.type === 'DEBIT') {
            totalDebit += txn.amount;
          }
        });
      }
      
      // Calculate interest for this ledger using its own rate
      const ledgerRate = ledger.interestRate || 0;
      const ledgerCredit = ledger.totalCredit || 0;
      const ledgerInterest = (ledgerCredit * ledgerRate) / 100;
      totalInterest += ledgerInterest;
    });

    setStats({ totalPeople, totalCredit, totalDebit, totalInterest });
  };

  // Recalculate stats whenever ledgers change
  useEffect(() => {
    calculateStats();
  }, [state.ledgers]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const handleDeleteLedger = (ledgerId) => {
    deleteLedger(ledgerId);
  };

  const toggleDrawer = () => {
    if (drawerVisible) {
      Animated.timing(drawerAnimation, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerVisible(false));
    } else {
      setDrawerVisible(true);
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleDownloadLedger = () => {
    toggleDrawer();
    // Refresh ledgers before showing date modal
    loadLedgers().then(() => {
      setShowDateModal(true);
    });
  };

  const formatDateInput = (text, setDate) => {
    // Remove all non-numeric characters for processing
    const numbersOnly = text.replace(/[^0-9]/g, '');
    
    // Auto-format as DD-MM-YYYY
    let formatted = numbersOnly;
    if (numbersOnly.length >= 3) {
      formatted = numbersOnly.slice(0, 2) + '-' + numbersOnly.slice(2);
    }
    if (numbersOnly.length >= 5) {
      formatted = numbersOnly.slice(0, 2) + '-' + numbersOnly.slice(2, 4) + '-' + numbersOnly.slice(4, 8);
    }
    
    setDate(formatted);
  };

  const generatePDF = async () => {
    try {
      // Validate dates
      if (!startDate || !endDate) {
        Alert.alert('Error', 'Please select both start and end dates');
        return;
      }

      // Parse dates (format: DD-MM-YYYY)
      const parseDate = (dateStr) => {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
      };

      const start = parseDate(startDate);
      const end = parseDate(endDate);

      if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        Alert.alert('Error', 'Invalid date format. Use DD-MM-YYYY (e.g., 01-02-2026)');
        return;
      }

      if (start > end) {
        Alert.alert('Error', 'Start date must be before end date');
        return;
      }

      // Get user's company name
      const userCompanyName = await AsyncStorage.getItem('companyName') || 'Trueval';
      
      console.log('Generating multi-page PDF...');
      console.log('Date range:', startDate, 'to', endDate);
      console.log('Total ledgers:', state.ledgers.length);
      console.log('Ledger names:', state.ledgers.map(l => l.name).join(', '));
      
      // Filter transactions by date range for all ledgers
      // BUT keep all ledgers even if they have no transactions in the range
      const filteredLedgers = state.ledgers.map(ledger => {
        const filteredTransactions = (ledger.transactions || []).filter(txn => {
          const txnDate = new Date(txn.created_at);
          return txnDate >= start && txnDate <= end;
        });
        
        return {
          ...ledger,
          transactions: filteredTransactions,
          // Recalculate totals based on filtered transactions
          totalCredit: filteredTransactions
            .filter(t => t.type === 'CREDIT')
            .reduce((sum, t) => sum + t.amount, 0),
          totalDebit: filteredTransactions
            .filter(t => t.type === 'DEBIT')
            .reduce((sum, t) => sum + t.amount, 0),
        };
      });
      // Don't filter out ledgers - show ALL ledgers even if no transactions in date range

      console.log('Filtered ledgers count:', filteredLedgers.length);
      console.log('Filtered ledger names:', filteredLedgers.map(l => l.name).join(', '));

      if (filteredLedgers.length === 0) {
        Alert.alert('No Data', 'No ledgers found');
        return;
      }

      // Calculate grand totals across all ledgers
      const grandTotalCredit = filteredLedgers.reduce((sum, ledger) => sum + ledger.totalCredit, 0);
      const grandTotalDebit = filteredLedgers.reduce((sum, ledger) => sum + ledger.totalDebit, 0);
      const totalLedgerCount = filteredLedgers.length;

      // Generate HTML for multi-page PDF
      // Each ledger gets its own section, and we use CSS page-break to handle pagination
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            
            body {
              font-family: Arial, sans-serif;
              font-size: 10pt;
              margin: 0;
              padding: 0;
            }
            
            .page-header {
              text-align: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #333;
            }
            
            .company-name {
              font-size: 18pt;
              font-weight: bold;
              color: #333;
              margin-bottom: 5px;
            }
            
            .report-title {
              font-size: 14pt;
              color: #666;
              margin-bottom: 3px;
            }
            
            .date-range {
              font-size: 9pt;
              color: #888;
            }
            
            .ledger-section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            
            .ledger-header {
              background-color: #f0f0f0;
              padding: 8px;
              margin-bottom: 10px;
              border-left: 4px solid #0066cc;
            }
            
            .ledger-name {
              font-size: 12pt;
              font-weight: bold;
              color: #333;
            }
            
            .ledger-info {
              font-size: 9pt;
              color: #666;
              margin-top: 3px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            
            th {
              background-color: #0066cc;
              color: white;
              padding: 8px;
              text-align: left;
              font-size: 9pt;
              font-weight: bold;
            }
            
            td {
              padding: 6px 8px;
              border-bottom: 1px solid #ddd;
              font-size: 9pt;
            }
            
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            
            .credit {
              color: #008000;
              font-weight: bold;
            }
            
            .debit {
              color: #cc0000;
              font-weight: bold;
            }
            
            .summary {
              margin-top: 10px;
              padding: 8px;
              background-color: #f5f5f5;
              border-radius: 4px;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
              font-size: 9pt;
            }
            
            .summary-label {
              font-weight: bold;
            }
            
            .balance-positive {
              color: #008000;
              font-weight: bold;
            }
            
            .balance-negative {
              color: #cc0000;
              font-weight: bold;
            }
            
            .page-break {
              page-break-after: always;
            }
            
            .grand-total-section {
              margin-top: 30px;
              padding: 15px;
              background-color: #f9f9f9;
              border: 2px solid #0066cc;
              page-break-inside: avoid;
            }
            
            .grand-total-header {
              font-size: 14pt;
              font-weight: bold;
              color: #0066cc;
              text-align: center;
              margin-bottom: 15px;
              border-bottom: 2px solid #0066cc;
              padding-bottom: 8px;
            }
            
            .grand-total-row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              font-size: 11pt;
              font-weight: bold;
            }
            
            .grand-total-label {
              color: #333;
            }
            
            .grand-total-value {
              color: #0066cc;
            }
            
            .footer {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 8pt;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="page-header">
            <div class="company-name">${userCompanyName}</div>
            <div class="report-title">All Ledgers Statement</div>
            <div class="date-range">Period: ${startDate} to ${endDate}</div>
            <div class="date-range">Generated: ${new Date().toLocaleString()}</div>
          </div>
          
          ${filteredLedgers.map((ledger, ledgerIndex) => `
            <div class="ledger-section">
              <div class="ledger-header">
                <div class="ledger-name">${ledger.name}</div>
                <div class="ledger-info">
                  Mobile: ${ledger.mobile || 'N/A'} | 
                  ${ledger.notes ? `Notes: ${ledger.notes}` : ''}
                </div>
              </div>
              
              <div class="summary">
                <div class="summary-row">
                  <span class="summary-label">Total Credit Transactions:</span>
                  <span class="credit">${ledger.transactions.filter(t => t.type === 'CREDIT').length} times</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Total Amount Credited:</span>
                  <span class="credit">₹${ledger.totalCredit.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Total Debit Transactions:</span>
                  <span class="debit">${ledger.transactions.filter(t => t.type === 'DEBIT').length} times</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Total Amount Debited:</span>
                  <span class="debit">₹${ledger.totalDebit.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Current Balance:</span>
                  <span class="${ledger.balance >= 0 ? 'balance-positive' : 'balance-negative'}">
                    ₹${Math.abs(ledger.balance).toFixed(2)} ${ledger.balance >= 0 ? 'CR' : 'DR'}
                  </span>
                </div>
              </div>
            </div>
            
          `).join('')}
          
          <div class="grand-total-section">
            <div class="grand-total-header">OVERALL SUMMARY</div>
            <div class="grand-total-row">
              <span class="grand-total-label">Total Number of Ledger Cards:</span>
              <span class="grand-total-value">${totalLedgerCount}</span>
            </div>
            <div class="grand-total-row">
              <span class="grand-total-label">Total Credit Amount (All Ledgers):</span>
              <span class="grand-total-value credit">₹${grandTotalCredit.toFixed(2)}</span>
            </div>
            <div class="grand-total-row">
              <span class="grand-total-label">Total Debit Amount (All Ledgers):</span>
              <span class="grand-total-value debit">₹${grandTotalDebit.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            Generated by Perfect Ledger App | Page automatically breaks for readability
          </div>
        </body>
        </html>
      `;

      // Generate PDF using expo-print
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      console.log('PDF generated at:', uri);
      
      // Share the PDF
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'All Ledgers Statement',
        UTI: 'com.adobe.pdf',
      });
      
      setShowDateModal(false);
      setStartDate('');
      setEndDate('');
      
      Alert.alert('Success', `PDF generated with ${filteredLedgers.length} ledger(s)! The PDF will automatically create multiple pages as needed.`);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert('Error', error.message || 'Failed to generate PDF');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={toggleDrawer}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfect Ledger</Text>
        </View>
      </View>

      {/* Slide-out Drawer */}
      {drawerVisible && (
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={toggleDrawer}
        >
          <Animated.View
            style={[
              styles.drawerContainer,
              { transform: [{ translateX: drawerAnimation }] }
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity onPress={toggleDrawer}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={handleDownloadLedger}
            >
              <Text style={styles.drawerIcon}>📥</Text>
              <Text style={styles.drawerItemText}>Download Ledger</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                toggleDrawer();
                navigation.navigate('ChangePassword');
              }}
            >
              <Text style={styles.drawerIcon}>🔐</Text>
              <Text style={styles.drawerItemText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                toggleDrawer();
                handleLogout();
              }}
            >
              <Text style={styles.drawerIcon}>🚪</Text>
              <Text style={styles.drawerItemText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Stats Section - All Four in One Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <StatCard
              title="Total People"
              value={stats.totalPeople.toString()}
              icon="👥"
              color="#4CAF50"
            />
          </View>
          <View style={styles.statBox}>
            <StatCard
              title="Total Credit"
              value={`₹${stats.totalCredit}`}
              icon="📈"
              color="#2196F3"
            />
          </View>
          <View style={styles.statBox}>
            <StatCard
              title="Total Debit"
              value={`₹${stats.totalDebit}`}
              icon="📉"
              color="#FF6B6B"
            />
          </View>
          <View style={styles.statBox}>
            <StatCard
              title="Total Interest"
              value={`₹${stats.totalInterest.toFixed(2)}`}
              icon="💰"
              color="#FF9800"
              subtitle="From all ledgers"
            />
          </View>
        </View>

        {/* Add Ledger Button */}
        <TouchableOpacity
          style={styles.addLedgerButton}
          onPress={() => navigation.navigate('AddLedger')}
        >
          <Text style={styles.addLedgerButtonText}>+ Add Ledger</Text>
        </TouchableOpacity>

        {/* Ledgers List */}
        <View style={styles.ledgersSection}>
          <Text style={styles.sectionTitle}>Your Ledgers</Text>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, mobile, or notes..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredLedgers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No ledgers found' : 'No ledgers yet'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Create your first ledger to get started'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredLedgers}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <LedgerCard
                  ledger={item}
                  onPress={() => navigation.navigate('LedgerDetails', { ledger: item })}
                  onDelete={() => handleDeleteLedger(item.id)}
                />
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Date Range Modal */}
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dateModalContent}>
            <Text style={styles.modalTitle}>Download All Ledgers</Text>
            <Text style={styles.dateModalSubtitle}>Select date range for transactions</Text>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Start Date:</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="01-02-2026"
                value={startDate}
                onChangeText={(text) => formatDateInput(text, setStartDate)}
                keyboardType="numeric"
                maxLength={10}
              />
              <Text style={styles.dateHint}>Format: DD-MM-YYYY</Text>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>End Date:</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="20-02-2026"
                value={endDate}
                onChangeText={(text) => formatDateInput(text, setEndDate)}
                keyboardType="numeric"
                maxLength={10}
              />
              <Text style={styles.dateHint}>Format: DD-MM-YYYY</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowDateModal(false);
                  setStartDate('');
                  setEndDate('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={generatePDF}
              >
                <Text style={styles.confirmButtonText}>Generate PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  menuButton: {
    position: 'absolute',
    left: 20,
    top: 0,
    padding: 8,
  },
  menuIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  drawerHeader: {
    backgroundColor: '#1e3a8a',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  drawerIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  drawerItemText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  logoutButton: {
    position: 'absolute',
    right: 20,
    top: 0,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    marginHorizontal: 4,
  },
  addLedgerButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addLedgerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ledgersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1e3a8a',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 28,
  },
  modalInput: {
    flex: 1,
    padding: 14,
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  percentSymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    paddingRight: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#1e3a8a',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  dateModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  dateModalSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  dateHint: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default DashboardScreen;