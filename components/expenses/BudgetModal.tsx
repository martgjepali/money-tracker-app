import { useAppTheme } from "@/app/providers/ThemeProvider";
import KeyboardAccessory from "@/components/ui/KeyboardAccessory";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
  currentBudget?: number;
  onSave: (budget: number | undefined) => void;
}

export function BudgetModal({ visible, onClose, currentBudget, onSave }: BudgetModalProps) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const [budget, setBudget] = useState(currentBudget?.toString() || "");
  const [scale] = useState(new Animated.Value(0.9));
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      setBudget(currentBudget?.toString() || "");
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.9);
      opacity.setValue(0);
    }
  }, [visible, currentBudget]);

  const handleSave = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }

    const budgetValue = budget.trim() ? parseFloat(budget) : undefined;
    onSave(budgetValue);
    onClose();
  };

  const handleDelete = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (e) {
      /* ignore */
    }

    onSave(undefined);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={{ flex: 1, justifyContent: "center" }}
        >
          <Animated.View
            style={[
              {
                margin: 16,
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: isDark ? "transparent" : "#e5e7eb",
                shadowColor: "#EF4444",
                shadowOpacity: 0.3,
                shadowRadius: 24,
                elevation: 10,
                maxHeight: "90%",
                transform: [{ scale }],
                opacity,
              },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" bounces={true}>
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="chart-donut"
                  size={24}
                  color="#EF4444"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
                  {currentBudget ? "Edit Budget" : "Set Budget"}
                </Text>
              </View>
              <Text style={{ color: colors.muted, marginBottom: 20, fontSize: 13 }}>
                Set a monthly spending limit to track your expenses 📊
              </Text>

              {/* Budget Input */}
              <View
                style={{
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: isDark ? "transparent" : "#e9eef7",
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 13,
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  Monthly Budget
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: colors.text, fontSize: 28, fontWeight: "800", marginRight: 8 }}>
                    $
                  </Text>
                  <TextInput
                    placeholder="0.00"
                    placeholderTextColor={colors.muted}
                    value={budget}
                    onChangeText={setBudget}
                    keyboardType="decimal-pad"
                    inputAccessoryViewID="budgetKeyboard"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    style={{
                      flex: 1,
                      color: colors.text,
                      fontSize: 28,
                      fontWeight: "800",
                      padding: 0,
                    }}
                  />
                </View>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>
                  Leave empty to remove budget tracking
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable
                  onPress={onClose}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: "center",
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: isDark ? "#1e3a5f" : "#e5e7eb",
                  }}
                >
                  <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>Cancel</Text>
                </Pressable>

                {currentBudget && (
                  <Pressable
                    onPress={handleDelete}
                    style={{
                      flex: 1,
                      paddingVertical: 16,
                      borderRadius: 16,
                      alignItems: "center",
                      backgroundColor: "#EF4444",
                      shadowColor: "#EF4444",
                      shadowOpacity: 0.3,
                      shadowRadius: 14,
                      elevation: 6,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Delete</Text>
                  </Pressable>
                )}

                <Pressable
                  onPress={handleSave}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: "center",
                    backgroundColor: "#10B981",
                    shadowColor: "#10B981",
                    shadowOpacity: 0.3,
                    shadowRadius: 14,
                    elevation: 6,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Save</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
      <KeyboardAccessory nativeID="budgetKeyboard" />
    </Modal>
  );
}
