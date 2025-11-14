import { Colors } from '@/theme/colors';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

// Reuse the shape from theme/colors.ts so all tokens are available to consumers
type ThemeColors = typeof Colors.light;

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<Theme>(colorScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Use centralized Colors object so components can rely on the same tokens
  const LIGHT: ThemeColors = Colors.light as any;
  const DARK: ThemeColors = Colors.dark as any;

  const colors: ThemeColors = theme === 'dark' ? DARK : LIGHT;

  const value = useMemo(() => ({ theme, toggleTheme, colors }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}

// Backwards-compatible alias (some files may still import `useTheme`)
export const useTheme = useAppTheme;

// Default export to satisfy expo-router route requirement when file lives under `app/`
export default ThemeProvider;
