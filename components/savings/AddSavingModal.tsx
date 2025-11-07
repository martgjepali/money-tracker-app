// components/savings/AddSavingModal.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import SavingTypeSelector from "@/components/savings/SavingTypeSelector";
import KeyboardAccessory from "@/components/ui/KeyboardAccessory";
import { Text } from "@/components/ui/text";
import { SAVING_TYPES, type CreateSavingInput } from "@/types/saving";
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
  onConfirm: (saving: CreateSavingInput) => void;
};

export default function AddSavingModal({ visible, onClose, onConfirm }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const glass = isDark ? "#0b162b" : "#ffffff";
  const border = isDark ? "rgba(125, 211, 252, 0.25)" : "rgba(7, 48, 74, 0.15)";
  const glow = colors.accent;

  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("general");
  const [selectedIcon, setSelectedIcon] = useState<string>("piggy-bank");
  const [selectedColor, setSelectedColor] = useState<string>("#FFD60A");

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

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }

    const typeLabel = SAVING_TYPES.find((t) => t.id === selectedType)?.label || selectedType;

    onConfirm({
      amount: numAmount,
      date: new Date().toISOString(),
      description: description.trim() || `${typeLabel} savings`,
      icon: selectedIcon,
      color: selectedColor,
    });

    // Reset form
    setAmount("");
    setDescription("");
    setSelectedType("general");
    setSelectedIcon("piggy-bank");
    setSelectedColor("#FFD60A");
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
                transform: [{ scale }],
                opacity,
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
                  name="piggy-bank-outline"
                  size={24}
                  color={colors.primary}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
                  Add to Savings
                </Text>
              </View>
              <Text style={{ color: colors.muted, marginBottom: 20, fontSize: 13 }}>
                Build your wealth one deposit at a time 🐷
              </Text>

              {/* Type Selector */}
              <View style={{ marginBottom: 20 }}>
                <SavingTypeSelector selectedType={selectedType} onSelectType={handleSelectType} />
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
                    inputAccessoryViewID="savingsKeyboard"
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

              {/* Description Input (Optional) */}
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
                  Description (Optional)
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="e.g., Monthly savings, Emergency fund..."
                  placeholderTextColor={colors.muted}
                  inputAccessoryViewID="savingsKeyboard"
                  returnKeyType="done"
                  blurOnSubmit
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
                    Add Savings
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
      <KeyboardAccessory nativeID="savingsKeyboard" />
    </Modal>
  );
}
