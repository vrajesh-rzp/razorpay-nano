import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RazorpayColors, RazorpayGradients } from '../theme/colors';

interface AcceptPaymentScreenProps {
  onBack: () => void;
}

export const AcceptPaymentScreen: React.FC<AcceptPaymentScreenProps> = ({ onBack }) => {
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank' | 'card'>('upi');

  const handleAcceptPayment = () => {
    if (!customerName || !amount) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    Alert.alert(
      'Payment Request',
      `Request ₹${amount} from ${customerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: () => {
            Alert.alert('Success', 'Payment request sent successfully!');
            setCustomerName('');
            setAmount('');
            setDescription('');
          },
        },
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Accept Payment</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Customer Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter customer name"
            value={customerName}
            onChangeText={setCustomerName}
          />

          <Text style={styles.label}>Amount (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.methodContainer}>
            <TouchableOpacity
              style={[
                styles.methodButton,
                paymentMethod === 'upi' && styles.methodButtonActive,
              ]}
              onPress={() => setPaymentMethod('upi')}
            >
              <Text
                style={[
                  styles.methodButtonText,
                  paymentMethod === 'upi' && styles.methodButtonTextActive,
                ]}
              >
                UPI
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.methodButton,
                paymentMethod === 'bank' && styles.methodButtonActive,
              ]}
              onPress={() => setPaymentMethod('bank')}
            >
              <Text
                style={[
                  styles.methodButtonText,
                  paymentMethod === 'bank' && styles.methodButtonTextActive,
                ]}
              >
                Bank Transfer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.methodButton,
                paymentMethod === 'card' && styles.methodButtonActive,
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <Text
                style={[
                  styles.methodButtonText,
                  paymentMethod === 'card' && styles.methodButtonTextActive,
                ]}
              >
                Card
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Payment description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.requestButton} onPress={handleAcceptPayment}>
            <LinearGradient
              colors={RazorpayGradients.secondary}
              style={styles.requestButtonGradient}
            >
              <Text style={styles.requestButtonText}>Send Payment Request</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: RazorpayColors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: RazorpayColors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  methodContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  methodButton: {
    flex: 1,
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: RazorpayColors.border,
  },
  methodButtonActive: {
    borderColor: RazorpayColors.primary,
    backgroundColor: RazorpayColors.backgroundSecondary,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: RazorpayColors.textSecondary,
  },
  methodButtonTextActive: {
    color: RazorpayColors.primary,
  },
  requestButton: {
    marginTop: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  requestButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

