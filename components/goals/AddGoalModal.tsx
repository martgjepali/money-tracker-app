import { useAppTheme } from "@/app/providers/ThemeProvider";
import { DatePicker } from "@/components/ui/date-picker";
import type { CreateGoalInput } from "@/types/goal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    InputAccessoryView,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (goal: CreateGoalInput) => void;
};

export default function AddGoalModal({ visible, onClose, onAdd }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    Keyboard.dismiss();
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setDeadline(undefined);
    onClose();
  };

  const handleAdd = async () => {
    if (!name.trim() || !targetAmount.trim()) {
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }

    const goalData: CreateGoalInput = {
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      deadline: deadline?.toISOString(),
    };

    onAdd(goalData);
    handleClose();
  };

  const modalScale = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const isValid = name.trim() !== "" && targetAmount.trim() !== "";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <Animated.View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 24,
              maxHeight: "90%",
              transform: [{ scale: modalScale }, { translateY: modalTranslateY }],
              borderWidth: 1,
              borderColor: isDark ? "transparent" : "#e5e7eb",
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              bounces={true}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ padding: 24 }}>
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: colors.accent + "20",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <MaterialCommunityIcons name="target" size={24} color={colors.accent} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 22,
                        fontWeight: "700",
                      }}
                    >
                      Add New Goal
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleClose}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: isDark ? "#1e3a5f" : "#f3f4f6",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialCommunityIcons name="close" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Goal Name */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    Goal Name
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Emergency Fund"
                    placeholderTextColor={colors.muted}
                    style={{
                      backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: colors.text,
                      borderWidth: 1,
                      borderColor: isDark ? "transparent" : "#e9eef7",
                    }}
                    inputAccessoryViewID="goalKeyboard"
                  />
                </View>

                {/* Target Amount */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    Target Amount
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: colors.accent,
                        fontSize: 28,
                        fontWeight: "800",
                        marginRight: 12,
                      }}
                    >
                      $
                    </Text>
                    <TextInput
                      value={targetAmount}
                      onChangeText={setTargetAmount}
                      placeholder="0"
                      placeholderTextColor={colors.muted}
                      keyboardType="decimal-pad"
                      style={{
                        flex: 1,
                        backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        color: colors.accent,
                        fontWeight: "600",
                        borderWidth: 1,
                        borderColor: isDark ? "transparent" : "#e9eef7",
                      }}
                      inputAccessoryViewID="goalKeyboard"
                    />
                  </View>
                </View>

                {/* Current Amount */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    Current Amount (Optional)
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: colors.accent,
                        fontSize: 28,
                        fontWeight: "800",
                        marginRight: 12,
                      }}
                    >
                      $
                    </Text>
                    <TextInput
                      value={currentAmount}
                      onChangeText={setCurrentAmount}
                      placeholder="0"
                      placeholderTextColor={colors.muted}
                      keyboardType="decimal-pad"
                      style={{
                        flex: 1,
                        backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        color: colors.accent,
                        fontWeight: "600",
                        borderWidth: 1,
                        borderColor: isDark ? "transparent" : "#e9eef7",
                      }}
                      inputAccessoryViewID="goalKeyboard"
                    />
                  </View>
                </View>

                {/* Deadline */}
                <View style={{ marginBottom: 24 }}>
                  <DatePicker
                    mode="date"
                    value={deadline}
                    onChange={setDeadline}
                    placeholder="Select deadline (Optional)"
                    minimumDate={new Date()}
                    variant="filled"
                    style={{
                      backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                      borderWidth: 1,
                      borderColor: isDark ? "transparent" : "#e9eef7",
                    }}
                  />
                </View>

                {/* Buttons */}
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    onPress={handleClose}
                    style={{
                      flex: 1,
                      backgroundColor: colors.surface,
                      borderRadius: 12,
                      padding: 16,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: isDark ? "#1e3a5f" : "#e5e7eb",
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleAdd}
                    disabled={!isValid}
                    style={{
                      flex: 1,
                      backgroundColor: isValid ? colors.accent : colors.muted,
                      borderRadius: 12,
                      padding: 16,
                      alignItems: "center",
                      shadowColor: isValid ? colors.accent : "transparent",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                    >
                      Add Goal
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>

      {/* iOS Keyboard Accessory */}
      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID="goalKeyboard">
          <View
            style={{
              backgroundColor: isDark ? colors.surface : "#f9fafb",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: isDark ? "#1e3a5f" : "#e5e7eb",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Pressable
              onPress={() => Keyboard.dismiss()}
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: 24,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Done
              </Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </Modal>
  );
}
