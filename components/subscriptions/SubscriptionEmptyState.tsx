import { useAppTheme } from "@/app/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function SubscriptionEmptyState() {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.accent + "20",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <MaterialCommunityIcons
          name="calendar-sync"
          size={40}
          color={colors.accent}
        />
      </View>

      <Text
        style={{
          color: colors.text,
          fontSize: 20,
          fontWeight: "700",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        No Subscriptions Yet
      </Text>

      <Text
        style={{
          color: colors.muted,
          fontSize: 14,
          textAlign: "center",
          lineHeight: 20,
          marginBottom: 4,
        }}
      >
        Keep track of all your recurring payments
      </Text>
      
      <Text
        style={{
          color: colors.muted,
          fontSize: 14,
          textAlign: "center",
          lineHeight: 20,
        }}
      >
        Tap the + button to add your first subscription
      </Text>
    </View>
  );
}