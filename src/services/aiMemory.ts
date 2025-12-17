// AI Memory - Stores merchant preferences and patterns for learning

import AsyncStorage from '@react-native-async-storage/async-storage';

const MEMORY_KEY = '@razorpay_nano:ai_memory';

export interface MerchantPattern {
  customerName: string;
  typicalAmountRange: { min: number; max: number };
  category: string;
  frequency: number;
  lastUsed: number;
}

export interface AIMemory {
  patterns: MerchantPattern[];
  preferences: {
    defaultChannel: 'whatsapp' | 'sms' | 'email';
    reminderTone: 'polite' | 'professional' | 'firm';
    autoRemind: boolean;
  };
}

export const AIMemoryService = {
  async getMemory(): Promise<AIMemory> {
    const data = await AsyncStorage.getItem(MEMORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      patterns: [],
      preferences: {
        defaultChannel: 'whatsapp',
        reminderTone: 'professional',
        autoRemind: true,
      },
    };
  },

  async saveMemory(memory: AIMemory): Promise<void> {
    await AsyncStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  },

  async addPattern(pattern: MerchantPattern): Promise<void> {
    const memory = await this.getMemory();
    const existingIndex = memory.patterns.findIndex(
      p => p.customerName === pattern.customerName
    );
    
    if (existingIndex >= 0) {
      memory.patterns[existingIndex] = {
        ...memory.patterns[existingIndex],
        frequency: memory.patterns[existingIndex].frequency + 1,
        lastUsed: Date.now(),
      };
    } else {
      memory.patterns.push(pattern);
    }
    
    await this.saveMemory(memory);
  },

  async getPattern(customerName: string): Promise<MerchantPattern | null> {
    const memory = await this.getMemory();
    return memory.patterns.find(p => p.customerName === customerName) || null;
  },

  async updatePreferences(preferences: Partial<AIMemory['preferences']>): Promise<void> {
    const memory = await this.getMemory();
    memory.preferences = { ...memory.preferences, ...preferences };
    await this.saveMemory(memory);
  },
};

