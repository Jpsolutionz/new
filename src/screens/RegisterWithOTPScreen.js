import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const RegisterWithOTPScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Details
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState(''); // For testing when email is disabled
  const { signUp } = useContext(AuthContext);

  const handleSendOTP = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await api.sendSignupOTP(email);

      if (response.success) {
        setOtpSent(true);
        setGeneratedOTP(response.otp); // Store for testing
        
        // Show OTP in alert if email is disabled (for testing)
        if (!response.email_enabled) {
          Alert.alert(
            'OTP Sent',
            `Your OTP is: ${response.otp}\n\n(Email is disabled, showing OTP for testing)`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Success', 'OTP sent to your email address. Please check your inbox.');
        }
        
        setStep(2);
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Invalid', 'Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.verifySignupOTP(email, otp);

      if (response.success) {
        Alert.alert('Success', 'Email verified! Please complete your registration.');
        setStep(3);
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      Alert.alert('Error', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Invalid', 'Please enter your name');
      return;
    }

    if (!companyName.trim()) {
      Alert.alert('Invalid', 'Please enter company name');
      return;
    }

    if (!nickname.trim()) {
      Alert.alert('Invalid', 'Please enter a nickname for password recovery');
      return;
    }

    if (password.length < 4) {
      Alert.alert('Invalid', 'Password must be at least 4 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Invalid', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Save company name to AsyncStorage
      await AsyncStorage.setItem('companyName', companyName);
      
      const success = await signUp({ name, email, password, nickname });
      
      if (success) {
        Alert.alert(
          'Success',
          'Account created successfully! Please login with your credentials.',
          [{ 
            text: 'OK', 
            onPress: () => navigation.navigate('Login') 
          }]
        );
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Step 1: Verify Email Address</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        {generatedOTP && (
          <View style={styles.testingBox}>
            <Text style={styles.testingText}>Testing Mode - Your OTP: {generatedOTP}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleSendOTP}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => setStep(1)}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Step 2: Enter OTP sent to {email}</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Enter OTP</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter 6-digit OTP"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          editable={!loading}
        />

        {generatedOTP && (
          <View style={styles.testingBox}>
            <Text style={styles.testingText}>Testing Mode - Your OTP: {generatedOTP}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSendOTP}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => setStep(2)}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Complete Registration</Text>
        <Text style={styles.subtitle}>Step 3: Enter Your Details</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your company name"
          placeholderTextColor="#999"
          autoCapitalize="words"
          value={companyName}
          onChangeText={setCompanyName}
          editable={!loading}
        />

        <Text style={styles.label}>Nickname (Security Question)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a nickname for password recovery"
          placeholderTextColor="#999"
          autoCapitalize="none"
          value={nickname}
          onChangeText={setNickname}
          editable={!loading}
        />
        <Text style={styles.helperText}>
          This will be used to verify your identity if you forget your password
        </Text>

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="At least 4 characters"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Creating Account...' : 'Complete Signup'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

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
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
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
    padding: 20,
  },
  headerSection: {
    marginBottom: 30,
  },
  backButton: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
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
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  testingBox: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  testingText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#0066cc',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
  },
});

export default RegisterWithOTPScreen;
