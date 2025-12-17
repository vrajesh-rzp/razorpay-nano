// AI Orchestrator - Handles intent classification, entity resolution, and workflow execution

export type IntentType = 
  | 'collect_payment_link'
  | 'collect_qr'
  | 'collect_remind'
  | 'collect_track'
  | 'pay_vendor'
  | 'pay_staff'
  | 'pay_bulk'
  | 'pay_repeat'
  | 'pay_schedule'
  | 'insight_summary'
  | 'insight_outstanding'
  | 'insight_top_customers'
  | 'insight_cashflow'
  | 'insight_export'
  | 'reconcile_payments'
  | 'unknown';

export interface Intent {
  type: IntentType;
  confidence: number;
  entities: {
    amount?: number;
    customer?: string;
    vendor?: string;
    reason?: string;
    date?: string;
    source?: string;
  };
  rawText: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: 'customer' | 'vendor' | 'staff';
  lastPaid?: number;
  lastPaidDate?: string;
}

// Mock contact database
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Suresh', phone: '+919876543210', type: 'customer' },
  { id: '2', name: 'Raju Supplier', phone: '+919123456789', type: 'vendor', email: 'raju@upi' },
  { id: '3', name: 'Mohan', phone: '+919988776655', type: 'customer' },
  { id: '4', name: 'ABC Corp', email: 'contact@abccorp.com', type: 'customer' },
  { id: '5', name: 'XYZ Suppliers', phone: '+919112233445', type: 'vendor' },
];

