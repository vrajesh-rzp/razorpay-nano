import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { MakePaymentScreen } from './src/screens/MakePaymentScreen';
import { AcceptPaymentScreen } from './src/screens/AcceptPaymentScreen';
import { ReportsScreen } from './src/screens/ReportsScreen';
import { RemindersScreen } from './src/screens/RemindersScreen';
import { AIChatScreen } from './src/screens/AIChatScreen';
import { AIFloatingButton } from './src/components/AIFloatingButton';
import { AuthService } from './src/services/auth';
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
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setShowLogin(false);
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
                <View style={styles.container}>
                  <DashboardScreen
                    {...props}
                    userName={currentUser?.name || 'User'}
                    businessName={currentUser?.businessName || 'Business'}
                    onMakePayment={() => props.navigation.navigate('MakePayment')}
                    onAcceptPayment={() => props.navigation.navigate('AcceptPayment')}
                    onViewReports={() => props.navigation.navigate('Reports')}
                    onSendReminders={() => props.navigation.navigate('Reminders')}
                    onLogout={handleLogout}
                  />
                  {!showAIChat && <AIFloatingButton onPress={() => setShowAIChat(true)} />}
                </View>
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
          onRequestClose={() => setShowAIChat(false)}
        >
          <AIChatScreen
            onClose={() => setShowAIChat(false)}
            onNavigate={handleAIChatNavigate}
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
