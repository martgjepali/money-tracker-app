import { useAppTheme } from "@/app/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  totalMonthlySpend: number;
  totalYearlySpend: number;
  activeSubscriptions: number;
  dueSoonCount: number;
};

export default function SubscriptionSummaryCard({
  totalMonthlySpend,
  totalYearlySpend,
  activeSubscriptions,
  dueSoonCount,
}: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  const glass = isDark ? "#0b162b" : "#ffffff";
  const border = isDark ? "rgba(125, 211, 252, 0.25)" : "rgba(7, 48, 74, 0.15)";

  return (
    <View
      style={{
        backgroundColor: glass,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: border,
        shadowColor: colors.accent,
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 5,
      }}
    >
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
          <MaterialCommunityIcons
            name="calendar-sync"
            size={24}
            color={colors.accent}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>
            Subscription Overview
          </Text>
        </View>
        <Text style={{ color: colors.muted, fontSize: 13 }}>
          Track your recurring payments
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {/* Monthly Spend */}
        <View
          style={{
            flex: 1,
            minWidth: "45%",
            backgroundColor: isDark ? "#0a1830" : "#f8fbff",
            borderRadius: 16,
            padding: 16,
            borderWidth: isDark ? 0 : 1,
            borderColor: isDark ? "transparent" : "#e9eef7",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <MaterialCommunityIcons
              name="calendar-month"
              size={20}
              color="#3B82F6"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "600" }}>
              MONTHLY
            </Text>
          </View>
          <Text style={{ color: "#3B82F6", fontSize: 24, fontWeight: "800" }}>
            ${totalMonthlySpend.toFixed(2)}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
            per month
          </Text>
        </View>

        {/* Yearly Spend */}
        <View
          style={{
            flex: 1,
            minWidth: "45%",
            backgroundColor: isDark ? "#0a1830" : "#f8fbff",
            borderRadius: 16,
            padding: 16,
            borderWidth: isDark ? 0 : 1,
            borderColor: isDark ? "transparent" : "#e9eef7",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color="#10B981"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "600" }}>
              YEARLY
            </Text>
          </View>
          <Text style={{ color: "#10B981", fontSize: 24, fontWeight: "800" }}>
            ${totalYearlySpend.toFixed(2)}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
            per year
          </Text>
        </View>

        {/* Active Subscriptions */}
        <View
          style={{
            flex: 1,
            minWidth: "45%",
            backgroundColor: isDark ? "#0a1830" : "#f8fbff",
            borderRadius: 16,
            padding: 16,
            borderWidth: isDark ? 0 : 1,
            borderColor: isDark ? "transparent" : "#e9eef7",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color="#8B5CF6"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "600" }}>
              ACTIVE
            </Text>
          </View>
          <Text style={{ color: "#8B5CF6", fontSize: 24, fontWeight: "800" }}>
            {activeSubscriptions}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
            subscriptions
          </Text>
        </View>

        {/* Due Soon */}
        <View
          style={{
            flex: 1,
            minWidth: "45%",
            backgroundColor: isDark ? "#0a1830" : "#f8fbff",
            borderRadius: 16,
            padding: 16,
            borderWidth: isDark ? 0 : 1,
            borderColor: isDark ? "transparent" : "#e9eef7",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <MaterialCommunityIcons
              name={dueSoonCount > 0 ? "clock-alert" : "clock-check"}
              size={20}
              color={dueSoonCount > 0 ? "#F59E0B" : "#6B7280"}
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "600" }}>
              DUE SOON
            </Text>
          </View>
          <Text 
            style={{ 
              color: dueSoonCount > 0 ? "#F59E0B" : "#6B7280", 
              fontSize: 24, 
              fontWeight: "800" 
            }}
          >
            {dueSoonCount}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
            in 7 days
          </Text>
        </View>
      </View>

      {/* Quick Insight */}
      {totalMonthlySpend > 0 && (
        <View
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: isDark ? "#1e3a5f" : "#e5e7eb",
          }}
        >
          <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center" }}>
            💡 You spend{" "}
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              ${(totalMonthlySpend / 30).toFixed(2)}
            </Text>{" "}
            per day on subscriptions
          </Text>
        </View>
      )}
    </View>
  );
}