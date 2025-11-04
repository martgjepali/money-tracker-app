import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../app/providers/ThemeProvider';

type NavItem = {
  key: string;
  icon: string;
  route: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', icon: 'view-dashboard-outline', route: '/dashboard' },
  { key: 'income', icon: 'cash-multiple', route: '/income' },
  { key: 'savings', icon: 'piggy-bank-outline', route: '/savings' },
  { key: 'expenses', icon: 'credit-card-clock-outline', route: '/expenses' },
  { key: 'goals', icon: 'target', route: '/goals' },
  { key: 'debts', icon: 'hand-coin', route: '/debts' },
  { key: 'subscriptions', icon: 'calendar-blank', route: '/subscriptions' },
];

export default function BottomNav() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme, colors } = useAppTheme();
  const [active, setActive] = useState<string>('dashboard');

  const isDark = theme === 'dark';
  const bg = colors.background;
  const surface = colors.surface;
  const accent = colors.accent;
  const iconColor = colors.text;

  return (
    <>
      {/* Top-right floating theme toggle */}
      <RectButton
        onPress={() => {
          Haptics.selectionAsync();
          toggleTheme();
        }}
        rippleColor={isDark ? '#02202a' : '#e6f6ff'}
        style={{
          position: 'absolute',
          right: 14,
          top: Math.max(12, insets.top + 6),
          zIndex: 50,
          padding: 8,
          borderRadius: 12,
          backgroundColor: surface,
          shadowColor: isDark ? accent : '#000',
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <MaterialCommunityIcons name={theme === 'dark' ? ('weather-night' as any) : ('white-balance-sunny' as any)} size={20} color={accent} />
      </RectButton>

      <View
        style={{
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: Math.max(12, insets.bottom + 6),
          borderRadius: 999,
          backgroundColor: bg,
          paddingVertical: 10,
          paddingHorizontal: 12,
          shadowColor: isDark ? accent : '#000',
          shadowOpacity: 0.18,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Icons group */}
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-around' }}>
            {NAV_ITEMS.map((item) => {
              const selected = active === item.key;
              return (
                <RectButton
                  key={item.key}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setActive(item.key);
                    router.push(item.route as any);
                  }}
                  rippleColor={isDark ? '#02202a' : '#e6f6ff'}
                  style={{
                    padding: 8,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 44,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: selected ? accent : 'transparent',
                      padding: selected ? 8 : 0,
                      borderRadius: 10,
                      shadowColor: selected ? accent : undefined,
                      shadowOpacity: selected ? 0.6 : 0,
                      shadowRadius: selected ? 8 : 0,
                      elevation: selected ? 8 : 0,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={22}
                      color={selected ? (isDark ? '#001219' : '#001219') : iconColor}
                    />
                  </View>
                </RectButton>
              );
            })}
          </View>
        </View>
      </View>
    </>
  );
}
