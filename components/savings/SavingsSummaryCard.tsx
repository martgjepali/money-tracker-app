// components/savings/SavingsSummaryCard.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  totalSavings: number;
  transactionCount: number;
  savingsGoal?: number; // Optional goal to show progress
};

export default function SavingsSummaryCard({
  totalSavings,
  transactionCount,
  savingsGoal,
}: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  const progressPercentage = savingsGoal ? Math.min((totalSavings / savingsGoal) * 100, 100) : 0;

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
        Total Savings
      </Text>

      <Text
        style={{
          color: "#FFD60A",
          fontSize: 42,
          fontWeight: "800",
          marginBottom: 4,
        }}
      >
        ${totalSavings.toLocaleString()}
      </Text>

      {savingsGoal && savingsGoal > 0 && (
        <View style={{ width: "100%", marginTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              Goal Progress
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700" }}>
              {progressPercentage.toFixed(0)}%
            </Text>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: isDark ? "#0a1830" : "#f8fbff",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${progressPercentage}%`,
                height: "100%",
                backgroundColor: "#FFD60A",
                borderRadius: 4,
                shadowColor: "#FFD60A",
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 2,
              }}
            />
          </View>
          <Text
            style={{
              color: colors.muted,
              fontSize: 11,
              marginTop: 6,
              textAlign: "center",
            }}
          >
            Goal: ${savingsGoal.toLocaleString()}
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <MaterialCommunityIcons
          name="piggy-bank"
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
          {transactionCount} {transactionCount === 1 ? "deposit" : "deposits"}
        </Text>
      </View>
    </View>
  );
}
