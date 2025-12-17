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

interface MakePaymentScreenProps {
  onBack: () => void;
}

export const MakePaymentScreen: React.FC<MakePaymentScreenProps> = ({ onBack }) => {
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handlePayment = () => {
    if (!vendorName || !amount || !accountNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    Alert.alert(
      'Confirm Payment',
      `Pay ₹${amount} to ${vendorName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Payment initiated successfully!');
            // Reset form
            setVendorName('');
            setAmount('');
            setDescription('');
            setAccountNumber('');
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
          <Text style={styles.headerTitle}>Make Payment</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Vendor Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter vendor name"
            value={vendorName}
            onChangeText={setVendorName}
          />

          <Text style={styles.label}>Account Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Amount (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Payment description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <LinearGradient
              colors={RazorpayGradients.success}
              style={styles.payButtonGradient}
            >
              <Text style={styles.payButtonText}>Initiate Payment</Text>
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
  payButton: {
    marginTop: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  payButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