export class AIOrchestrator {
  // Intent Classification
  static classifyIntent(text: string): Intent {
    const lowerText = text.toLowerCase();
    let intentType: IntentType = 'unknown';
    let confidence = 0.5;
    const entities: Intent['entities'] = {};

    // Extract amount
    const amountMatch = text.match(/₹?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (amountMatch) {
      entities.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // Collect intents
    if (lowerText.includes('collect') || lowerText.includes('payment link') || lowerText.includes('create link')) {
      intentType = 'collect_payment_link';
      confidence = 0.9;
    } else if (lowerText.includes('qr') || lowerText.includes('scan')) {
      intentType = 'collect_qr';
      confidence = 0.85;
    } else if (lowerText.includes('remind') && (lowerText.includes('customer') || lowerText.includes('pending'))) {
      intentType = 'collect_remind';
      confidence = 0.9;
    } else if (lowerText.includes('track') || lowerText.includes('who hasn\'t paid') || lowerText.includes('pending')) {
      intentType = 'collect_track';
      confidence = 0.85;
    }
    // Pay intents
    else if (lowerText.includes('pay') && (lowerText.includes('vendor') || lowerText.includes('supplier'))) {
      intentType = 'pay_vendor';
      confidence = 0.9;
    } else if (lowerText.includes('pay') && lowerText.includes('staff')) {
      intentType = 'pay_staff';
      confidence = 0.9;
    } else if (lowerText.includes('bulk payout') || lowerText.includes('pay multiple')) {
      intentType = 'pay_bulk';
      confidence = 0.85;
    } else if (lowerText.includes('repeat') && lowerText.includes('payment')) {
      intentType = 'pay_repeat';
      confidence = 0.8;
    } else if (lowerText.includes('schedule') && lowerText.includes('payout')) {
      intentType = 'pay_schedule';
      confidence = 0.85;
    }
    // Insight intents
    else if (lowerText.includes('summary') || lowerText.includes('today') || lowerText.includes('report')) {
      intentType = 'insight_summary';
      confidence = 0.9;
    } else if (lowerText.includes('outstanding') || lowerText.includes('pending')) {
      intentType = 'insight_outstanding';
      confidence = 0.85;
    } else if (lowerText.includes('top customer')) {
      intentType = 'insight_top_customers';
      confidence = 0.9;
    } else if (lowerText.includes('cashflow') || lowerText.includes('warning')) {
      intentType = 'insight_cashflow';
      confidence = 0.85;
    } else if (lowerText.includes('export') || lowerText.includes('download')) {
      intentType = 'insight_export';
      confidence = 0.9;
    }
    // Reconciliation
    else if (lowerText.includes('who paid') || lowerText.includes('reconcile') || lowerText.includes('unmatched')) {
      intentType = 'reconcile_payments';
      confidence = 0.9;
    }

    // Extract customer/vendor name
    for (const contact of MOCK_CONTACTS) {
      if (lowerText.includes(contact.name.toLowerCase())) {
        if (contact.type === 'customer') {
          entities.customer = contact.name;
        } else if (contact.type === 'vendor') {
          entities.vendor = contact.name;
        }
        break;
      }
    }

    // Extract reason/description
    const reasonPatterns = [
      /(?:for|reason|because|due to)\s+(.+?)(?:\.|$)/i,
      /(?:yesterday|today|last week).+?supply/i,
    ];
    for (const pattern of reasonPatterns) {
      const match = text.match(pattern);
      if (match) {
        entities.reason = match[1] || match[0];
        break;
      }
    }

    // Extract source
    if (lowerText.includes('wallet')) {
      entities.source = 'wallet';
    } else if (lowerText.includes('bank') || lowerText.includes('account')) {
      entities.source = 'bank';
    }

    return {
      type: intentType,
      confidence,
      entities,
      rawText: text,
    };
  }

  // Entity Resolution - Match contact names
  static resolveContact(name: string, type?: 'customer' | 'vendor'): Contact[] {
    const lowerName = name.toLowerCase();
    const matches = MOCK_CONTACTS.filter(contact => {
      if (type && contact.type !== type) return false;
      return contact.name.toLowerCase().includes(lowerName) || 
             lowerName.includes(contact.name.toLowerCase());
    });
    return matches;
  }

  // Generate response based on intent
  static generateResponse(intent: Intent): { text: string; action?: string; data?: any } {
    switch (intent.type) {
      case 'collect_payment_link':
        if (!intent.entities.amount) {
          return {
            text: 'How much should the payment link be for?',
          };
        }
        if (!intent.entities.customer) {
          return {
            text: 'Who should I create the payment link for?',
          };
        }
        return {
          text: `Creating a payment link for ₹${intent.entities.amount.toLocaleString('en-IN')} for ${intent.entities.customer}${intent.entities.reason ? ` (${intent.entities.reason})` : ''}. Should I send it via WhatsApp or SMS?`,
          action: 'create_payment_link',
          data: intent.entities,
        };

      case 'collect_qr':
        return {
          text: 'Opening QR code scanner. Show this QR code to your customer to collect payment.',
          action: 'show_qr',
        };

      case 'collect_remind':
        return {
          text: 'I found ₹24,300 pending from 11 customers. Would you like me to send reminders?',
          action: 'show_reminders',
        };

      case 'collect_track':
        return {
          text: 'Here are the customers who haven\'t paid yet:\n\n• Suresh - ₹5,000\n• ABC Corp - ₹10,000\n• Mohan - ₹3,000\n\nWould you like me to send reminders?',
          action: 'show_pending',
        };

      case 'pay_vendor':
        if (!intent.entities.amount) {
          return {
            text: 'How much should I pay?',
          };
        }
        if (!intent.entities.vendor) {
          return {
            text: 'Which vendor should I pay?',
          };
        }
        const vendor = this.resolveContact(intent.entities.vendor, 'vendor')[0];
        if (!vendor) {
          return {
            text: `I couldn't find "${intent.entities.vendor}" in your vendor list. Would you like to add them?`,
          };
        }
        return {
          text: `Pay ₹${intent.entities.amount.toLocaleString('en-IN')} to ${vendor.name}${vendor.email ? ` (${vendor.email})` : ''}${intent.entities.source ? ` from ${intent.entities.source}` : ''}?`,
          action: 'confirm_payout',
          data: { ...intent.entities, vendor: vendor },
        };

      case 'pay_staff':
        if (!intent.entities.amount) {
          return {
            text: 'How much should I pay?',
          };
        }
        return {
          text: `Which staff member should I pay ₹${intent.entities.amount.toLocaleString('en-IN')} to?`,
          action: 'select_staff',
          data: intent.entities,
        };

      case 'insight_summary':
        return {
          text: 'Today\'s Summary:\n\n• Total Collections: ₹1,25,000\n• Total Payouts: ₹65,000\n• Net Balance: ₹60,000\n• Payments Received: 17\n• Pending: ₹24,300 from 11 customers',
          action: 'show_reports',
        };

      case 'insight_outstanding':
        return {
          text: 'Outstanding Payments:\n\n• This Week: ₹45,000\n• This Month: ₹1,20,000\n• Overdue: ₹24,300\n\nWould you like me to send reminders?',
          action: 'show_reminders',
        };

      case 'reconcile_payments':
        return {
          text: 'Today\'s Payments:\n\n• 17 payments received\n• ₹18,540 total\n• 3 unmatched payments:\n  - ₹1,200 from 98xx... (Is this Mohan?)\n  - ₹500 from 87xx...\n  - ₹2,000 from 91xx...',
          action: 'show_reconciliation',
        };

      default:
        return {
          text: 'I can help you with:\n• Creating payment links\n• Making payouts\n• Viewing reports\n• Sending reminders\n• Reconciliation\n\nWhat would you like to do?',
        };
    }
  }

  // Risk checks (simplified)
  static performRiskChecks(intent: Intent): { safe: boolean; message?: string } {
    if (intent.type === 'pay_vendor' && intent.entities.amount) {
      if (intent.entities.amount > 100000) {
        return {
          safe: false,
          message: 'This is a large payout. Please confirm with biometric authentication.',
        };
      }
    }
    return { safe: true };
  }
}

