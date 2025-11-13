import React, { createContext, ReactNode, useContext, useState } from 'react';

type User = {
  email: string;
  name?: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name?: string) => Promise<boolean>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Test credentials
    if (email === 'test@gmail.com' && password === 'test') {
      setUser({ email, name: 'Test User' });
      return true;
    }
    return false;
  };

  const signUp = async (email: string, password: string, name?: string): Promise<boolean> => {
    // For now, just simulate sign up success
    setUser({ email, name: name || 'New User' });
    return true;
  };

  const signOut = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}