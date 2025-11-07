// components/savings/SavingCard.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import type { Saving } from "@/types/saving";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

type Props = {
  saving: Saving;
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function SavingCard({ saving, onPress, onLongPress }: Props) {
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

  const iconColor = saving.color || "#FFD60A";
  const date = new Date(saving.date);
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
            name={saving.icon as any || "piggy-bank"}
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
                color: colors.muted,
                fontSize: 13,
                flex: 1,
              }}
              numberOfLines={1}
            >
              {saving.description}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.muted,
                fontSize: 11,
              }}
            >
              {formattedDate}
            </Text>
            <Text
              style={{
                color: iconColor,
                fontSize: 20,
                fontWeight: "800",
              }}
            >
              ${saving.amount.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </RectButton>
  );
}
