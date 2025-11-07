// components/ui/KeyboardAccessory.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { InputAccessoryView, Keyboard, Platform, Pressable, Text, View } from "react-native";

type Props = {
  nativeID: string;
};

export default function KeyboardAccessory({ nativeID }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // For Android, show a floating button when keyboard is visible
  if (Platform.OS === "android") {
    if (!keyboardVisible) return null;
    
    return (
      <View
        style={{
          position: "absolute",
          top: 10,
          right: 16,
          zIndex: 9999,
        }}
      >
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: colors.accent,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <MaterialCommunityIcons name="keyboard-close" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Done</Text>
        </Pressable>
      </View>
    );
  }

  // For iOS, use InputAccessoryView
  return (
    <InputAccessoryView nativeID={nativeID}>
      <View
        style={{
          backgroundColor: isDark ? "#1a1a1a" : "#f0f0f0",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderTopWidth: 1,
          borderTopColor: isDark ? "#333" : "#d0d0d0",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            backgroundColor: colors.accent,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="keyboard-close" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Done</Text>
        </Pressable>
      </View>
    </InputAccessoryView>
  );
}
