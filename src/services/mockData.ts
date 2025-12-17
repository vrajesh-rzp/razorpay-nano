import { Payment, Report, Reminder } from '../types';

export const MockDataService = {
  getPayments(): Payment[] {
    return [
      {
        id: '1',
        type: 'vendor',
        amount: 50000,
        recipient: 'ABC Suppliers',
        description: 'Monthly supplies',
        status: 'completed',
        date: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'customer',
        amount: 25000,
        recipient: 'XYZ Corp',
        description: 'Invoice #1234',
        status: 'completed',
        date: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'vendor',
        amount: 15000,
        recipient: 'Tech Solutions',
        description: 'Software license',
        status: 'pending',
        date: new Date().toISOString(),
      },
    ];
  },

  getReports(): Report[] {
    return [
      {
        id: '1',
        date: new Date().toISOString(),
        totalPayments: 65000,
        totalReceived: 125000,
        pendingPayments: 15000,
        pendingReceivables: 45000,
      },
    ];
  },

  getReminders(): Reminder[] {
    return [
      {
        id: '1',
        customerName: 'ABC Corp',
        amount: 30000,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
      {
        id: '2',
        customerName: 'XYZ Ltd',
        amount: 15000,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'sent',
      },
    ];
  },
};

