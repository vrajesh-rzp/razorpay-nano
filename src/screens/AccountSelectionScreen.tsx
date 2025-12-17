import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Account } from '../types';
import { StorageService } from '../services/storage';
import { AuthService } from '../services/auth';
import { BiometricService } from '../services/biometric';
import { PasswordInputModal } from '../components/PasswordInputModal';
import { RazorpayColors, RazorpayGradients } from '../theme/colors';

interface AccountSelectionScreenProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const AccountSelectionScreen: React.FC<AccountSelectionScreenProps> = ({
  onLoginSuccess,
  onBack,
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    const savedAccounts = await StorageService.getAccounts();
    const biometricEnabled = await StorageService.isBiometricEnabled();
    const biometricAvailable = await BiometricService.isAvailable();
    
    setAccounts(savedAccounts);
    setBiometricEnabled(biometricEnabled);
    setBiometricAvailable(biometricAvailable);
    setLoading(false);
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
            await AuthService.login(account.email, password);
            onLoginSuccess();
          } catch (error: any) {
            Alert.alert('Error', 'Failed to login');
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
    try {
      await AuthService.login(selectedAccount.email, password);
      onLoginSuccess();
    } catch (error: any) {
      Alert.alert('Error', 'Invalid password');
    }
    setSelectedAccount(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={RazorpayColors.primary} />
      </View>
    );
  }

  if (accounts.length === 0) {
    return (
      <LinearGradient
        colors={RazorpayGradients.primary}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>No Saved Accounts</Text>
          <Text style={styles.subtitle}>Please login with email and password first</Text>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#6366f1', '#8b5cf6', '#a855f7']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Select Account</Text>
        <Text style={styles.subtitle}>
          {biometricEnabled && biometricAvailable
            ? 'Select an account and authenticate with biometric'
            : 'Select an account and enter password'}
        </Text>

        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
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
          )}
          style={styles.list}
        />

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 24,
    opacity: 0.9,
  },
  list: {
    flex: 1,
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
  backButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

