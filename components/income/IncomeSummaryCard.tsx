// components/income/IncomeSummaryCard.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  totalIncome: number;
  monthlyIncome: number;
  transactionCount: number;
  averageIncome: number;
};

export default function IncomeSummaryCard({
  totalIncome,
  monthlyIncome,
  transactionCount,
  averageIncome,
}: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <View
      style={{
        backgroundColor: isDark ? "#041225" : "#ffffff",
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        borderWidth: isDark ? 0 : 1,
        borderColor: isDark ? "transparent" : "#e5e7eb",
        shadowColor: isDark ? colors.accent : "#000",
        shadowOpacity: isDark ? 0.25 : 0.08,
        shadowRadius: 16,
        elevation: 6,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: colors.muted,
          fontSize: 14,
          marginBottom: 8,
          fontWeight: "600",
        }}
      >
        Total Income
      </Text>

      <Text
        style={{
          color: "#34C759",
          fontSize: 42,
          fontWeight: "800",
          marginBottom: 4,
        }}
      >
        ${totalIncome.toLocaleString()}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <MaterialCommunityIcons
          name="trending-up"
          size={16}
          color={colors.muted}
        />
        <Text
          style={{
            color: colors.muted,
            fontSize: 13,
            marginLeft: 4,
          }}
        >
          {transactionCount} {transactionCount === 1 ? "transaction" : "transactions"}
        </Text>
      </View>
    </View>
  );
}
