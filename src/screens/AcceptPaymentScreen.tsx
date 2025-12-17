import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RazorpayColors, RazorpayGradients } from '../theme/colors';

interface AcceptPaymentScreenProps {
  onBack: () => void;
}

export const AcceptPaymentScreen: React.FC<AcceptPaymentScreenProps> = ({ onBack }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [referenceId, setReferenceId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'standard' | 'upi'>('standard');
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  // Generate reference ID on mount
  useEffect(() => {
    generateReferenceId();
  }, []);

  const generateReferenceId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const newRefId = `REF${timestamp}${random}`;
    setReferenceId(newRefId);
  };

  // Mock QR code data - in production, this would be the actual payment QR code
  const qrCodeData = 'upi://pay?pa=merchant@razorpay&pn=Razorpay%20Merchant&am=0&cu=INR&tn=Payment';

  const handleCreatePaymentLink = () => {
    if (!customerName || !customerContact) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    Alert.alert(
      'Payment Link Created',
      `Payment link has been created and sent to ${customerContact}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setCustomerName('');
            setCustomerContact('');
            generateReferenceId();
            setExpiryDate(null);
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={RazorpayGradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={RazorpayColors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collect Payment</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Scan to Pay</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={qrCodeData}
              size={200}
              color={RazorpayColors.text}
              backgroundColor={RazorpayColors.white}
            />
          </View>
          <Text style={styles.qrSubtext}>Anyone can scan this QR code to pay you</Text>
        </View>

        {/* Payment Link Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Create Payment Link</Text>

          <Text style={styles.label}>Customer Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter customer name"
            placeholderTextColor={RazorpayColors.textTertiary}
            value={customerName}
            onChangeText={setCustomerName}
          />

          <Text style={styles.label}>Contact Type</Text>
          <View style={styles.contactTypeContainer}>
            <TouchableOpacity
              style={[
                styles.contactTypeButton,
                contactType === 'email' && styles.contactTypeButtonActive,
              ]}
              onPress={() => setContactType('email')}
            >
              <Text
                style={[
                  styles.contactTypeButtonText,
                  contactType === 'email' && styles.contactTypeButtonTextActive,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.contactTypeButton,
                contactType === 'phone' && styles.contactTypeButtonActive,
              ]}
              onPress={() => setContactType('phone')}
            >
              <Text
                style={[
                  styles.contactTypeButtonText,
                  contactType === 'phone' && styles.contactTypeButtonTextActive,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            {contactType === 'email' ? 'Email *' : 'Phone Number *'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={contactType === 'email' ? 'Enter email address' : 'Enter phone number'}
            placeholderTextColor={RazorpayColors.textTertiary}
            value={customerContact}
            onChangeText={setCustomerContact}
            keyboardType={contactType === 'email' ? 'email-address' : 'phone-pad'}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Reference ID</Text>
          <View style={styles.referenceIdContainer}>
            <TextInput
              style={[styles.input, styles.referenceIdInput]}
              value={referenceId}
              onChangeText={setReferenceId}
              placeholder="Reference ID"
              placeholderTextColor={RazorpayColors.textTertiary}
            />
            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={generateReferenceId}
            >
              <Ionicons name="refresh" size={20} color={RazorpayColors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.methodContainer}>
            <TouchableOpacity
              style={[
                styles.methodButton,
                paymentMethod === 'standard' && styles.methodButtonActive,
              ]}
              onPress={() => setPaymentMethod('standard')}
            >
              <Text
                style={[
                  styles.methodButtonText,
                  paymentMethod === 'standard' && styles.methodButtonTextActive,
                ]}
              >
                Standard
              </Text>
            </TouchableOpacity>
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
          </View>

          <Text style={styles.label}>Link Expiry (Optional)</Text>
          <TouchableOpacity
            style={styles.expiryButton}
            onPress={() => setShowExpiryPicker(true)}
          >
            {expiryDate ? (
              <Text style={styles.expiryButtonText}>
                {formatDate(expiryDate)} at {formatTime(expiryDate)}
              </Text>
            ) : (
              <Text style={styles.expiryButtonTextPlaceholder}>
                Select expiry date and time
              </Text>
            )}
            <Ionicons name="calendar-outline" size={20} color={RazorpayColors.textSecondary} />
          </TouchableOpacity>
          {expiryDate && (
            <TouchableOpacity
              style={styles.clearExpiryButton}
              onPress={() => setExpiryDate(null)}
            >
              <Text style={styles.clearExpiryText}>Clear expiry</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.createButton} onPress={handleCreatePaymentLink}>
            <LinearGradient
              colors={RazorpayGradients.secondary}
              style={styles.createButtonGradient}
            >
              <Text style={styles.createButtonText}>Create Payment Link</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Time Picker Modal */}
      {showExpiryPicker && (
        <Modal
          visible={showExpiryPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowExpiryPicker(false)}
        >
          <View style={styles.pickerModal}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Expiry Date & Time</Text>
                <TouchableOpacity onPress={() => setShowExpiryPicker(false)}>
                  <Ionicons name="close" size={24} color={RazorpayColors.text} />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={expiryDate || new Date()}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowExpiryPicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setExpiryDate(selectedDate);
                  }
                }}
                minimumDate={new Date()}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.pickerDoneButton}
                  onPress={() => setShowExpiryPicker(false)}
                >
                  <Text style={styles.pickerDoneButtonText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}
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
  headerTitle: {
    color: RazorpayColors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  qrSection: {
    backgroundColor: RazorpayColors.white,
    margin: 20,
    marginBottom: 0,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: RazorpayColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: RazorpayColors.text,
    marginBottom: 16,
  },
  qrContainer: {
    backgroundColor: RazorpayColors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  qrSubtext: {
    fontSize: 12,
    color: RazorpayColors.textSecondary,
    textAlign: 'center',
  },
  formSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: RazorpayColors.text,
    marginBottom: 20,
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
    color: RazorpayColors.text,
  },
  contactTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  contactTypeButton: {
    flex: 1,
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: RazorpayColors.border,
  },
  contactTypeButtonActive: {
    borderColor: RazorpayColors.primary,
    backgroundColor: RazorpayColors.backgroundSecondary,
  },
  contactTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: RazorpayColors.textSecondary,
  },
  contactTypeButtonTextActive: {
    color: RazorpayColors.primary,
  },
  referenceIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  referenceIdInput: {
    flex: 1,
  },
  regenerateButton: {
    padding: 12,
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RazorpayColors.border,
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
  expiryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: RazorpayColors.border,
  },
  expiryButtonText: {
    fontSize: 16,
    color: RazorpayColors.text,
  },
  expiryButtonTextPlaceholder: {
    fontSize: 16,
    color: RazorpayColors.textTertiary,
  },
  clearExpiryButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  clearExpiryText: {
    fontSize: 12,
    color: RazorpayColors.primary,
    textDecorationLine: 'underline',
  },
  createButton: {
    marginTop: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: RazorpayColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: RazorpayColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: RazorpayColors.text,
  },
  pickerDoneButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: RazorpayColors.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickerDoneButtonText: {
    color: RazorpayColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
