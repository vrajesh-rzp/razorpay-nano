import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RazorpayColors } from '../theme/colors';

interface VoiceInputBarProps {
  onSend: (message: string) => void;
  onVoiceInput: () => void;
  onFocus?: () => void;
}

export const VoiceInputBar: React.FC<VoiceInputBarProps> = ({
  onSend,
  onVoiceInput,
  onFocus,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText.trim());
      setInputText('');
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.inputContainer}
        activeOpacity={0.9}
        onPress={handleFocus}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ask 'Collect 500 from Suresh'..."
            placeholderTextColor={RazorpayColors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            onFocus={handleFocus}
            multiline={false}
            editable={false}
            pointerEvents="none"
          />
        </View>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleFocus}
        >
          <Ionicons
            name="send-outline"
            size={20}
            color={RazorpayColors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.voiceButton} onPress={onVoiceInput}>
          <Ionicons name="mic" size={24} color={RazorpayColors.white} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    backgroundColor: RazorpayColors.backgroundTertiary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RazorpayColors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Neumorphic effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    fontSize: 16,
    color: RazorpayColors.text,
    padding: 0,
  },
  sendButton: {
    padding: 4,
    marginRight: 8,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: RazorpayColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: RazorpayColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

