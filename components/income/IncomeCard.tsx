// components/income/IncomeCard.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import type { Income } from "@/types/income";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

type Props = {
  income: Income;
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function IncomeCard({ income, onPress, onLongPress }: Props) {
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

  const iconColor = income.color || colors.primary;
  const date = new Date(income.date);
  const formattedDate = date.toLocaleDateString("en-US", {
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
        marginBottom: 12,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          backgroundColor: isDark ? "#041225" : "#ffffff",
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          borderWidth: isDark ? 0 : 1,
          borderColor: isDark ? "transparent" : "#e5e7eb",
          shadowColor: isDark ? colors.accent : "#000",
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: `${iconColor}15`,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 14,
          }}
        >
          <MaterialCommunityIcons
            name={income.icon as any || "cash"}
            size={28}
            color={iconColor}
          />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "700",
                flex: 1,
              }}
              numberOfLines={1}
            >
              {income.type}
            </Text>
            <Text
              style={{
                color: iconColor,
                fontSize: 18,
                fontWeight: "800",
                marginLeft: 8,
              }}
            >
              +${income.amount.toLocaleString()}
            </Text>
          </View>

          <Text
            style={{
              color: colors.muted,
              fontSize: 13,
              marginBottom: 2,
            }}
            numberOfLines={1}
          >
            {income.description}
          </Text>

          <Text
            style={{
              color: colors.muted,
              fontSize: 11,
            }}
          >
            {formattedDate}
          </Text>
        </View>
      </View>
    </RectButton>
  );
}
