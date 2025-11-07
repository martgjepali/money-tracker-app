import { useAppTheme } from "@/app/providers/ThemeProvider";
import { DatePicker } from "@/components/ui/date-picker";
import type { CreateDebtInput, DebtStatus, RecurringFrequency } from "@/types/debt";
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
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (debt: CreateDebtInput) => void;
};

const RECURRING_FREQUENCIES: { value: RecurringFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export default function AddDebtModal({ visible, onClose, onAdd }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>("monthly");
  const [recurringAmount, setRecurringAmount] = useState("");

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
    setAmount("");
    setInterestRate("");
    setMinimumPayment("");
    setPaidAmount("");
    setDate(new Date());
    setIsRecurring(false);
    setRecurringFrequency("monthly");
    setRecurringAmount("");
    onClose();
  };

  const handleAdd = async () => {
    if (!name.trim() || !amount.trim()) {
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }

    const debtAmount = parseFloat(amount);
    const paid = paidAmount ? parseFloat(paidAmount) : 0;
    let status: DebtStatus = "active";
    
    if (paid >= debtAmount) {
      status = "paid";
    }

    const debtData: CreateDebtInput = {
      name: name.trim(),
      amount: debtAmount,
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
      minimumPayment: minimumPayment ? parseFloat(minimumPayment) : undefined,
      status,
      date: date.toISOString(),
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      recurringAmount: isRecurring && recurringAmount ? parseFloat(recurringAmount) : undefined,
      paidAmount: paid,
    };

    onAdd(debtData);
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

  const isValid = name.trim() !== "" && amount.trim() !== "";

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
                      backgroundColor: "#EF444420",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <MaterialCommunityIcons name="credit-card-outline" size={24} color="#EF4444" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 22,
                        fontWeight: "700",
                      }}
                    >
                      Add New Debt
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

                {/* Debt Name */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    Debt Name
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Credit Card"
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
                    inputAccessoryViewID="debtKeyboard"
                  />
                </View>

                {/* Total Amount */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    Total Amount
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: "#EF4444",
                        fontSize: 28,
                        fontWeight: "800",
                        marginRight: 12,
                      }}
                    >
                      $
                    </Text>
                    <TextInput
                      value={amount}
                      onChangeText={setAmount}
                      placeholder="0"
                      placeholderTextColor={colors.muted}
                      keyboardType="decimal-pad"
                      style={{
                        flex: 1,
                        backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        color: "#EF4444",
                        fontWeight: "600",
                        borderWidth: 1,
                        borderColor: isDark ? "transparent" : "#e9eef7",
                      }}
                      inputAccessoryViewID="debtKeyboard"
                    />
                  </View>
                </View>

                {/* Paid Amount */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    Already Paid (Optional)
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: "#10B981",
                        fontSize: 28,
                        fontWeight: "800",
                        marginRight: 12,
                      }}
                    >
                      $
                    </Text>
                    <TextInput
                      value={paidAmount}
                      onChangeText={setPaidAmount}
                      placeholder="0"
                      placeholderTextColor={colors.muted}
                      keyboardType="decimal-pad"
                      style={{
                        flex: 1,
                        backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        color: "#10B981",
                        fontWeight: "600",
                        borderWidth: 1,
                        borderColor: isDark ? "transparent" : "#e9eef7",
                      }}
                      inputAccessoryViewID="debtKeyboard"
                    />
                  </View>
                </View>

                {/* Interest Rate & Minimum Payment */}
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 14,
                        fontWeight: "600",
                        marginBottom: 8,
                      }}
                    >
                      Interest Rate %
                    </Text>
                    <TextInput
                      value={interestRate}
                      onChangeText={setInterestRate}
                      placeholder="0"
                      placeholderTextColor={colors.muted}
                      keyboardType="decimal-pad"
                      style={{
                        backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        color: colors.text,
                        borderWidth: 1,
                        borderColor: isDark ? "transparent" : "#e9eef7",
                      }}
                      inputAccessoryViewID="debtKeyboard"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 14,
                        fontWeight: "600",
                        marginBottom: 8,
                      }}
                    >
                      Min. Payment
                    </Text>
                    <TextInput
                      value={minimumPayment}
                      onChangeText={setMinimumPayment}
                      placeholder="0"
                      placeholderTextColor={colors.muted}
                      keyboardType="decimal-pad"
                      style={{
                        backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        color: colors.text,
                        borderWidth: 1,
                        borderColor: isDark ? "transparent" : "#e9eef7",
                      }}
                      inputAccessoryViewID="debtKeyboard"
                    />
                  </View>
                </View>

                {/* Date */}
                <View style={{ marginBottom: 20 }}>
                  <DatePicker
                    mode="date"
                    value={date}
                    onChange={(newDate) => newDate && setDate(newDate)}
                    placeholder="Select date"
                    variant="filled"
                    style={{
                      backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                      borderWidth: 1,
                      borderColor: isDark ? "transparent" : "#e9eef7",
                    }}
                  />
                </View>

                {/* Recurring Toggle */}
                <View
                  style={{
                    backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: isRecurring ? 16 : 24,
                    borderWidth: 1,
                    borderColor: isDark ? "transparent" : "#e9eef7",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 16,
                        fontWeight: "600",
                        marginBottom: 4,
                      }}
                    >
                      Recurring Debt
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 13 }}>
                      Payment repeats automatically
                    </Text>
                  </View>
                  <Switch
                    value={isRecurring}
                    onValueChange={setIsRecurring}
                    trackColor={{ false: "#d1d5db", true: colors.accent + "60" }}
                    thumbColor={isRecurring ? colors.accent : "#f3f4f6"}
                  />
                </View>

                {/* Recurring Options */}
                {isRecurring && (
                  <>
                    <View style={{ marginBottom: 20 }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: 14,
                          fontWeight: "600",
                          marginBottom: 8,
                        }}
                      >
                        Frequency
                      </Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        {RECURRING_FREQUENCIES.map((freq) => (
                          <TouchableOpacity
                            key={freq.value}
                            onPress={() => setRecurringFrequency(freq.value)}
                            style={{
                              backgroundColor:
                                recurringFrequency === freq.value
                                  ? colors.accent
                                  : isDark
                                    ? "#0b1220"
                                    : "#f9fafb",
                              paddingHorizontal: 16,
                              paddingVertical: 10,
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor:
                                recurringFrequency === freq.value
                                  ? colors.accent
                                  : isDark
                                    ? "transparent"
                                    : "#e9eef7",
                            }}
                          >
                            <Text
                              style={{
                                color:
                                  recurringFrequency === freq.value ? "#fff" : colors.text,
                                fontSize: 14,
                                fontWeight: "600",
                              }}
                            >
                              {freq.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={{ marginBottom: 24 }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: 14,
                          fontWeight: "600",
                          marginBottom: 8,
                        }}
                      >
                        Payment Amount (Optional)
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
                          value={recurringAmount}
                          onChangeText={setRecurringAmount}
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
                          inputAccessoryViewID="debtKeyboard"
                        />
                      </View>
                    </View>
                  </>
                )}

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
                      backgroundColor: isValid ? "#EF4444" : colors.muted,
                      borderRadius: 12,
                      padding: 16,
                      alignItems: "center",
                      shadowColor: isValid ? "#EF4444" : "transparent",
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
                      Add Debt
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
        <InputAccessoryView nativeID="debtKeyboard">
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
                backgroundColor: "#EF4444",
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
