import { useAppTheme } from "@/app/providers/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import type { Subscription } from "@/types/subscription";
import { getFrequencyText, getSubscriptionType } from "@/types/subscription";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

type Props = {
  subscription: Subscription;
  onPress?: () => void;
  onLongPress?: () => void;
  onToggleActive?: (subscriptionId: string, isActive: boolean) => void;
};

export default function SubscriptionCard({ subscription, onPress, onLongPress, onToggleActive }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  
  // Local state for switch to handle optimistic updates
  const [isActive, setIsActive] = useState(subscription.isActive);
  
  // Sync with prop changes
  useEffect(() => {
    setIsActive(subscription.isActive);
  }, [subscription.isActive]);

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

  const handleToggleActive = async (newValue: boolean) => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    
    // Optimistic update
    setIsActive(newValue);
    
    // Call parent handler
    onToggleActive?.(subscription.id, newValue);
  };

  // Get subscription type info for enhanced display
  const subscriptionType = getSubscriptionType(subscription.icon) || {
    id: subscription.icon,
    label: subscription.name,
    icon: subscription.icon,
    color: subscription.color || colors.accent,
    category: "other" as const,
  };

  // Calculate days until next billing
  const today = new Date();
  const nextBilling = new Date(subscription.nextBillingDate);
  const daysUntilBilling = Math.ceil((nextBilling.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Determine status color and text
  const getStatusInfo = () => {
    if (!isActive) {
      return { color: "#9CA3AF", text: "Inactive", icon: "pause-circle" as const };
    }
    
    if (daysUntilBilling <= 0) {
      return { color: "#EF4444", text: "Due now", icon: "alert-circle" as const };
    } else if (daysUntilBilling <= 3) {
      return { color: "#F59E0B", text: `Due in ${daysUntilBilling}d`, icon: "clock-alert" as const };
    } else if (daysUntilBilling <= 7) {
      return { color: "#3B82F6", text: `Due in ${daysUntilBilling}d`, icon: "clock" as const };
    } else {
      return { color: "#10B981", text: `Due in ${daysUntilBilling}d`, icon: "check-circle" as const };
    }
  };

  const statusInfo = getStatusInfo();
  const frequencyText = getFrequencyText(subscription.frequency);

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
        opacity: isActive ? 1 : 0.7,
      }}
    >
      {/* Header Row */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: subscriptionType.color + "20",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <MaterialCommunityIcons
            name={subscriptionType.icon as any}
            size={24}
            color={subscriptionType.color}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700", marginBottom: 2 }}>
            {subscription.name}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 13 }} numberOfLines={1}>
            {subscription.description}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: subscriptionType.color, fontSize: 18, fontWeight: "800" }}>
            ${subscription.amount.toFixed(2)}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>
            {frequencyText}
          </Text>
        </View>
      </View>

      {/* Status and Control Row */}
      <View
        style={{
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: isDark ? "#1e3a5f" : "#e5e7eb",
        }}
      >
        {/* Top section: Status and Next billing */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name={statusInfo.icon}
              size={14}
              color={statusInfo.color}
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: statusInfo.color, fontSize: 13, fontWeight: "600" }}>
              {statusInfo.text}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="calendar"
              size={14}
              color={colors.muted}
              style={{ marginRight: 4 }}
            />
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              Next: {nextBilling.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Bottom section: Active toggle */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: colors.muted, fontSize: 13, fontWeight: "500" }}>
            Active Subscription
          </Text>
          
          <Switch
            value={isActive}
            onValueChange={handleToggleActive}
            trackColor={{ 
              false: isDark ? "#374151" : "#D1D5DB", 
              true: subscriptionType.color + "60" 
            }}
            thumbColor={isActive ? subscriptionType.color : "#F3F4F6"}
          />
        </View>
      </View>
    </RectButton>
  );
}