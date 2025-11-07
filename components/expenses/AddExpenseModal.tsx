import { useAppTheme } from "@/app/providers/ThemeProvider";
import KeyboardAccessory from "@/components/ui/KeyboardAccessory";
import { ExpenseCategory } from "@/types/expense";
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
import { ExpenseCategorySelector } from "./ExpenseCategorySelector";

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (expense: {
    amount: number;
    category: ExpenseCategory;
    description: string;
    date: string;
  }) => void;
}

export function AddExpenseModal({ visible, onClose, onAdd }: AddExpenseModalProps) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>("food");
  const [selectedIcon, setSelectedIcon] = useState("food");
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");
  const [scale] = useState(new Animated.Value(0.9));
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
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
  }, [visible]);

  const handleSelectCategory = (category: ExpenseCategory, icon: string, color: string) => {
    setSelectedCategory(category);
    setSelectedIcon(icon);
    setSelectedColor(color);
  };

  const handleAdd = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }

    onAdd({
      amount: parseFloat(amount),
      category: selectedCategory,
      description: description.trim(),
      date: new Date().toISOString(),
    });

    // Reset form
    setAmount("");
    setDescription("");
    setSelectedCategory("food");
    setSelectedIcon("food");
    setSelectedColor("#FF6B6B");
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
                  name="wallet-outline"
                  size={24}
                  color="#EF4444"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
                  Add Expense
                </Text>
              </View>
              <Text style={{ color: colors.muted, marginBottom: 20, fontSize: 13 }}>
                Track your spending and stay within budget 💸
              </Text>

              {/* Category Selector */}
              <View style={{ marginBottom: 20 }}>
                <ExpenseCategorySelector
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleSelectCategory}
                />
              </View>

              {/* Amount Input */}
              <View
                style={{
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: isDark ? "transparent" : "#e9eef7",
                  marginBottom: 16,
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
                  Amount
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: selectedColor, fontSize: 28, fontWeight: "800", marginRight: 8 }}>
                    $
                  </Text>
                  <TextInput
                    placeholder="0.00"
                    placeholderTextColor={colors.muted}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    inputAccessoryViewID="expenseKeyboard"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    style={{
                      flex: 1,
                      color: selectedColor,
                      fontSize: 28,
                      fontWeight: "800",
                      padding: 0,
                    }}
                  />
                </View>
              </View>

              {/* Description Input */}
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
                  Description
                </Text>
                <TextInput
                  placeholder="What did you spend on?"
                  placeholderTextColor={colors.muted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={2}
                  inputAccessoryViewID="expenseKeyboard"
                  returnKeyType="done"
                  blurOnSubmit={true}
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    padding: 0,
                    minHeight: 40,
                  }}
                />
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable
                  onPress={handleClose}
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
                  <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleAdd}
                  disabled={confirmDisabled}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: "center",
                    backgroundColor: confirmDisabled ? "#94a3b8" : selectedColor,
                    shadowColor: confirmDisabled ? "#94a3b8" : selectedColor,
                    shadowOpacity: confirmDisabled ? 0 : 0.3,
                    shadowRadius: 14,
                    elevation: 6,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                    Add Expense
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
      <KeyboardAccessory nativeID="expenseKeyboard" />
    </Modal>
  );
}
