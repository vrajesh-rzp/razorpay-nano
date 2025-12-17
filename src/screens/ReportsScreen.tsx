import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RazorpayColors, RazorpayGradients } from '../theme/colors';
import { MockDataService } from '../services/mockData';

interface ReportsScreenProps {
  onBack: () => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ onBack }) => {
  const [report] = useState(MockDataService.getReports()[0]);

  const handleGenerateReport = () => {
    Alert.alert(
      'Generate Report',
      'Daily report will be generated and sent to your email.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            Alert.alert('Success', 'Report generated and sent to your email!');
          },
        },
      ]
    );
  };

  const StatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
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
          <Text style={styles.headerTitle}>Daily Reports</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <Text style={styles.dateText}>
            {new Date(report.date).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>

          <View style={styles.statsContainer}>
            <StatCard
              label="Total Payments Made"
              value={`₹${report.totalPayments.toLocaleString('en-IN')}`}
              color="#10b981"
            />
            <StatCard
              label="Total Received"
              value={`₹${report.totalReceived.toLocaleString('en-IN')}`}
              color="#3b82f6"
            />
            <StatCard
              label="Pending Payments"
              value={`₹${report.pendingPayments.toLocaleString('en-IN')}`}
              color="#f59e0b"
            />
            <StatCard
              label="Pending Receivables"
              value={`₹${report.pendingReceivables.toLocaleString('en-IN')}`}
              color="#ef4444"
            />
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Net Balance</Text>
            <Text style={styles.summaryValue}>
              ₹{(report.totalReceived - report.totalPayments).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateReport}>
          <LinearGradient
            colors={RazorpayGradients.info}
            style={styles.generateButtonGradient}
          >
            <Text style={styles.generateButtonText}>Generate & Send Report</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: RazorpayColors.text,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: RazorpayColors.textSecondary,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: RazorpayColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: RazorpayColors.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: RazorpayColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 16,
    color: RazorpayColors.textSecondary,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: RazorpayColors.success,
  },
  generateButton: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  generateButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

