import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Account } from '../types';

const ACCOUNTS_KEY = '@razorpay_nano:accounts';
const BIOMETRIC_ENABLED_KEY = '@razorpay_nano:biometric_enabled';
const CURRENT_USER_KEY = '@razorpay_nano:current_user';
const ONBOARDING_COMPLETED_KEY = '@razorpay_nano:onboarding_completed';

// Helper function to sanitize email for SecureStore key
// SecureStore keys must only contain alphanumeric characters, ".", "-", and "_"
const sanitizeEmailForKey = (email: string): string => {
  return email.toLowerCase().replace(/[^a-z0-9._-]/g, '_');
};

export const StorageService = {
  // Account management
  async saveAccount(account: Account): Promise<void> {
    const accounts = await this.getAccounts();
    const existingIndex = accounts.findIndex(a => a.id === account.id);
    
    if (existingIndex >= 0) {
      accounts[existingIndex] = { ...account, lastAccessed: Date.now() };
    } else {
      accounts.push({ ...account, lastAccessed: Date.now() });
    }
    
    // Keep only last 5 accounts
    const sortedAccounts = accounts
      .sort((a, b) => b.lastAccessed - a.lastAccessed)
      .slice(0, 5);
    
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(sortedAccounts));
  },

  async getAccounts(): Promise<Account[]> {
    const data = await AsyncStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async removeAccount(accountId: string): Promise<void> {
    const accounts = await this.getAccounts();
    const filtered = accounts.filter(a => a.id !== accountId);
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filtered));
  },

  // Biometric settings
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, JSON.stringify(enabled));
  },

  async isBiometricEnabled(): Promise<boolean> {
    const data = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
    return data ? JSON.parse(data) : false;
  },

  // Secure credential storage
  async saveCredentials(email: string, password: string): Promise<void> {
    const sanitizedEmail = sanitizeEmailForKey(email);
    await SecureStore.setItemAsync(`credentials_${sanitizedEmail}`, password);
  },

  async getCredentials(email: string): Promise<string | null> {
    try {
      const sanitizedEmail = sanitizeEmailForKey(email);
      return await SecureStore.getItemAsync(`credentials_${sanitizedEmail}`);
    } catch {
      return null;
    }
  },

  async removeCredentials(email: string): Promise<void> {
    const sanitizedEmail = sanitizeEmailForKey(email);
    await SecureStore.deleteItemAsync(`credentials_${sanitizedEmail}`);
  },

  // Current user
  async setCurrentUser(user: Account | null): Promise<void> {
    if (user) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  async getCurrentUser(): Promise<Account | null> {
    const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Onboarding
  async setOnboardingCompleted(completed: boolean): Promise<void> {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, JSON.stringify(completed));
  },

  async isOnboardingCompleted(): Promise<boolean> {
    const data = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    return data ? JSON.parse(data) : false;
  },
};

