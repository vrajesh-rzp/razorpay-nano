import { User, Account } from '../types';
import { StorageService } from './storage';

// Mock API - In production, this would be a real API call
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'merchant1@razorpay.com',
    name: 'Rajesh Kumar',
    businessName: 'Kumar Electronics',
  },
  {
    id: '2',
    email: 'merchant2@razorpay.com',
    name: 'Priya Sharma',
    businessName: 'Sharma Textiles',
  },
  {
    id: '3',
    email: 'merchant3@razorpay.com',
    name: 'Amit Patel',
    businessName: 'Patel Groceries',
  },
];

export const AuthService = {
  async login(email: string, password: string): Promise<User> {
    // Mock API call - simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Trim and normalize email for comparison
    const normalizedEmail = email.trim().toLowerCase();
    
    // Mock validation - accept any password for demo
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === normalizedEmail);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Save account for quick access
    const account: Account = {
      id: user.id,
      email: user.email,
      name: user.name,
      businessName: user.businessName,
      lastAccessed: Date.now(),
    };
    
    await StorageService.saveAccount(account);
    await StorageService.setCurrentUser(account);
    
    return user;
  },

  async logout(): Promise<void> {
    await StorageService.setCurrentUser(null);
  },

  async getCurrentUser(): Promise<User | null> {
    const account = await StorageService.getCurrentUser();
    if (!account) return null;
    
    return {
      id: account.id,
      email: account.email,
      name: account.name,
      businessName: account.businessName,
    };
  },
};

