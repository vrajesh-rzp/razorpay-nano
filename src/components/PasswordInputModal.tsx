import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RazorpayColors, RazorpayGradients } from '../theme/colors';

interface PasswordInputModalProps {
  visible: boolean;
  email: string;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export const PasswordInputModal: React.FC<PasswordInputModalProps> = ({
  visible,
  email,
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (password.trim()) {
      onConfirm(password);
      setPassword('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.modal}>
            <Text style={styles.title}>Enter Password</Text>
            <Text style={styles.subtitle}>{email}</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoFocus
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginButton} onPress={handleConfirm}>
                <LinearGradient
                  colors={RazorpayGradients.primary}
                  style={styles.loginButtonGradient}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: RazorpayColors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    padding: 20,
  },
  modal: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: RazorpayColors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: RazorpayColors.textSecondary,
    marginBottom: 20,
  },
  input: {
    backgroundColor: RazorpayColors.backgroundTertiary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: RazorpayColors.border,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RazorpayColors.border,
  },
  cancelButtonText: {
    color: RazorpayColors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: RazorpayColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

