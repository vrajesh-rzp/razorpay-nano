import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RazorpayColors, RazorpayGradients } from '../theme/colors';
import { Reminder } from '../types';
import { MockDataService } from '../services/mockData';

interface RemindersScreenProps {
  onBack: () => void;
}

export const RemindersScreen: React.FC<RemindersScreenProps> = ({ onBack }) => {
  const [reminders, setReminders] = useState<Reminder[]>(MockDataService.getReminders());

  const handleSendReminder = (reminder: Reminder) => {
    Alert.alert(
      'Send Reminder',
      `Send payment reminder to ${reminder.customerName} for ₹${reminder.amount.toLocaleString('en-IN')}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            setReminders(prev =>
              prev.map(r =>
                r.id === reminder.id ? { ...r, status: 'sent' as const } : r
              )
            );
            Alert.alert('Success', 'Reminder sent successfully!');
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return RazorpayColors.info;
      case 'paid':
        return RazorpayColors.success;
      default:
        return RazorpayColors.warning;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Sent';
      case 'paid':
        return 'Paid';
      default:
        return 'Pending';
    }
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={styles.reminderCard}>
      <View style={styles.reminderHeader}>
        <View>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.amount}>₹{item.amount.toLocaleString('en-IN')}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      <Text style={styles.dueDate}>
        Due: {new Date(item.dueDate).toLocaleDateString('en-IN')}
      </Text>
      {item.status === 'pending' && (
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleSendReminder(item)}
        >
          <Text style={styles.sendButtonText}>Send Reminder</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={RazorpayGradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Reminders</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No pending reminders</Text>
          </View>
        ) : (
          <FlatList
            data={reminders}
            renderItem={renderReminder}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
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
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  reminderCard: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: RazorpayColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: RazorpayColors.text,
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: RazorpayColors.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dueDate: {
    fontSize: 14,
    color: RazorpayColors.textSecondary,
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: RazorpayColors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonText: {
    color: RazorpayColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: RazorpayColors.textSecondary,
  },
});

