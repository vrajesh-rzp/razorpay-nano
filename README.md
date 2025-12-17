# Razorpay Nano

A React Native mobile application built with Expo for emerging business owners to manage payments, reports, and customer reminders seamlessly.

## Features

### 🔐 Authentication
- Email and password login
- Biometric authentication (fingerprint) support
- Quick access to last 5 accounts
- Secure credential storage

### 💰 Core Features
1. **Make Payments** - Pay vendors seamlessly with account details
2. **Accept Payments** - Receive payments from customers via UPI, Bank Transfer, or Card
3. **Daily Reports** - View and generate daily financial reports
4. **Payment Reminders** - Send reminders to customers for pending payments

### 🤖 AI Assistant
- Floating action button for quick access
- Conversational AI interface
- Navigate to different features through natural language
- Perform actions within the app

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Expo Local Authentication** for biometric auth
- **AsyncStorage** for local data storage
- **Expo Secure Store** for secure credential storage
- **Expo Linear Gradient** for beautiful UI gradients

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd razorpay-nano
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on Android:
```bash
npm run android
```

5. Run on iOS (macOS only):
```bash
npm run ios
```

## Project Structure

```
razorpay-nano/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AIFloatingButton.tsx
│   │   └── PasswordInputModal.tsx
│   ├── screens/            # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── AccountSelectionScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── MakePaymentScreen.tsx
│   │   ├── AcceptPaymentScreen.tsx
│   │   ├── ReportsScreen.tsx
│   │   ├── RemindersScreen.tsx
│   │   └── AIChatScreen.tsx
│   ├── services/           # Business logic and API services
│   │   ├── auth.ts
│   │   ├── biometric.ts
│   │   ├── storage.ts
│   │   └── mockData.ts
│   └── types/              # TypeScript type definitions
│       └── index.ts
├── App.tsx                  # Main app component with navigation
├── app.json                 # Expo configuration
└── package.json
```

## Mock Data

The app uses mock data for demonstration purposes. In production, these would be replaced with actual API calls:

- **Mock Users**: `merchant1@razorpay.com`, `merchant2@razorpay.com`, `merchant3@razorpay.com`
- Any password works for login (for demo purposes)
- Reports and reminders use sample data

## Features in Detail

### Authentication Flow
1. First-time login requires email and password
2. After first login, user is prompted to enable biometric authentication
3. If enabled, subsequent logins can use fingerprint
4. Last 5 accounts are saved for quick access

### AI Assistant
The AI assistant can understand natural language commands like:
- "Make a payment to vendor"
- "Accept payment from customer"
- "Show me reports"
- "Send payment reminders"

## Development Notes

- The app is currently built for Android, with iOS support planned
- All authentication is mocked for frontend development
- The AI assistant uses a simple rule-based system (can be replaced with actual AI/LLM integration)
- Secure storage is used for credentials
- Biometric authentication requires device support

## Future Enhancements

- [ ] Real API integration
- [ ] Push notifications for reports
- [ ] Advanced AI/LLM integration
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Analytics and tracking

## License

This project is proprietary software for Razorpay.

