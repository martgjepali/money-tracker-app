import { useAppTheme } from "@/app/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function GoalsEmptyState() {
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
          backgroundColor: isDark ? "#1e3a5f20" : colors.accent + "15",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <MaterialCommunityIcons
          name="target"
          size={56}
          color={isDark ? "#1e3a5f" : colors.accent + "60"}
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
        No Goals Yet
      </Text>

      <Text
        style={{
          color: colors.muted,
          fontSize: 15,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        Start setting your financial goals.{"\n"}
        Track your progress and achieve your dreams!
      </Text>
    </View>
  );
}
