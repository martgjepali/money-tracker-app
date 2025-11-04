import { Slot } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNav from '../components/BottomNav';
import ThemeProvider from '../theme/theme-provider';
import './globals.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Slot />
        <BottomNav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
