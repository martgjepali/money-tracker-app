import { useAppTheme } from "@/app/providers/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import type { Debt } from "@/types/debt";
import { DEBT_TYPES } from "@/types/debt";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

type Props = {
  debt: Debt;
  onPress?: () => void;
  onLongPress?: () => void;
  onAutoPayToggle?: (debtId: string, enabled: boolean) => void;
};

export default function DebtCard({ debt, onPress, onLongPress, onAutoPayToggle }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  
  // Local state for auto-pay toggle
  const [autoPayEnabled, setAutoPayEnabled] = useState(debt.autoPayEnabled || false);
  
  // Sync with prop changes
  useEffect(() => {
    setAutoPayEnabled(debt.autoPayEnabled || false);
  }, [debt.autoPayEnabled]);

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

  const handleAutoPayToggle = async (enabled: boolean) => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    
    // Update local state immediately for smooth animation
    setAutoPayEnabled(enabled);
    
    // Notify parent component
    onAutoPayToggle?.(debt.id, enabled);
  };

  const progress = (debt.paidAmount / debt.amount) * 100;
  const remaining = debt.amount - debt.paidAmount;
  const isPaid = debt.status === "paid";
  const isOverdue = debt.status === "overdue";

  const statusColor = isPaid ? "#10B981" : isOverdue ? "#EF4444" : "#F59E0B";
  const statusText = isPaid ? "Paid" : isOverdue ? "Overdue" : "Active";

  // Get debt type info for icon and color
  let debtType = DEBT_TYPES.find(type => type.id === debt.type);
  
  // Fallback: If no type field, try to infer from debt name
  if (!debtType && debt.name) {
    const debtNameLower = debt.name.toLowerCase();
    debtType = DEBT_TYPES.find(type => 
      debtNameLower.includes(type.label.toLowerCase()) ||
      (type.id === 'credit-card' && debtNameLower.includes('credit')) ||
      (type.id === 'student-loan' && (debtNameLower.includes('student') || debtNameLower.includes('education'))) ||
      (type.id === 'mortgage' && (debtNameLower.includes('mortgage') || debtNameLower.includes('home') || debtNameLower.includes('house'))) ||
      (type.id === 'auto-loan' && (debtNameLower.includes('auto') || debtNameLower.includes('car') || debtNameLower.includes('vehicle'))) ||
      (type.id === 'personal-loan' && debtNameLower.includes('personal')) ||
      (type.id === 'business-loan' && debtNameLower.includes('business')) ||
      (type.id === 'medical' && (debtNameLower.includes('medical') || debtNameLower.includes('hospital') || debtNameLower.includes('doctor')))
    );
  }
  
  const debtIcon = debtType?.icon || debt.icon || "credit-card-outline";
  const debtColor = debtType?.color || debt.color || "#EF4444";

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
      <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 16 }}>
        {/* Left Column - Icon and Badges */}
        <View style={{ marginRight: 12, alignItems: "center" }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: debtColor + "20",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <MaterialCommunityIcons
              name={isPaid ? "check-circle" : (debtIcon as any)}
              size={24}
              color={isPaid ? "#10B981" : debtColor}
            />
          </View>
          
          {/* Badges below icon */}
          <View style={{ alignItems: "center", gap: 4 }}>
            {debt.isRecurring && (
              <View
                style={{
                  backgroundColor: colors.accent + "20",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: colors.accent, fontSize: 9, fontWeight: "600" }}>
                  RECURRING
                </Text>
              </View>
            )}
            <View
              style={{
                backgroundColor: statusColor + "20",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: statusColor, fontSize: 9, fontWeight: "600" }}>
                {statusText}
              </Text>
            </View>
          </View>
        </View>

        {/* Middle Column - Debt Info */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700", marginBottom: 4 }}>
            {debt.name || debtType?.label || "Debt"}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 13 }}>
            {formattedDate}
          </Text>
        </View>

        {/* Right Column - Amount */}
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: isPaid ? statusColor : debtColor, fontSize: 18, fontWeight: "800" }}>
            ${remaining.toLocaleString()}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>
            remaining of ${debt.amount.toLocaleString()}
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
          marginTop: 4,
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: isPaid ? statusColor : debtColor,
          }}
        />
      </View>

      {/* Additional Info */}
      {(debt.interestRate || debt.minimumPayment || (debt.isRecurring && !isPaid)) && (
        <View
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTopWidth: 1,
            borderTopColor: isDark ? "#1e3a5f" : "#e5e7eb",
          }}
        >
          {/* Financial Info Row */}
          {(debt.interestRate || debt.minimumPayment) && (
            <View
              style={{
                flexDirection: "row",
                gap: 16,
                marginBottom: debt.isRecurring && !isPaid ? 12 : 0,
              }}
            >
              {debt.interestRate && (
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 4 }}>
                    APR
                  </Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600" }}>
                    {debt.interestRate}%
                  </Text>
                </View>
              )}
              {debt.minimumPayment && (
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 4 }}>
                    Monthly Payment
                  </Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600" }}>
                    ${debt.minimumPayment.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Auto-Pay Switch for Recurring Debts */}
          {debt.isRecurring && !isPaid && (
            <View style={{ paddingVertical: 4 }}>
              <Switch
                label={`Auto-pay ${debt.recurringFrequency || 'monthly'}`}
                value={autoPayEnabled}
                onValueChange={(enabled) => handleAutoPayToggle(enabled)}
                labelStyle={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: colors.text,
                }}
              />
              <Text style={{ 
                color: colors.muted, 
                fontSize: 11, 
                marginTop: 2,
                marginLeft: 0 
              }}>
                {autoPayEnabled 
                  ? `Automatic payments enabled • Next: ${debt.recurringFrequency || 'monthly'}`
                  : 'Enable automatic payments and notifications'
                }
              </Text>
            </View>
          )}
        </View>
      )}
    </RectButton>
  );
}
