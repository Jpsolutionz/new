import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';

import { AuthContext } from '../context/AuthContext';
import AuthStack from '../screens/AuthStack';
import DashboardScreen from '../screens/DashboardScreen';
import LedgerDetailsScreen from '../screens/LedgerDetailsScreen';
import AddLedgerScreen from '../screens/AddLedgerScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#0066cc',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="LedgerDetails"
      component={LedgerDetailsScreen}
      options={({ route }) => ({
        title: route.params?.ledger?.name || 'Ledger',
      })}
    />
    <Stack.Screen
      name="AddLedger"
      component={AddLedgerScreen}
      options={{ title: 'Add Ledger' }}
    />
    <Stack.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={({ route }) => ({
        title: `Add ${route.params?.type === 'DEBIT' ? 'Debit' : 'Credit'}`,
      })}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{ title: 'Change Password' }}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { state, restoreToken, signIn } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // First try to restore existing token
        const tokenRestored = await restoreToken();
        
        // If no token, try auto-login with saved credentials
        if (!tokenRestored) {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const savedEmail = await AsyncStorage.getItem('savedEmail');
          const savedPassword = await AsyncStorage.getItem('savedPassword');
          const rememberMe = await AsyncStorage.getItem('rememberMe');
          
          if (rememberMe === 'true' && savedEmail && savedPassword) {
            console.log('Auto-login with saved credentials...');
            await signIn({ email: savedEmail, password: savedPassword });
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
        // Hide splash screen immediately after loading
        await SplashScreen.hideAsync();
      }
    };

    bootstrapAsync();
  }, [restoreToken, signIn]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {state.isSignedIn ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;