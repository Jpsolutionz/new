import { createContext, useReducer, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';

export const AuthContext = createContext();

const initialState = {
  isSignedIn: false,
  user: null,
  token: null,
  ledgers: [],
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isSignedIn: true,
        user: action.payload.user,
        token: action.payload.token,
        ledgers: [], // Clear ledgers on login
      };
    case 'LOGOUT':
      return {
        ...state,
        isSignedIn: false,
        user: null,
        token: null,
        ledgers: [], // Clear ledgers on logout
      };
    case 'SET_LEDGERS':
      return {
        ...state,
        ledgers: action.payload,
      };
    case 'ADD_LEDGER':
      return {
        ...state,
        ledgers: [...state.ledgers, action.payload],
      };
    case 'DELETE_LEDGER':
      return {
        ...state,
        ledgers: state.ledgers.filter(ledger => ledger.id !== action.payload),
      };
    case 'RESTORE_TOKEN':
      return {
        ...state,
        isSignedIn: true,
        user: action.payload.user,
        token: action.payload.token,
        ledgers: [], // Clear ledgers when restoring token
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadLedgersFunc = useCallback(async () => {
    try {
      console.log('=== LOAD LEDGERS START ===');
      
      const response = await ApiService.getMyLedgers();
      console.log('Backend returned', response.entries?.length || 0, 'entries');
      
      if (!response.entries || response.entries.length === 0) {
        console.log('No entries from backend');
        dispatch({ type: 'SET_LEDGERS', payload: [] });
        return;
      }
      
      // Simple approach: Parse each entry and build ledgers
      const ledgerMap = new Map();
      
      response.entries.forEach((entry, index) => {
        console.log(`Entry ${index}:`, entry.description);
        
        // Check if this is a ledger creation entry
        if (entry.description && entry.description.includes('Ledger:')) {
          // Extract ledger info from description
          // Format: "Ledger: Name - Mobile - Notes - Interest:5%"
          const parts = entry.description.replace('Ledger:', '').split('-').map(p => p.trim());
          
          const name = parts[0] || 'Unnamed';
          const mobile = parts[1] || '';
          let notes = '';
          let interestRate = 0;
          
          // Check if there's an interest rate in the parts
          for (let i = 2; i < parts.length; i++) {
            if (parts[i].startsWith('Interest:')) {
              interestRate = parseFloat(parts[i].replace('Interest:', '').replace('%', '')) || 0;
            } else if (!notes) {
              notes = parts[i];
            }
          }
          
          const ledgerId = entry.id || entry._id || String(index);
          
          console.log(`Found ledger: ${name} (ID: ${ledgerId}, Interest: ${interestRate}%)`);
          
          ledgerMap.set(ledgerId, {
            id: ledgerId,
            name: name,
            mobile: mobile,
            notes: notes,
            interestRate: interestRate,
            transactions: [],
            balance: 0,
            currentBalance: 0,
            totalCredit: 0,
            totalDebit: 0,
            created_at: entry.created_at
          });
        } else if (entry.description && entry.description.includes('[LEDGER:')) {
          // This is a transaction for a specific ledger
          const match = entry.description.match(/\[LEDGER:([^\]]+)\]/);
          const targetLedgerId = match ? match[1] : null;
          
          if (targetLedgerId && ledgerMap.has(targetLedgerId)) {
            // Extract interest rate from description if present
            let interestRate = 0;
            let cleanDesc = entry.description.replace(/\[LEDGER:[^\]]+\]\s*/, '');
            
            const interestMatch = cleanDesc.match(/- Interest:([\d.]+)%/);
            if (interestMatch) {
              interestRate = parseFloat(interestMatch[1]) || 0;
              cleanDesc = cleanDesc.replace(/\s*- Interest:[\d.]+%/, '');
            }
            
            const transaction = {
              id: entry.id || entry._id || String(Math.random()),
              type: entry.type.toUpperCase(),
              amount: entry.amount || 0,
              description: cleanDesc,
              date: entry.created_at,
              created_at: entry.created_at,
              interestRate: interestRate
            };
            
            ledgerMap.get(targetLedgerId).transactions.push(transaction);
            
            // Update balance
            const ledger = ledgerMap.get(targetLedgerId);
            if (transaction.type === 'CREDIT') {
              ledger.balance += transaction.amount;
              ledger.totalCredit += transaction.amount;
            } else if (transaction.type === 'DEBIT') {
              ledger.balance -= transaction.amount;
              ledger.totalDebit += transaction.amount;
            }
            ledger.currentBalance = ledger.balance;
          }
        }
      });
      
      // Calculate weighted average interest rate for each ledger based on credit transactions
      ledgerMap.forEach((ledger) => {
        const creditTransactions = ledger.transactions.filter(t => t.type === 'CREDIT');
        if (creditTransactions.length > 0) {
          // Calculate weighted average: sum(amount * rate) / sum(amount)
          let totalWeightedRate = 0;
          let totalCreditAmount = 0;
          
          creditTransactions.forEach(txn => {
            totalWeightedRate += txn.amount * txn.interestRate;
            totalCreditAmount += txn.amount;
          });
          
          ledger.interestRate = totalCreditAmount > 0 ? totalWeightedRate / totalCreditAmount : 0;
        } else {
          ledger.interestRate = 0;
        }
      });
      
      const ledgers = Array.from(ledgerMap.values());
      console.log(`=== FINAL: ${ledgers.length} ledgers found ===`);
      ledgers.forEach(l => console.log(`  - ${l.name} (${l.mobile})`));
      
      dispatch({ type: 'SET_LEDGERS', payload: ledgers });
      console.log('=== LOAD LEDGERS SUCCESS ===');
    } catch (error) {
      console.error('=== LOAD LEDGERS ERROR ===');
      console.error('Error:', error.message);
      alert('Error loading ledgers: ' + error.message);
    }
  }, []);

  const authContext = {
    signIn: useCallback(async (credentials) => {
      try {
        // Call backend API
        const response = await ApiService.login(credentials.email, credentials.password);

        // Set token in API service
        ApiService.setToken(response.access_token);

        // Save to AsyncStorage
        await AsyncStorage.setItem('userToken', response.access_token);
        await AsyncStorage.setItem('userEmail', credentials.email);

        dispatch({
          type: 'LOGIN',
          payload: {
            user: { email: credentials.email },
            token: response.access_token,
          },
        });

        return true;
      } catch (error) {
        console.error('Login error:', error);
        // Don't show alert here - let the calling component handle it
        // This prevents duplicate error messages
        throw error; // Re-throw so LoginScreen can catch it
      }
    }, []),

    signUp: useCallback(async (credentials) => {
      try {
        console.log('SignUp called with:', { name: credentials.name, email: credentials.email, nickname: credentials.nickname });
        
        // Call backend API - only register, don't login
        const response = await ApiService.register(
          credentials.name,
          credentials.email,
          credentials.password,
          'user',
          credentials.nickname || ''
        );
        
        console.log('SignUp API response:', response);

        // Don't set token or login - just return success
        // User needs to login manually after signup
        return true;
      } catch (error) {
        console.error('Signup error:', error);
        console.error('Signup error message:', error.message);
        alert('Signup failed: ' + (error.message || 'Please try again'));
        return false;
      }
    }, []),

    signOut: useCallback(async () => {
      try {
        // Clear all auth-related data from AsyncStorage
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('savedEmail');
        await AsyncStorage.removeItem('savedPassword');
        await AsyncStorage.removeItem('rememberMe');
        
        ApiService.clearToken();
        dispatch({ type: 'LOGOUT' });
        return true;
      } catch (error) {
        console.error('Logout error:', error);
        return false;
      }
    }, []),

    loadLedgers: loadLedgersFunc,

    addLedger: useCallback(async (ledgerData) => {
      try {
        console.log('addLedger called with:', ledgerData);
        
        // Backend expects type, amount, description for ledger entries
        // Frontend is sending name, mobile, notes, interestRate for creating a ledger account
        const description = `Ledger: ${ledgerData.name}${ledgerData.mobile ? ' - ' + ledgerData.mobile : ''}${ledgerData.notes ? ' - ' + ledgerData.notes : ''}${ledgerData.interestRate ? ' - Interest:' + ledgerData.interestRate + '%' : ''}`;
        console.log('Creating ledger with description:', description);
        
        const newEntry = await ApiService.createLedger(
          'credit', // type
          0, // amount - placeholder
          description
        );
        
        console.log('Ledger created on backend:', newEntry);
        console.log('Now calling loadLedgersFunc to refresh...');
        
        // Reload all ledgers to get fresh data from backend
        await loadLedgersFunc();
        
        console.log('loadLedgersFunc completed');
        
        return newEntry;
      } catch (error) {
        console.error('Add ledger error:', error);
        throw error;
      }
    }, [loadLedgersFunc]),

    restoreToken: useCallback(async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const email = await AsyncStorage.getItem('userEmail');
        
        if (token && email) {
          ApiService.setToken(token);
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: {
              user: { email },
              token,
            },
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error('Restore token error:', error);
        return false;
      }
    }, []),

    loadData: useCallback(async () => {
      // Load ledgers from backend
      try {
        const response = await ApiService.getMyLedgers();
        dispatch({ type: 'SET_LEDGERS', payload: response.entries || [] });
      } catch (error) {
        console.error('Load data error:', error);
      }
    }, []),

    addTransaction: useCallback(async (ledgerId, transaction) => {
      try {
        // Encode the ledger ID and interest rate in the description
        let description = `[LEDGER:${ledgerId}] ${transaction.description}`;
        
        // Add interest rate to description if it's a credit transaction
        if (transaction.type === 'CREDIT' && transaction.interestRate > 0) {
          description += ` - Interest:${transaction.interestRate}%`;
        }
        
        // Call backend API to create transaction
        const newTransaction = await ApiService.createLedger(
          transaction.type.toLowerCase(), // 'DEBIT' -> 'debit', 'CREDIT' -> 'credit'
          transaction.amount,
          description
        );
        
        // Reload ledgers to get updated data
        await loadLedgersFunc();
        
        return newTransaction;
      } catch (error) {
        console.error('Add transaction error:', error);
        throw error;
      }
    }, [loadLedgersFunc]),

    deleteLedger: useCallback(async (ledgerId) => {
      try {
        console.log('=== DELETE LEDGER ===');
        console.log('Deleting ledger ID:', ledgerId);
        
        // Call backend API to actually delete the ledger
        await ApiService.deleteLedger(ledgerId);
        console.log('✅ Ledger deleted from backend');
        
        // Remove from local state immediately
        dispatch({ type: 'DELETE_LEDGER', payload: ledgerId });
        
        // Reload ledgers to sync with backend
        await loadLedgersFunc();
        console.log('✅ Ledgers reloaded after delete');
        
      } catch (error) {
        console.error('❌ Delete ledger error:', error);
        alert('Failed to delete ledger: ' + error.message);
      }
    }, [loadLedgersFunc]),

    deleteTransaction: useCallback(async (ledgerId, transactionId) => {
      try {
        console.log('=== DELETE TRANSACTION ===');
        console.log('Deleting transaction ID:', transactionId, 'from ledger:', ledgerId);
        
        // Call backend API to delete the transaction
        await ApiService.deleteTransaction(transactionId);
        console.log('✅ Transaction deleted from backend');
        
        // Reload ledgers to sync with backend
        await loadLedgersFunc();
        console.log('✅ Ledgers reloaded after transaction delete');
        
      } catch (error) {
        console.error('❌ Delete transaction error:', error);
        alert('Failed to delete transaction: ' + error.message);
      }
    }, [loadLedgersFunc]),

    clearDeletedLedgers: useCallback(async () => {
      try {
        await AsyncStorage.removeItem('deletedLedgerIds');
        console.log('Cleared deleted ledgers list');
      } catch (error) {
        console.error('Clear deleted ledgers error:', error);
      }
    }, []),
  };

  return (
    <AuthContext.Provider value={{ state, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
};
