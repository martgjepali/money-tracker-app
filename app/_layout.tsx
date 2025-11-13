import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNav from '../components/BottomNav';
import ThemeProvider from '../theme/theme-provider';
import './globals.css';
import { AuthProvider, useAuth } from './providers/AuthProvider';

function LayoutContent() {
  const { isAuthenticated } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: '#010817' }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: 'transparent' },
          freezeOnBlur: true,
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            animation: 'none',
          }}
        />
        <Stack.Screen 
          name="dashboard" 
          options={{ 
            animation: 'none',
          }}
        />
        <Stack.Screen 
          name="income" 
          options={{ 
            animation: 'none',
          }}
        />
        <Stack.Screen 
          name="savings" 
          options={{ 
            animation: 'none',
          }}
        />
        <Stack.Screen 
          name="expenses" 
          options={{ 
            animation: 'none',
          }}
        />
        <Stack.Screen 
          name="goals" 
          options={{ 
            animation: 'none',
          }}
        />
        <Stack.Screen 
          name="debts" 
          options={{ 
            animation: 'none',
          }}
        />
        <Stack.Screen 
          name="subscriptions" 
          options={{ 
            animation: 'none',
          }}
        />
      </Stack>
      {isAuthenticated && <BottomNav />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <LayoutContent />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
