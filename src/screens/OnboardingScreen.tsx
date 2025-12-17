import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RazorpayColors, RazorpayGradients } from '../theme/colors';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  content: React.ReactNode;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const ChatBubbles = () => (
    <View style={styles.chatBubblesContainer}>
      <View style={[styles.chatBubble, styles.chatBubble1]}>
        <Text style={styles.chatBubbleText}>"Collect 500 from Suresh"</Text>
      </View>
      <View style={[styles.chatBubble, styles.chatBubble2]}>
        <Text style={styles.chatBubbleText}>"Show me today's reports"</Text>
      </View>
      <View style={[styles.chatBubble, styles.chatBubble3]}>
        <Text style={styles.chatBubbleText}>"Send reminder to ABC Corp"</Text>
      </View>
      <View style={[styles.chatBubble, styles.chatBubble4]}>
        <Text style={styles.chatBubbleText}>"Pay ₹10,000 to XYZ Suppliers"</Text>
      </View>
    </View>
  );

  const slides: OnboardingSlide[] = [
    {
      id: 1,
      title: 'Collect Payments from Users',
      description: 'Accept payments seamlessly from your customers via QR codes and payment links',
      icon: 'qr-code-outline',
      content: (
        <View style={styles.slideContent}>
          <View style={styles.illustrationContainer}>
            <View style={styles.phoneMockup}>
              <View style={styles.phoneHeader}>
                <Text style={styles.phoneHeaderText}>The Acme Store</Text>
                <Ionicons name="shield-checkmark" size={16} color={RazorpayColors.success} />
              </View>
              <View style={styles.orderSection}>
                <Text style={styles.orderTitle}>Order Summary</Text>
                <View style={styles.productsRow}>
                  <View style={styles.productIcon} />
                  <View style={styles.productIcon} />
                  <Text style={styles.moreProducts}>...</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.oldPrice}>₹120</Text>
                  <Text style={styles.newPrice}>₹100</Text>
                </View>
              </View>
              <View style={styles.paymentSection}>
                <Text style={styles.paymentTitle}>Payment Options</Text>
                <View style={styles.paymentMethods}>
                  <View style={styles.paymentMethod}>
                    <Ionicons name="play" size={16} color={RazorpayColors.primary} />
                    <Text style={styles.paymentMethodText}>UPI</Text>
                  </View>
                  <View style={styles.paymentMethod}>
                    <Ionicons name="card" size={16} color={RazorpayColors.primary} />
                    <Text style={styles.paymentMethodText}>Cards</Text>
                  </View>
                  <View style={styles.paymentMethod}>
                    <Ionicons name="business" size={16} color={RazorpayColors.primary} />
                    <Text style={styles.paymentMethodText}>Net Banking</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.smsBubble}>
              <View style={styles.smsHeader}>
                <Ionicons name="mail" size={16} color={RazorpayColors.white} />
                <Text style={styles.smsHeaderText}>SMS</Text>
              </View>
              <Text style={styles.smsText}>Pay via this link</Text>
              <Text style={styles.smsLink}>https://rzp.io/i/16irM7DO</Text>
              <Ionicons name="arrow-forward" size={12} color={RazorpayColors.primary} />
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 2,
      title: 'Make Payouts to Your Vendors',
      description: 'Easily disburse payments to your vendors and track all payout transactions',
      icon: 'arrow-up-circle-outline',
      content: (
        <View style={styles.slideContent}>
          <View style={styles.illustrationContainer}>
            <View style={styles.payoutDashboard}>
              <View style={styles.payoutHeader}>
                <Text style={styles.payoutTitle}>Payouts</Text>
                <TouchableOpacity style={styles.makePayoutButton}>
                  <Text style={styles.makePayoutButtonText}>+ Make Payout</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.payoutTable}>
                <View style={styles.payoutRow}>
                  <Text style={styles.payoutAmount}>₹50,000</Text>
                  <View style={styles.payoutStatusPending}>
                    <Text style={styles.payoutStatusText}>Pending</Text>
                  </View>
                  <Text style={styles.payoutRecipient}>Aman Surana</Text>
                </View>
                <View style={styles.payoutRow}>
                  <Text style={styles.payoutAmount}>₹27,000</Text>
                  <View style={styles.payoutStatusQueued}>
                    <Text style={styles.payoutStatusText}>Queued</Text>
                  </View>
                  <Text style={styles.payoutRecipient}>Ronil Dash</Text>
                </View>
                <View style={styles.payoutRow}>
                  <Text style={styles.payoutAmount}>₹3,000</Text>
                  <View style={styles.payoutStatusProcessed}>
                    <Text style={styles.payoutStatusText}>Processed</Text>
                  </View>
                  <Text style={styles.payoutRecipient}>Advaith Bhaskar</Text>
                </View>
              </View>
            </View>
            <View style={styles.payoutSuccess}>
              <Ionicons name="checkmark-circle" size={48} color={RazorpayColors.success} />
              <Text style={styles.payoutSuccessText}>Payouts Disbursed</Text>
              <Text style={styles.payoutSuccessDate}>AUGUST 2025</Text>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 3,
      title: 'Easy Reconciliation & Reminders',
      description: 'Track all your payments, generate reports, and send reminders to customers automatically',
      icon: 'document-text-outline',
      content: (
        <View style={styles.slideContent}>
          <View style={styles.illustrationContainer}>
            <View style={styles.reconciliationCard}>
              <View style={styles.reconciliationHeader}>
                <Ionicons name="stats-chart" size={24} color={RazorpayColors.primary} />
                <Text style={styles.reconciliationTitle}>Daily Reports</Text>
              </View>
              <View style={styles.reconciliationStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Collections</Text>
                  <Text style={styles.statValue}>₹1,25,000</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Payouts</Text>
                  <Text style={styles.statValue}>₹65,000</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Net Balance</Text>
                  <Text style={[styles.statValue, { color: RazorpayColors.success }]}>
                    ₹60,000
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.reminderCard}>
              <View style={styles.reminderHeader}>
                <Ionicons name="notifications" size={24} color={RazorpayColors.warning} />
                <Text style={styles.reminderTitle}>Payment Reminders</Text>
              </View>
              <View style={styles.reminderList}>
                <View style={styles.reminderItem}>
                  <Text style={styles.reminderCustomer}>ABC Corp</Text>
                  <Text style={styles.reminderAmount}>₹30,000</Text>
                  <Text style={styles.reminderDate}>Due in 3 days</Text>
                </View>
                <View style={styles.reminderItem}>
                  <Text style={styles.reminderCustomer}>XYZ Ltd</Text>
                  <Text style={styles.reminderAmount}>₹15,000</Text>
                  <Text style={styles.reminderDate}>Due in 5 days</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 4,
      title: "Don't Wanna Type? Talk to AI",
      description: 'Chat with our AI assistant to perform actions using natural language',
      icon: 'chatbubbles-outline',
      content: <ChatBubbles />,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentSlideData = slides[currentSlide];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={RazorpayGradients.primary}
        style={styles.gradient}
      >
        {/* Skip Button */}
        {currentSlide < slides.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}

        {/* Slide Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          <View style={styles.slideContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name={currentSlideData.icon as any} size={64} color={RazorpayColors.white} />
            </View>
            <Text style={styles.title}>{currentSlideData.title}</Text>
            <Text style={styles.description}>{currentSlideData.description}</Text>
            <View style={styles.contentContainer}>{currentSlideData.content}</View>
          </View>
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipButtonText: {
    color: RazorpayColors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: RazorpayColors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: RazorpayColors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  slideContent: {
    width: '100%',
    alignItems: 'center',
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  // Slide 1 - Payment Collection
  phoneMockup: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 16,
    padding: 16,
    width: width * 0.85,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  phoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  phoneHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: RazorpayColors.text,
  },
  orderSection: {
    marginBottom: 16,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: RazorpayColors.text,
    marginBottom: 8,
  },
  productsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  productIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: RazorpayColors.backgroundTertiary,
  },
  moreProducts: {
    fontSize: 14,
    color: RazorpayColors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  oldPrice: {
    fontSize: 14,
    color: RazorpayColors.textTertiary,
    textDecorationLine: 'line-through',
  },
  newPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: RazorpayColors.text,
  },
  paymentSection: {
    marginTop: 16,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: RazorpayColors.text,
    marginBottom: 8,
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: RazorpayColors.backgroundTertiary,
    borderRadius: 8,
  },
  paymentMethodText: {
    fontSize: 12,
    color: RazorpayColors.text,
  },
  smsBubble: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 12,
    padding: 12,
    width: width * 0.7,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  smsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: RazorpayColors.primary,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  smsHeaderText: {
    color: RazorpayColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  smsText: {
    fontSize: 14,
    color: RazorpayColors.text,
    marginBottom: 4,
  },
  smsLink: {
    fontSize: 12,
    color: RazorpayColors.primary,
    textDecorationLine: 'underline',
  },
  // Slide 2 - Payouts
  payoutDashboard: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 16,
    padding: 16,
    width: width * 0.9,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  payoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: RazorpayColors.text,
  },
  makePayoutButton: {
    backgroundColor: RazorpayColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  makePayoutButtonText: {
    color: RazorpayColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  payoutTable: {
    gap: 12,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: RazorpayColors.border,
  },
  payoutAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: RazorpayColors.text,
    flex: 1,
  },
  payoutStatusPending: {
    backgroundColor: RazorpayColors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  payoutStatusQueued: {
    backgroundColor: RazorpayColors.info + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  payoutStatusProcessed: {
    backgroundColor: RazorpayColors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  payoutStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: RazorpayColors.text,
  },
  payoutRecipient: {
    fontSize: 12,
    color: RazorpayColors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  payoutSuccess: {
    alignItems: 'center',
    backgroundColor: RazorpayColors.white,
    borderRadius: 16,
    padding: 24,
    width: width * 0.7,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  payoutSuccessText: {
    fontSize: 16,
    fontWeight: '600',
    color: RazorpayColors.text,
    marginTop: 12,
  },
  payoutSuccessDate: {
    fontSize: 12,
    color: RazorpayColors.textSecondary,
    marginTop: 4,
  },
  // Slide 3 - Reconciliation
  reconciliationCard: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 16,
    padding: 20,
    width: width * 0.9,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  reconciliationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  reconciliationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: RazorpayColors.text,
  },
  reconciliationStats: {
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: RazorpayColors.textSecondary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RazorpayColors.text,
  },
  reminderCard: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 16,
    padding: 20,
    width: width * 0.9,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  reminderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: RazorpayColors.text,
  },
  reminderList: {
    gap: 12,
  },
  reminderItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: RazorpayColors.border,
  },
  reminderCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: RazorpayColors.text,
    marginBottom: 4,
  },
  reminderAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RazorpayColors.primary,
    marginBottom: 4,
  },
  reminderDate: {
    fontSize: 12,
    color: RazorpayColors.textSecondary,
  },
  // Slide 4 - AI Chat
  chatBubblesContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  chatBubble: {
    backgroundColor: RazorpayColors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    maxWidth: width * 0.8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chatBubble1: {
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  chatBubble2: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  chatBubble3: {
    alignSelf: 'flex-start',
    marginLeft: 40,
  },
  chatBubble4: {
    alignSelf: 'flex-end',
    marginRight: 40,
  },
  chatBubbleText: {
    fontSize: 14,
    color: RazorpayColors.text,
    fontStyle: 'italic',
  },
  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    width: 24,
    backgroundColor: RazorpayColors.white,
  },
  // Next Button
  nextButton: {
    backgroundColor: RazorpayColors.white,
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: RazorpayColors.primary,
  },
});

