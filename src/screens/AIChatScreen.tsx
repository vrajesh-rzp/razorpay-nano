import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RazorpayColors, RazorpayGradients } from '../theme/colors';
import { AIOrchestrator } from '../services/aiOrchestrator';
import { AIMemoryService } from '../services/aiMemory';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatScreenProps {
  onClose: () => void;
  onNavigate: (screen: string) => void;
  initialMessage?: string;
}

export const AIChatScreen: React.FC<AIChatScreenProps> = ({ onClose, onNavigate, initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant for Razorpay Nano. I can help you:\n\n• Create payment links\n• Make payouts to vendors\n• View reports and summaries\n• Send reminders\n• Reconcile payments\n\nWhat would you like to do?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const generateAIResponse = async (input: string): Promise<{ text: string; action?: string; data?: any }> => {
    // Use AI Orchestrator to classify intent
    const intent = AIOrchestrator.classifyIntent(input);
    
    // Perform risk checks
    const riskCheck = AIOrchestrator.performRiskChecks(intent);
    if (!riskCheck.safe) {
      return {
        text: riskCheck.message || 'This action requires additional verification.',
      };
    }

    // Generate response based on intent
    const response = AIOrchestrator.generateResponse(intent);

    // Handle entity resolution for ambiguous cases
    if (intent.type === 'collect_payment_link' && intent.entities.customer) {
      const matches = AIOrchestrator.resolveContact(intent.entities.customer, 'customer');
      if (matches.length > 1) {
        return {
          text: `I found multiple contacts matching "${intent.entities.customer}":\n\n${matches.map((m, i) => `${i + 1}. ${m.name}${m.phone ? ` (${m.phone})` : ''}`).join('\n')}\n\nWhich one should I use?`,
          action: 'resolve_contact',
          data: { matches, intent },
        };
      } else if (matches.length === 0) {
        return {
          text: `I couldn't find "${intent.entities.customer}" in your contacts. Would you like to create a payment link for a new customer?`,
          action: 'new_customer',
          data: intent.entities,
        };
      }
    }

    if (intent.type === 'pay_vendor' && intent.entities.vendor) {
      const matches = AIOrchestrator.resolveContact(intent.entities.vendor, 'vendor');
      if (matches.length > 1) {
        return {
          text: `I found multiple vendors matching "${intent.entities.vendor}":\n\n${matches.map((m, i) => `${i + 1}. ${m.name}${m.phone ? ` (${m.phone})` : ''}`).join('\n')}\n\nWhich one should I pay?`,
          action: 'resolve_vendor',
          data: { matches, intent },
        };
      }
    }

    // Learn from pattern
    if (intent.entities.customer && intent.entities.amount) {
      await AIMemoryService.addPattern({
        customerName: intent.entities.customer,
        typicalAmountRange: {
          min: intent.entities.amount * 0.8,
          max: intent.entities.amount * 1.2,
        },
        category: intent.entities.reason || 'general',
        frequency: 1,
        lastUsed: Date.now(),
      });
    }

    return response;
  };

  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'create_payment_link':
        // Navigate to accept payment screen with pre-filled data
        setTimeout(() => {
          onNavigate('acceptPayment');
        }, 500);
        break;

      case 'show_qr':
        setTimeout(() => {
          onNavigate('acceptPayment');
        }, 500);
        break;

      case 'show_reminders':
      case 'show_pending':
        setTimeout(() => {
          onNavigate('reminders');
        }, 500);
        break;

      case 'confirm_payout':
        // Show confirmation dialog
        Alert.alert(
          'Confirm Payout',
          data?.text || `Pay ₹${data?.amount?.toLocaleString('en-IN')} to ${data?.vendor?.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Confirm',
              onPress: () => {
                // Execute payout
                const confirmMessage: Message = {
                  id: Date.now().toString(),
                  text: `Payout of ₹${data.amount.toLocaleString('en-IN')} to ${data.vendor.name} initiated successfully!`,
                  isUser: false,
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, confirmMessage]);
                setTimeout(() => {
                  onNavigate('makePayment');
                }, 1000);
              },
            },
          ]
        );
        break;

      case 'show_reports':
      case 'show_reconciliation':
        setTimeout(() => {
          onNavigate('reports');
        }, 500);
        break;

      case 'makePayment':
        setTimeout(() => {
          onNavigate('makePayment');
        }, 500);
        break;

      case 'acceptPayment':
        setTimeout(() => {
          onNavigate('acceptPayment');
        }, 500);
        break;

      case 'reports':
        setTimeout(() => {
          onNavigate('reports');
        }, 500);
        break;

      case 'reminders':
        setTimeout(() => {
          onNavigate('reminders');
        }, 500);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    // If there's an initial message, send it automatically
    if (initialMessage) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!text) {
      setInputText('');
    }

    // Generate AI response using orchestrator
    setTimeout(async () => {
      try {
        const aiResponse = await generateAIResponse(messageText);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse.text,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Handle actions
        if (aiResponse.action) {
          handleAction(aiResponse.action, aiResponse.data);
        }
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.aiMessageText,
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={RazorpayGradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={() => {
              // Handle voice input - for now, just show a message
              const voiceMessage: Message = {
                id: Date.now().toString(),
                text: 'Voice input feature coming soon!',
                isUser: false,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, voiceMessage]);
            }}
          >
            <Ionicons name="mic" size={24} color={RazorpayColors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={() => handleSend()}>
            <LinearGradient
              colors={RazorpayGradients.primary}
              style={styles.sendButtonGradient}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RazorpayColors.backgroundTertiary,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: RazorpayColors.primary,
  },
  aiBubble: {
    backgroundColor: RazorpayColors.white,
    borderWidth: 1,
    borderColor: RazorpayColors.border,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: RazorpayColors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: RazorpayColors.white,
    borderTopWidth: 1,
    borderTopColor: RazorpayColors.border,
  },
  input: {
    flex: 1,
    backgroundColor: RazorpayColors.backgroundTertiary,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: RazorpayColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: RazorpayColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sendButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

