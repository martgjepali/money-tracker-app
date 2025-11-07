import { useAppTheme } from "@/app/providers/ThemeProvider";
import type { Debt } from "@/types/debt";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

type Props = {
  debt: Debt;
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function DebtCard({ debt, onPress, onLongPress }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  const handlePress = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    onPress?.();
  };

  const handleLongPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }
    onLongPress?.();
  };

  const progress = (debt.paidAmount / debt.amount) * 100;
  const remaining = debt.amount - debt.paidAmount;
  const isPaid = debt.status === "paid";
  const isOverdue = debt.status === "overdue";

  const statusColor = isPaid ? "#10B981" : isOverdue ? "#EF4444" : "#F59E0B";
  const statusText = isPaid ? "Paid" : isOverdue ? "Overdue" : "Active";

  const formattedDate = new Date(debt.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <RectButton
      onPress={handlePress}
      onLongPress={handleLongPress}
      rippleColor={isDark ? "#0b1220" : "#e6f6ff"}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: isDark ? "transparent" : "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: statusColor + "20",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <MaterialCommunityIcons
            name={isPaid ? "check-circle" : "credit-card-outline"}
            size={24}
            color={statusColor}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700", marginRight: 8 }}>
              {debt.name}
            </Text>
            {debt.isRecurring && (
              <View
                style={{
                  backgroundColor: colors.accent + "20",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "600" }}>
                  RECURRING
                </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: colors.muted, fontSize: 13, marginRight: 8 }}>
              {formattedDate}
            </Text>
            <View
              style={{
                backgroundColor: statusColor + "20",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: statusColor, fontSize: 11, fontWeight: "600" }}>
                {statusText}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: statusColor, fontSize: 18, fontWeight: "800" }}>
            ${remaining.toLocaleString()}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>
            of ${debt.amount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={{
          height: 8,
          backgroundColor: isDark ? "#1e3a5f" : "#e2e8f0",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: statusColor,
          }}
        />
      </View>

      {/* Additional Info */}
      {(debt.interestRate || debt.minimumPayment) && (
        <View
          style={{
            flexDirection: "row",
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: isDark ? "#1e3a5f" : "#e5e7eb",
          }}
        >
          {debt.interestRate && (
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 2 }}>
                Interest Rate
              </Text>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600" }}>
                {debt.interestRate}%
              </Text>
            </View>
          )}
          {debt.minimumPayment && (
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 2 }}>
                Min. Payment
              </Text>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600" }}>
                ${debt.minimumPayment.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      )}
    </RectButton>
  );
}
