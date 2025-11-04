import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

type ThemeColors = {
  background: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  card: string;
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
};

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

  // Stocks-like palette (hex approximations of the provided variables / iOS colors)
  const LIGHT = {
    background: '#F7FBFF', // light canvas
    surface: '#FFFFFF',
    primary: '#007AFF', // iOS blue (Stocks accent)
    accent: '#0EA5E9',
    text: '#07304A',
    muted: '#4B6B7D',
    card: '#FFFFFF',
    chart1: '#34C759',
    chart2: '#007AFF',
    chart3: '#FF3B30',
    chart4: '#FF9500',
    chart5: '#AF52DE',
  } as any;

  const DARK = {
    background: '#05060A', // deep dark like Stocks
    surface: '#0B1220',
    primary: '#9BE7FF', // softer cyan-blue in dark
    accent: '#2EE6FF',
    text: '#CDEEFF',
    muted: '#7FBADF',
    card: '#0C1420',
    chart1: '#34C759',
    chart2: '#007AFF',
    chart3: '#FF3B30',
    chart4: '#FF9500',
    chart5: '#AF52DE',
  } as any;

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
