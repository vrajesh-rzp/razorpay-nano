import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RazorpayColors, RazorpayGradients } from '../theme/colors';
import { VoiceInputBar } from '../components/VoiceInputBar';

interface DashboardScreenProps {
  userName: string;
  businessName: string;
  onMakePayment: () => void;
  onAcceptPayment: () => void;
  onViewReports: () => void;
  onSendReminders: () => void;
  onLogout: () => void;
  onOpenChat?: (initialMessage?: string) => void;
}

interface RecentActivity {
  id: string;
  type: 'collect' | 'pay' | 'reminder';
  amount: number;
  description: string;
  date: string;
}

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'collect',
    amount: 5000,
    description: 'Received from ABC Corp',
    date: '2 hours ago',
  },
  {
    id: '2',
    type: 'pay',
    amount: 3000,
    description: 'Paid to XYZ Suppliers',
    date: '5 hours ago',
  },
  {
    id: '3',
    type: 'reminder',
    amount: 10000,
    description: 'Reminder sent to Customer A',
    date: '1 day ago',
  },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName,
  businessName,
  onMakePayment,
  onAcceptPayment,
  onViewReports,
  onSendReminders,
  onLogout,
  onOpenChat,
}) => {
  const [dateRange, setDateRange] = useState('Today');
  const [showDateFilter, setShowDateFilter] = useState(false);

  const dateRangeOptions = ['Today', 'This Week', 'This Month', 'Last Month', 'This Year', 'Custom'];

  const handleVoiceInput = () => {
    // Open chat when voice button is pressed
    if (onOpenChat) {
      onOpenChat();
    }
  };

  const handleChatFocus = () => {
    // Open chat when any element of the chat panel comes into focus
    if (onOpenChat) {
      onOpenChat();
    }
  };

  const handleSendMessage = (message: string) => {
    // Open chat with the message when user sends from input bar
    if (onOpenChat) {
      onOpenChat(message);
    }
  };

  const renderRecentActivity = ({ item }: { item: RecentActivity }) => {
    const getIcon = () => {
      switch (item.type) {
        case 'collect':
          return <Ionicons name="arrow-down" size={20} color={RazorpayColors.success} />;
        case 'pay':
          return <Ionicons name="arrow-up" size={20} color={RazorpayColors.error} />;
        case 'reminder':
          return <Ionicons name="notifications-outline" size={20} color={RazorpayColors.warning} />;
      }
    };

    return (
      <View style={styles.activityItem}>
        <View style={styles.activityIcon}>{getIcon()}</View>
        <View style={styles.activityContent}>
          <Text style={styles.activityDescription}>{item.description}</Text>
          <Text style={styles.activityDate}>{item.date}</Text>
        </View>
        <Text style={styles.activityAmount}>₹{item.amount.toLocaleString('en-IN')}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={RazorpayGradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.businessName}>{businessName}</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={RazorpayColors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Net Collections and Net Payouts Cards */}
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryLabel}>Net Collections</Text>
                <TouchableOpacity
                  style={styles.dateFilter}
                  onPress={() => setShowDateFilter(true)}
                >
                  <Text style={styles.dateFilterText}>{dateRange}</Text>
                  <Ionicons name="chevron-down" size={16} color={RazorpayColors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.summaryAmount, { color: RazorpayColors.success }]}>
                ₹1,25,000
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryLabel}>Net Payouts</Text>
                <TouchableOpacity
                  style={styles.dateFilter}
                  onPress={() => setShowDateFilter(true)}
                >
                  <Text style={styles.dateFilterText}>{dateRange}</Text>
                  <Ionicons name="chevron-down" size={16} color={RazorpayColors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.summaryAmount, { color: RazorpayColors.error }]}>
                ₹65,000
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={onAcceptPayment}>
              <View style={styles.actionButtonIcon}>
                <Ionicons name="download-outline" size={28} color={RazorpayColors.primary} />
              </View>
              <Text style={styles.actionButtonText}>Collect</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={onMakePayment}>
              <View style={styles.actionButtonIcon}>
                <Ionicons name="arrow-up-outline" size={28} color={RazorpayColors.primary} />
              </View>
              <Text style={styles.actionButtonText}>Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={onViewReports}>
              <View style={styles.actionButtonIcon}>
                <Ionicons name="document-text-outline" size={28} color={RazorpayColors.primary} />
              </View>
              <Text style={styles.actionButtonText}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={onSendReminders}>
              <View style={styles.actionButtonIcon}>
                <Ionicons name="notifications-outline" size={28} color={RazorpayColors.primary} />
              </View>
              <Text style={styles.actionButtonText}>Remind</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentActivitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <FlatList
              data={mockRecentActivity}
              renderItem={renderRecentActivity}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        {/* Voice Input Bar */}
        <VoiceInputBar
          onSend={handleSendMessage}
          onVoiceInput={handleVoiceInput}
          onFocus={handleChatFocus}
        />
      </View>

      {/* Date Range Filter Modal */}
      <Modal
        visible={showDateFilter}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDateFilter(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDateFilter(false)}
        >
          <View style={styles.dateFilterModal}>
            <Text style={styles.dateFilterModalTitle}>Select Date Range</Text>
            {dateRangeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dateFilterOption,
                  dateRange === option && styles.dateFilterOptionSelected,
                ]}
                onPress={() => {
                  setDateRange(option);
                  setShowDateFilter(false);
                }}
              >
                <Text
                  style={[
                    styles.dateFilterOptionText,
                    dateRange === option && styles.dateFilterOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {dateRange === option && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={RazorpayColors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RazorpayColors.backgroundTertiary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
  },
  welcomeText: {
    color: RazorpayColors.white,
    fontSize: 14,
    opacity: 0.9,
  },
  userName: {
    color: RazorpayColors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  businessName: {
    color: RazorpayColors.white,
    fontSize: 16,
    marginTop: 4,
    opacity: 0.9,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 10,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: RazorpayColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: RazorpayColors.textSecondary,
    fontWeight: '500',
  },
  dateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateFilterText: {
    fontSize: 12,
    color: RazorpayColors.textSecondary,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionButtonIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: RazorpayColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
    shadowColor: RazorpayColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    fontSize: 12,
    color: RazorpayColors.text,
    fontWeight: '500',
  },
  recentActivitySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: RazorpayColors.text,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: RazorpayColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: RazorpayColors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: RazorpayColors.text,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: RazorpayColors.textTertiary,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: RazorpayColors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateFilterModal: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  dateFilterModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: RazorpayColors.text,
    marginBottom: 16,
  },
  dateFilterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  dateFilterOptionSelected: {
    backgroundColor: RazorpayColors.backgroundSecondary,
  },
  dateFilterOptionText: {
    fontSize: 16,
    color: RazorpayColors.text,
  },
  dateFilterOptionTextSelected: {
    color: RazorpayColors.primary,
    fontWeight: '600',
  },
});
