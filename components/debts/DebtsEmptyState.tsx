import { useAppTheme } from "@/app/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function DebtsEmptyState() {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        paddingBottom: 100,
      }}
    >
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: isDark ? "#1e3a5f20" : "#EF444415",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={56}
          color={isDark ? "#1e3a5f" : "#EF444460"}
        />
      </View>

      <Text
        style={{
          color: colors.text,
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        No Debts
      </Text>

      <Text
        style={{
          color: colors.muted,
          fontSize: 15,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        You're debt-free! 🎉{"\n"}
        Track and manage any debts you have here.
      </Text>
    </View>
  );
}
