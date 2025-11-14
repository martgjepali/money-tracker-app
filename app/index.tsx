import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from './providers/AuthProvider';
import { useAppTheme } from './providers/ThemeProvider';

export default function AuthScreen() {
  const { theme, colors, toggleTheme } = useAppTheme();
  const { signIn, signUp } = useAuth();
  const isDark = theme === 'dark';

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      if (password.length < 4) {
        Alert.alert('Error', 'Password must be at least 4 characters');
        return;
      }
    }

    setLoading(true);

    try {
      let success = false;
      
      if (isSignUp) {
        success = await signUp(email.trim(), password, name.trim());
      } else {
        success = await signIn(email.trim(), password);
      }

      if (success) {
        router.replace('/dashboard');
      } else {
        Alert.alert(
          'Authentication Failed',
          isSignUp 
            ? 'Failed to create account. Please try again.' 
            : 'Invalid email or password. Use test@gmail.com / test'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      /* ignore */
    }
    setIsSignUp(!isSignUp);
    // Clear form
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleToggleTheme = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      /* ignore */
    }
    toggleTheme();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Theme Toggle */}
      <TouchableOpacity
        onPress={handleToggleTheme}
        style={{
          position: 'absolute',
          top: 60,
          right: 20,
          zIndex: 100,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.card,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.primary,
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <MaterialCommunityIcons
          name={isDark ? 'weather-sunny' : 'weather-night'}
          size={24}
          color={colors.icon}
        />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 50 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                backgroundColor: `${colors.primary}20`,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <MaterialCommunityIcons
                name="wallet"
                size={40}
                color={colors.primary}
              />
            </View>
            <Text
              style={{
                color: colors.text,
                fontSize: 32,
                fontWeight: '800',
                textAlign: 'center',
              }}
            >
              Money Tracker
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: '600',
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </Text>
          </View>

          {/* Form */}
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 20,
              padding: 24,
              shadowColor: colors.primary,
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            {isSignUp && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 8,
                  }}
                >
                  Full Name
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    fontSize: 16,
                    color: colors.text,
                    borderWidth: 1,
                    borderColor: colors.surface,
                  }}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                Email Address
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  fontSize: 16,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.surface,
                }}
                placeholder="Enter your email"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={{ marginBottom: isSignUp ? 20 : 0 }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                Password
              </Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    paddingRight: 50,
                    fontSize: 16,
                    color: colors.text,
                    borderWidth: 1,
                    borderColor: colors.surface,
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    padding: 4,
                  }}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {isSignUp && (
              <View style={{ marginBottom: 0 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 8,
                  }}
                >
                  Confirm Password
                </Text>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      paddingRight: 50,
                      fontSize: 16,
                      color: colors.text,
                      borderWidth: 1,
                      borderColor: colors.surface,
                    }}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.muted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: 16,
                      top: 16,
                      padding: 4,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.muted}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleAuth}
              disabled={loading}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: 18,
                alignItems: 'center',
                marginTop: 32,
                opacity: loading ? 0.7 : 1,
                shadowColor: colors.primary,
                shadowOpacity: 0.18,
                shadowRadius: 18,
                elevation: 10,
              }}
            >
              <Text
                style={{
                  color: loading ? '#FFFFFF' : isDark ? colors.surface : '#FFFFFF',
                  fontSize: 17,
                  fontWeight: '800',
                }}
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Switch Auth Mode */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 32,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
              }}
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode} style={{ marginLeft: 8 }}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Test Credentials Hint */}
          {!isSignUp && (
            <View
              style={{
                backgroundColor: `${colors.primary}10`,
                borderRadius: 12,
                padding: 16,
                marginTop: 24,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 14,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                Test Credentials
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 14,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                Email: test@gmail.com{'\n'}Password: test
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
