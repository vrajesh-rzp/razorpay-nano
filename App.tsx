import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { MakePaymentScreen } from './src/screens/MakePaymentScreen';
import { AcceptPaymentScreen } from './src/screens/AcceptPaymentScreen';
import { ReportsScreen } from './src/screens/ReportsScreen';
import { RemindersScreen } from './src/screens/RemindersScreen';
import { AIChatScreen } from './src/screens/AIChatScreen';
import { AIFloatingButton } from './src/components/AIFloatingButton';
import { AuthService } from './src/services/auth';
import { StorageService } from './src/services/storage';
import { User } from './src/types';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  MakePayment: undefined;
  AcceptPayment: undefined;
  Reports: undefined;
  Reminders: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>(undefined);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    checkInitialState();
  }, []);

  const checkInitialState = async () => {
    setIsLoading(true);
    const onboardingCompleted = await StorageService.isOnboardingCompleted();
    const user = await AuthService.getCurrentUser();
    
    setShowOnboarding(!onboardingCompleted);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const handleOnboardingComplete = async () => {
    await StorageService.setOnboardingCompleted(true);
    setShowOnboarding(false);
  };

  const checkAuth = async () => {
    const user = await AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  };

  const handleLoginSuccess = () => {
    checkAuth();
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleAIChatNavigate = (screen: string) => {
    setShowAIChat(false);
    setTimeout(() => {
      if (navigationRef.current) {
        navigationRef.current.navigate(screen as keyof RootStackParamList);
      }
    }, 300);
  };

  const handleOpenChat = (initialMessage?: string) => {
    setInitialChatMessage(initialMessage);
    setShowAIChat(true);
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  if (showOnboarding) {
    return (
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="light" />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLoginSuccess={handleLoginSuccess}
                onShowAccountSelection={() => {}}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Dashboard">
              {(props) => (
                <DashboardScreen
                  {...props}
                  userName={currentUser?.name || 'User'}
                  businessName={currentUser?.businessName || 'Business'}
                  onMakePayment={() => props.navigation.navigate('MakePayment')}
                  onAcceptPayment={() => props.navigation.navigate('AcceptPayment')}
                  onViewReports={() => props.navigation.navigate('Reports')}
                  onSendReminders={() => props.navigation.navigate('Reminders')}
                  onLogout={handleLogout}
                  onOpenChat={handleOpenChat}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="MakePayment">
              {(props) => (
                <View style={styles.container}>
                  <MakePaymentScreen
                    {...props}
                    onBack={() => props.navigation.goBack()}
                  />
                  {!showAIChat && <AIFloatingButton onPress={() => setShowAIChat(true)} />}
                </View>
              )}
            </Stack.Screen>
            <Stack.Screen name="AcceptPayment">
              {(props) => (
                <View style={styles.container}>
                  <AcceptPaymentScreen
                    {...props}
                    onBack={() => props.navigation.goBack()}
                  />
                  {!showAIChat && <AIFloatingButton onPress={() => setShowAIChat(true)} />}
                </View>
              )}
            </Stack.Screen>
            <Stack.Screen name="Reports">
              {(props) => (
                <View style={styles.container}>
                  <ReportsScreen
                    {...props}
                    onBack={() => props.navigation.goBack()}
                  />
                  {!showAIChat && <AIFloatingButton onPress={() => setShowAIChat(true)} />}
                </View>
              )}
            </Stack.Screen>
            <Stack.Screen name="Reminders">
              {(props) => (
                <View style={styles.container}>
                  <RemindersScreen
                    {...props}
                    onBack={() => props.navigation.goBack()}
                  />
                  {!showAIChat && <AIFloatingButton onPress={() => setShowAIChat(true)} />}
    </View>
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>

      {isAuthenticated && (
        <Modal
          visible={showAIChat}
          animationType="slide"
          transparent={false}
          onRequestClose={() => {
            setShowAIChat(false);
            setInitialChatMessage(undefined);
          }}
        >
          <AIChatScreen
            onClose={() => {
              setShowAIChat(false);
              setInitialChatMessage(undefined);
            }}
            onNavigate={handleAIChatNavigate}
            initialMessage={initialChatMessage}
          />
        </Modal>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
