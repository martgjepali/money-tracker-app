// components/income/AddIncomeModal.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import IconSelector from "@/components/income/IconSelector";
import { Text } from "@/components/ui/text";
import { INCOME_TYPES, type CreateIncomeInput } from "@/types/income";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (income: CreateIncomeInput) => void;
};

export default function AddIncomeModal({ visible, onClose, onConfirm }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const glass = isDark ? "#0b162b" : "#ffffff";
  const border = isDark ? "rgba(125, 211, 252, 0.25)" : "rgba(7, 48, 74, 0.15)";
  const glow = colors.accent;

  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [savingsAmount, setSavingsAmount] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("salary");
  const [selectedIcon, setSelectedIcon] = useState<string>("briefcase");
  const [selectedColor, setSelectedColor] = useState<string>("#34C759");

  // animations
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.92);
    }
  }, [visible]);

  const handleSelectType = (typeId: string, icon: string, color: string) => {
    setSelectedType(typeId);
    setSelectedIcon(icon);
    setSelectedColor(color);
  };

  const handleConfirm = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    const numSavings = savingsAmount ? parseFloat(savingsAmount) : 0;
    if (numSavings > numAmount) {
      // Can't save more than earned
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }

    const typeLabel = INCOME_TYPES.find((t) => t.id === selectedType)?.label || selectedType;

    onConfirm({
      amount: numAmount,
      type: typeLabel,
      date: new Date().toISOString(),
      description: description.trim() || `${typeLabel} income`,
      icon: selectedIcon,
      color: selectedColor,
      savingsAmount: numSavings > 0 ? numSavings : undefined,
    });

    // Reset form
    setAmount("");
    setDescription("");
    setSavingsAmount("");
    setSelectedType("salary");
    setSelectedIcon("briefcase");
    setSelectedColor("#34C759");
  };

  const handleClose = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    onClose();
  };

  const confirmDisabled = !amount || parseFloat(amount) <= 0;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        {/* Backdrop */}
        <Pressable
          onPress={handleClose}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />

        {/* Card */}
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: 16,
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: glass,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: border,
              shadowColor: glow,
              shadowOpacity: 0.3,
              shadowRadius: 24,
              elevation: 10,
              maxHeight: "90%",
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="cash-plus"
                  size={24}
                  color={colors.primary}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
                  Add Income
                </Text>
              </View>
              <Text style={{ color: colors.muted, marginBottom: 20, fontSize: 13 }}>
                Track your earnings and grow your wealth 💰
              </Text>

              {/* Icon Selector */}
              <View style={{ marginBottom: 20 }}>
                <IconSelector selectedType={selectedType} onSelectType={handleSelectType} />
              </View>

              {/* Amount Input */}
              <View
                style={{
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: isDark ? "#0a1830" : "#f8fbff",
                  borderWidth: isDark ? 0 : 1,
                  borderColor: isDark ? "transparent" : "#e9eef7",
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: colors.muted, marginBottom: 8, fontSize: 13 }}>
                  Amount
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: selectedColor,
                      fontSize: 28,
                      fontWeight: "800",
                      marginRight: 8,
                    }}
                  >
                    $
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ""))}
                    placeholder="0.00"
                    placeholderTextColor={colors.muted}
                    style={{
                      flex: 1,
                      color: colors.text,
                      fontSize: 28,
                      fontWeight: "800",
                      paddingVertical: 4,
                    }}
                  />
                </View>
              </View>

              {/* Description Input (Optional) */}
              <View
                style={{
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: isDark ? "#0a1830" : "#f8fbff",
                  borderWidth: isDark ? 0 : 1,
                  borderColor: isDark ? "transparent" : "#e9eef7",
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: colors.muted, marginBottom: 8, fontSize: 13 }}>
                  Description (Optional)
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="e.g., Monthly salary, Freelance project..."
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={2}
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "600",
                    minHeight: 50,
                  }}
                />
              </View>

              {/* Savings Amount Input (Optional) */}
              <View
                style={{
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: isDark ? "#0a1830" : "#f8fbff",
                  borderWidth: isDark ? 0 : 1,
                  borderColor: isDark ? "transparent" : "#e9eef7",
                  marginBottom: 20,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text style={{ color: colors.muted, fontSize: 13 }}>
                    Save to Savings (Optional)
                  </Text>
                  <MaterialCommunityIcons
                    name="piggy-bank"
                    size={16}
                    color="#FF9500"
                  />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#FF9500",
                      fontSize: 24,
                      fontWeight: "800",
                      marginRight: 8,
                    }}
                  >
                    $
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={savingsAmount}
                    onChangeText={(t) => setSavingsAmount(t.replace(/[^0-9.]/g, ""))}
                    placeholder="0.00"
                    placeholderTextColor={colors.muted}
                    style={{
                      flex: 1,
                      color: colors.text,
                      fontSize: 24,
                      fontWeight: "800",
                      paddingVertical: 4,
                    }}
                  />
                </View>
                {savingsAmount && parseFloat(savingsAmount) > 0 && (
                  <Text style={{ color: colors.muted, fontSize: 11, marginTop: 6 }}>
                    {parseFloat(savingsAmount) > parseFloat(amount || "0")
                      ? "⚠️ Cannot save more than earned"
                      : `💰 Saving ${((parseFloat(savingsAmount) / parseFloat(amount || "1")) * 100).toFixed(0)}% of income`}
                  </Text>
                )}
              </View>

              {/* Actions */}
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Pressable
                  onPress={handleClose}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: isDark ? "#1f2b44" : "#dbeafe",
                    marginRight: 12,
                    backgroundColor: isDark ? "#0b1220" : "#e8f1ff",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? colors.text : "#0b1220",
                      fontWeight: "800",
                      fontSize: 16,
                    }}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  disabled={confirmDisabled}
                  onPress={handleConfirm}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: "center",
                    backgroundColor: confirmDisabled ? "#94a3b8" : selectedColor,
                    shadowColor: confirmDisabled ? "#94a3b8" : selectedColor,
                    shadowOpacity: confirmDisabled ? 0 : 0.3,
                    shadowRadius: 14,
                    elevation: 6,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                    Add Income
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
