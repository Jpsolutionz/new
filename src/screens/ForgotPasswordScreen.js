import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import ApiService from '../services/api';

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Enter Mobile, 2: Enter Nickname, 3: New Password
  const [mobile, setMobile] = useState('');
  const [nickname, setNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyMobile = async () => {
    if (!mobile.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      // Check if mobile number is registered
      const response = await ApiService.verifyMobileExists(mobile);
      
      if (response.exists) {
        Alert.alert('Success', 'Mobile number found! Now enter your nickname.');
        setStep(2);
      } else {
        Alert.alert('Error', 'Mobile number not registered');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Mobile number not found');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyNickname = async () => {
    if (!nickname.trim()) {
      Alert.alert('Error', 'Please enter your nickname');
      return;
    }

    setLoading(true);
    try {
      // Verify nickname matches the mobile number
      const response = await ApiService.verifyNickname(mobile, nickname);
      
      if (response.match) {
        Alert.alert('Success', 'Nickname verified! Now set your new password.');
        setStep(3);
      } else {
        Alert.alert('Error', 'Nickname does not match. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Nickname verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter new password');
      return;
    }

    if (newPassword.length < 4) {
      Alert.alert('Error', 'Password must be at least 4 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await ApiService.resetPasswordSimple(mobile, newPassword);
      Alert.alert(
        'Success',
        'Password changed successfully! Please login with your new password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reset password');
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
          <View style={styles.headerSection}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              {step === 1 && 'Enter your registered mobile number'}
              {step === 2 && 'Enter your nickname for verification'}
              {step === 3 && 'Set your new password'}
            </Text>
          </View>

          <View style={styles.formSection}>
            {/* Step 1: Enter Mobile Number */}
            {step === 1 && (
              <>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobile}
                  onChangeText={setMobile}
                  editable={!loading}
                />

                <TouchableOpacity
                  style={[styles.button, loading && styles.disabledButton]}
                  onPress={handleVerifyMobile}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Verifying...' : 'Next'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Step 2: Enter Nickname */}
            {step === 2 && (
              <>
                <View style={styles.successBox}>
                  <Text style={styles.successIcon}>✓</Text>
                  <Text style={styles.successText}>Mobile: {mobile}</Text>
                </View>

                <Text style={styles.label}>Nickname</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your nickname"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  value={nickname}
                  onChangeText={setNickname}
                  editable={!loading}
                />

                <TouchableOpacity
                  style={[styles.button, loading && styles.disabledButton]}
                  onPress={handleVerifyNickname}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Verifying...' : 'Verify Nickname'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Step 3: Set New Password */}
            {step === 3 && (
              <>
                <View style={styles.successBox}>
                  <Text style={styles.successIcon}>✓</Text>
                  <Text style={styles.successText}>Mobile number verified: {mobile}</Text>
                </View>

                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="At least 4 characters"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  editable={!loading}
                />

                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter new password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!loading}
                />

                <TouchableOpacity
                  style={[styles.button, loading && styles.disabledButton]}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Updating...' : 'Reset Password'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
            <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
            <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
            <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
            <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]} />
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
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  successBox: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 24,
    color: '#28a745',
    marginRight: 12,
  },
  successText: {
    fontSize: 14,
    color: '#155724',
    fontWeight: '600',
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  stepDotActive: {
    backgroundColor: '#0066cc',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#0066cc',
  },
});

export default ForgotPasswordScreen;
