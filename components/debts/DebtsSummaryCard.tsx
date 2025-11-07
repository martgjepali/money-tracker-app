import { useAppTheme } from "@/app/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  totalDebts: number;
  activeDebts: number;
  totalAmount: number;
  totalPaid: number;
};

export default function DebtsSummaryCard({
  totalDebts,
  activeDebts,
  totalAmount,
  totalPaid,
}: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  const remaining = totalAmount - totalPaid;
  const paymentProgress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: isDark ? "transparent" : "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.1,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <LinearGradient
          colors={["#EF4444", "#DC2626"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <MaterialCommunityIcons name="credit-card-outline" size={28} color="#fff" />
        </LinearGradient>

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 4 }}>
            Total Remaining
          </Text>
          <Text style={{ color: colors.text, fontSize: 32, fontWeight: "800" }}>
            ${remaining.toLocaleString()}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 14, marginTop: 2 }}>
            of ${totalAmount.toLocaleString()} total debt
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: isDark ? "#1e3a5f" : "#e5e7eb",
          marginBottom: 16,
        }}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 6 }}>
            Total Debts
          </Text>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: "700" }}>
            {totalDebts}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 6 }}>
            Active
          </Text>
          <Text style={{ color: "#F59E0B", fontSize: 24, fontWeight: "700" }}>
            {activeDebts}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 6 }}>
            Paid Off
          </Text>
          <Text style={{ color: "#10B981", fontSize: 24, fontWeight: "700" }}>
            {paymentProgress.toFixed(0)}%
          </Text>
        </View>
      </View>
    </View>
  );
}
