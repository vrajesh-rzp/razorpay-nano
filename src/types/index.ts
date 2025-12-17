export interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
}

export interface Account {
  id: string;
  email: string;
  name: string;
  businessName: string;
  lastAccessed: number;
}

export interface Payment {
  id: string;
  type: 'vendor' | 'customer';
  amount: number;
  recipient: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

export interface Report {
  id: string;
  date: string;
  totalPayments: number;
  totalReceived: number;
  pendingPayments: number;
  pendingReceivables: number;
}

export interface Reminder {
  id: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'sent' | 'paid';
}

