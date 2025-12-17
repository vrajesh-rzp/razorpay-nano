import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RazorpayColors, RazorpayGradients } from '../theme/colors';

interface DashboardScreenProps {
  userName: string;
  businessName: string;
  onMakePayment: () => void;
  onAcceptPayment: () => void;
  onViewReports: () => void;
  onSendReminders: () => void;
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName,
  businessName,
  onMakePayment,
  onAcceptPayment,
  onViewReports,
  onSendReminders,
  onLogout,
}) => {
  const ActionCard = ({
    title,
    description,
    icon,
    onPress,
    gradient,
  }: {
    title: string;
    description: string;
    icon: string;
    onPress: () => void;
    gradient: readonly [string, string, ...string[]];
  }) => (
    <TouchableOpacity onPress={onPress} style={styles.actionCard}>
      <LinearGradient colors={gradient} style={styles.cardGradient}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={RazorpayGradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.businessName}>{businessName}</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <ActionCard
            title="Make Payment"
            description="Pay your vendors seamlessly"
            icon="💸"
            onPress={onMakePayment}
            gradient={RazorpayGradients.success}
          />
          
          <ActionCard
            title="Accept Payment"
            description="Receive payments from customers"
            icon="💰"
            onPress={onAcceptPayment}
            gradient={RazorpayGradients.secondary}
          />
          
          <ActionCard
            title="Daily Reports"
            description="View and manage reports"
            icon="📊"
            onPress={onViewReports}
            gradient={RazorpayGradients.info}
          />
          
          <ActionCard
            title="Send Reminders"
            description="Remind customers about payments"
            icon="🔔"
            onPress={onSendReminders}
            gradient={RazorpayGradients.warning}
          />
        </View>
      </ScrollView>
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
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  businessName: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
    opacity: 0.9,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: RazorpayColors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardGradient: {
    padding: 20,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
});

