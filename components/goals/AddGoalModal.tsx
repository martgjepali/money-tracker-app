import { useAppTheme } from "@/app/providers/ThemeProvider";
import GoalIconSelector from "@/components/goals/GoalIconSelector";
import { DatePicker } from "@/components/ui/date-picker";
import KeyboardAccessory from "@/components/ui/KeyboardAccessory";
import { Text } from "@/components/ui/text";
import { GOAL_TYPES, type CreateGoalInput } from "@/types/goal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
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
  onAdd: (goal: CreateGoalInput) => void;
};

export default function AddGoalModal({ visible, onClose, onAdd }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const glass = isDark ? "#0b162b" : "#ffffff";
  const border = isDark ? "rgba(125, 211, 252, 0.25)" : "rgba(7, 48, 74, 0.15)";
  const glow = colors.accent;

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<string>("emergency");
  const [selectedIcon, setSelectedIcon] = useState<string>("shield-check");
  const [selectedColor, setSelectedColor] = useState<string>("#FF3B30");

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

  const handleSelectType = (typeId: string, icon: string, color: string) => {
    setSelectedType(typeId);
    setSelectedIcon(icon);
    setSelectedColor(color);
  };

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
    setSelectedType("emergency");
    setSelectedIcon("shield-check");
    setSelectedColor("#FF3B30");
    onClose();
  };

  const handleAdd = async () => {
    if (!targetAmount.trim() || parseFloat(targetAmount) <= 0) {
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }

    const typeLabel = GOAL_TYPES.find((t) => t.id === selectedType)?.label || name.trim();

    const goalData: CreateGoalInput = {
      name: name.trim() || typeLabel,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      deadline: deadline?.toISOString(),
      icon: selectedIcon,
      color: selectedColor,
      type: selectedType, // Use selectedType (id) instead of typeLabel
    };

    // Debug logging (remove in production)
    console.log('Creating Goal with data:', {
      ...goalData,
      selectedType,
      selectedIcon,
      selectedColor,
      availableTypes: GOAL_TYPES.map(t => ({ id: t.id, label: t.label }))
    });

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

  const isValid = targetAmount.trim() !== "" && parseFloat(targetAmount) > 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={{ flex: 1, justifyContent: "center" }}
        >
          <Animated.View
            style={[
              {
                margin: 16,
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
                transform: [{ scale: modalScale }, { translateY: modalTranslateY }],
              },
            ]}
          >
            <ScrollView 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={true}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="target"
                  size={24}
                  color={colors.primary}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
                  Add Goal
                </Text>
              </View>
              <Text style={{ color: colors.muted, marginBottom: 20, fontSize: 13 }}>
                Set your financial targets and achieve them 🎯
              </Text>

              {/* Goal Icon Selector */}
              <View style={{ marginBottom: 20 }}>
                <GoalIconSelector selectedType={selectedType} onSelectType={handleSelectType} />
              </View>

              {/* Goal Name */}
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
                  Goal Name (Optional)
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={GOAL_TYPES.find(t => t.id === selectedType)?.label || "Custom goal name..."}
                  placeholderTextColor={colors.muted}
                  inputAccessoryViewID="goalKeyboard"
                  returnKeyType="done"
                  blurOnSubmit
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "600",
                    paddingVertical: 4,
                  }}
                />
              </View>

              {/* Target Amount */}
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
                  Target Amount
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
                    value={targetAmount}
                    onChangeText={(t) => setTargetAmount(t.replace(/[^0-9.]/g, ""))}
                    placeholder="0.00"
                    placeholderTextColor={colors.muted}
                    inputAccessoryViewID="goalKeyboard"
                    returnKeyType="done"
                    blurOnSubmit
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

              {/* Current Amount */}
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
                  Current Amount (Optional)
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#34C759",
                      fontSize: 24,
                      fontWeight: "800",
                      marginRight: 8,
                    }}
                  >
                    $
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={currentAmount}
                    onChangeText={(t) => setCurrentAmount(t.replace(/[^0-9.]/g, ""))}
                    placeholder="0.00"
                    placeholderTextColor={colors.muted}
                    inputAccessoryViewID="goalKeyboard"
                    returnKeyType="done"
                    blurOnSubmit
                    style={{
                      flex: 1,
                      color: colors.text,
                      fontSize: 24,
                      fontWeight: "800",
                      paddingVertical: 4,
                    }}
                  />
                </View>
                {currentAmount && parseFloat(currentAmount) > 0 && (
                  <Text style={{ color: colors.muted, fontSize: 11, marginTop: 6 }}>
                    {parseFloat(currentAmount) > parseFloat(targetAmount || "1")
                      ? "⚠️ Current amount exceeds target"
                      : `🎯 ${((parseFloat(currentAmount) / parseFloat(targetAmount || "1")) * 100).toFixed(0)}% of target reached`}
                  </Text>
                )}
              </View>

              {/* Deadline */}
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
                <Text style={{ color: colors.muted, marginBottom: 8, fontSize: 13 }}>
                  Target Date (Optional)
                </Text>
                <DatePicker
                  mode="date"
                  value={deadline}
                  onChange={setDeadline}
                  placeholder="Select target date"
                  minimumDate={new Date()}
                  variant="filled"
                />
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
                  disabled={!isValid}
                  onPress={handleAdd}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: "center",
                    backgroundColor: !isValid ? "#94a3b8" : selectedColor,
                    shadowColor: !isValid ? "#94a3b8" : selectedColor,
                    shadowOpacity: !isValid ? 0 : 0.3,
                    shadowRadius: 14,
                    elevation: 6,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                    Add Goal
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
      <KeyboardAccessory nativeID="goalKeyboard" />
    </Modal>
  );
}
