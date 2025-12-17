import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthService } from '../services/auth';
import { StorageService } from '../services/storage';
import { BiometricService } from '../services/biometric';
import { PasswordInputModal } from '../components/PasswordInputModal';
import { RazorpayColors, RazorpayGradients } from '../theme/colors';
import { Account } from '../types';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onShowAccountSelection: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onShowAccountSelection,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<Account[]>([]);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    loadSavedAccounts();
  }, []);

  const loadSavedAccounts = async () => {
    const accounts = await StorageService.getAccounts();
    const biometricEnabled = await StorageService.isBiometricEnabled();
    const biometricAvailable = await BiometricService.isAvailable();
    
    setSavedAccounts(accounts);
    setBiometricEnabled(biometricEnabled);
    setBiometricAvailable(biometricAvailable);
  };

  const handleAccountSelect = async (account: Account) => {
    if (biometricEnabled && biometricAvailable) {
      // Use biometric authentication
      const authenticated = await BiometricService.authenticate();
      if (authenticated) {
        // Get credentials and login
        const password = await StorageService.getCredentials(account.email);
        if (password) {
          try {
            setLoading(true);
            await AuthService.login(account.email, password);
            onLoginSuccess();
          } catch (error: any) {
            Alert.alert('Error', 'Failed to login');
          } finally {
            setLoading(false);
          }
        } else {
          Alert.alert('Error', 'Credentials not found. Please login with password.');
        }
      }
    } else {
      // Show password input modal
      setSelectedAccount(account);
      setPasswordModalVisible(true);
    }
  };

  const handlePasswordConfirm = async (password: string) => {
    if (!selectedAccount) return;
    
    setPasswordModalVisible(false);
    setLoading(true);
    try {
      await AuthService.login(selectedAccount.email, password);
      onLoginSuccess();
    } catch (error: any) {
      Alert.alert('Error', 'Invalid password');
    } finally {
      setLoading(false);
      setSelectedAccount(null);
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await AuthService.login(trimmedEmail, trimmedPassword);
      await StorageService.saveCredentials(trimmedEmail, trimmedPassword);
      
      // Check if this is first login
      const accounts = await StorageService.getAccounts();
      const isFirstLogin = accounts.length === 1;
      
      if (isFirstLogin) {
        // Ask about biometric
        Alert.alert(
          'Enable Biometric Authentication?',
          'Would you like to enable biometric authentication for faster login?',
          [
            {
              text: 'No Thanks',
              style: 'cancel',
              onPress: () => onLoginSuccess(),
            },
            {
              text: 'Enable',
              onPress: async () => {
                await StorageService.setBiometricEnabled(true);
                onLoginSuccess();
              },
            },
          ]
        );
      } else {
        onLoginSuccess();
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const renderAccountCard = ({ item }: { item: Account }) => (
    <TouchableOpacity
      style={styles.accountCard}
      onPress={() => handleAccountSelect(item)}
    >
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{item.businessName}</Text>
        <Text style={styles.accountEmail}>{item.email}</Text>
        <Text style={styles.accountOwner}>{item.name}</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={RazorpayGradients.primary}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Razorpay Nano</Text>
            <Text style={styles.subtitle}>For Emerging Business Owners</Text>

            {/* Saved Accounts List */}
            {savedAccounts.length > 0 && (
              <View style={styles.savedAccountsSection}>
                <FlatList
                  data={savedAccounts}
                  renderItem={renderAccountCard}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>
            )}

            {/* Divider with "or" */}
            {savedAccounts.length > 0 && (
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>
            )}

            {/* Login to another account section */}
            <View style={styles.form}>
              {savedAccounts.length > 0 && (
                <Text style={styles.sectionLabel}>Login to another account</Text>
              )}
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <PasswordInputModal
        visible={passwordModalVisible}
        email={selectedAccount?.email || ''}
        onClose={() => {
          setPasswordModalVisible(false);
          setSelectedAccount(null);
        }}
        onConfirm={handlePasswordConfirm}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  savedAccountsSection: {
    marginBottom: 24,
  },
  accountCard: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: RazorpayColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: RazorpayColors.text,
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 14,
    color: RazorpayColors.textSecondary,
    marginBottom: 2,
  },
  accountOwner: {
    fontSize: 12,
    color: RazorpayColors.textTertiary,
  },
  arrow: {
    fontSize: 24,
    color: RazorpayColors.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: '#fff',
    paddingHorizontal: 16,
    fontSize: 14,
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  sectionLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
    opacity: 0.9,
    fontWeight: '500',
  },
  input: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: RazorpayColors.border,
  },
  loginButton: {
    backgroundColor: RazorpayColors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
    shadowColor: RazorpayColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

