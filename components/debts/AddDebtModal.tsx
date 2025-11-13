import { useAppTheme } from "@/app/providers/ThemeProvider";
import { DatePicker } from "@/components/ui/date-picker";
import { Text } from "@/components/ui/text";
import { DEBT_TYPES, DebtStatus, RecurringFrequency, type CreateDebtInput } from "@/types/debt";
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
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DebtIconSelector from "./DebtIconSelector";

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
  const glass = isDark ? "#0b162b" : "#ffffff";
  const border = isDark ? "rgba(125, 211, 252, 0.25)" : "rgba(7, 48, 74, 0.15)";
  const glow = "#EF4444";

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>("monthly");
  const [recurringAmount, setRecurringAmount] = useState("");
  const [selectedType, setSelectedType] = useState<string>("credit_card");
  const [selectedIcon, setSelectedIcon] = useState<string>("credit-card");
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
    setAmount("");
    setInterestRate("");
    setMinimumPayment("");
    setPaidAmount("");
    setDate(new Date());
    setIsRecurring(false);
    setRecurringFrequency("monthly");
    setRecurringAmount("");
    setSelectedType("credit_card");
    setSelectedIcon("credit-card");
    setSelectedColor("#FF3B30");
    onClose();
  };

  const handleAdd = async () => {
    if (!amount.trim() || parseFloat(amount) <= 0) {
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

    const typeLabel = DEBT_TYPES.find((t) => t.id === selectedType)?.label || name.trim();

    const debtData: CreateDebtInput = {
      name: name.trim() || typeLabel,
      amount: debtAmount,
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
      minimumPayment: minimumPayment ? parseFloat(minimumPayment) : undefined,
      status,
      date: date.toISOString(),
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      recurringAmount: isRecurring && recurringAmount ? parseFloat(recurringAmount) : undefined,
      paidAmount: paid,
      icon: selectedIcon,
      color: selectedColor,
      type: selectedType, // Use selectedType (id) instead of typeLabel
    };

    // Debug logging (remove in production)
    console.log('Creating Debt with data:', debtData);

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

  const isValid = amount.trim() !== "" && parseFloat(amount) > 0;

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
                  name="cash-minus"
                  size={24}
                  color="#EF4444"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
                  Add Debt
                </Text>
              </View>
              <Text style={{ color: colors.muted, marginBottom: 20, fontSize: 13 }}>
                Track your debts and pay them off faster 💳
              </Text>

              {/* Debt Icon Selector */}
              <View style={{ marginBottom: 20 }}>
                <DebtIconSelector selectedType={selectedType} onSelectType={handleSelectType} />
              </View>

              {/* Debt Name */}
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
                  Debt Name (Optional)
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={DEBT_TYPES.find(t => t.id === selectedType)?.label || "Custom debt name..."}
                  placeholderTextColor={colors.muted}
                  inputAccessoryViewID="debtKeyboard"
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

              {/* Total Amount */}
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
                  Total Amount
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
                    inputAccessoryViewID="debtKeyboard"
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

              {/* Paid Amount */}
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
                  Already Paid (Optional)
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: "#10B981",
                      fontSize: 28,
                      fontWeight: "800",
                      marginRight: 8,
                    }}
                  >
                    $
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={paidAmount}
                    onChangeText={(t) => setPaidAmount(t.replace(/[^0-9.]/g, ""))}
                    placeholder="0.00"
                    placeholderTextColor={colors.muted}
                    inputAccessoryViewID="debtKeyboard"
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

              {/* Interest Rate & Minimum Payment */}
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                <View
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    padding: 16,
                    backgroundColor: isDark ? "#0a1830" : "#f8fbff",
                    borderWidth: isDark ? 0 : 1,
                    borderColor: isDark ? "transparent" : "#e9eef7",
                  }}
                >
                  <Text style={{ color: colors.muted, marginBottom: 8, fontSize: 13 }}>
                    Interest Rate %
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={interestRate}
                    onChangeText={(t) => setInterestRate(t.replace(/[^0-9.]/g, ""))}
                    placeholder="0.00"
                    placeholderTextColor={colors.muted}
                    inputAccessoryViewID="debtKeyboard"
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

                <View
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    padding: 16,
                    backgroundColor: isDark ? "#0a1830" : "#f8fbff",
                    borderWidth: isDark ? 0 : 1,
                    borderColor: isDark ? "transparent" : "#e9eef7",
                  }}
                >
                  <Text style={{ color: colors.muted, marginBottom: 8, fontSize: 13 }}>
                    Min Payment
                  </Text>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 16,
                        fontWeight: "600",
                        marginRight: 4,
                      }}
                    >
                      $
                    </Text>
                    <TextInput
                      keyboardType="numeric"
                      value={minimumPayment}
                      onChangeText={(t) => setMinimumPayment(t.replace(/[^0-9.]/g, ""))}
                      placeholder="0.00"
                      placeholderTextColor={colors.muted}
                      inputAccessoryViewID="debtKeyboard"
                      returnKeyType="done"
                      blurOnSubmit
                      style={{
                        flex: 1,
                        color: colors.text,
                        fontSize: 16,
                        fontWeight: "600",
                        paddingVertical: 4,
                      }}
                    />
                  </View>
                </View>

              {/* Date */}
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
                  Date Added
                </Text>
                <DatePicker
                  mode="date"
                  value={date}
                  onChange={(newDate) => newDate && setDate(newDate)}
                  placeholder="Select date"
                  variant="filled"
                />
              </View>

              {/* Recurring Toggle */}
              <View
                style={{
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: isDark ? "#0a1830" : "#f8fbff",
                  borderWidth: isDark ? 0 : 1,
                  borderColor: isDark ? "transparent" : "#e9eef7",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: isRecurring ? 16 : 24,
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
                    <Text style={{ color: colors.muted, marginBottom: 12, fontSize: 13 }}>
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

                  <View
                    style={{
                      borderRadius: 16,
                      padding: 16,
                      backgroundColor: isDark ? "#0a1830" : "#f8fbff",
                      borderWidth: isDark ? 0 : 1,
                      borderColor: isDark ? "transparent" : "#e9eef7",
                      marginBottom: 24,
                    }}
                  >
                    <Text style={{ color: colors.muted, marginBottom: 8, fontSize: 13 }}>
                      Payment Amount (Optional)
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text
                        style={{
                          color: colors.accent,
                          fontSize: 28,
                          fontWeight: "800",
                          marginRight: 8,
                        }}
                      >
                        $
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        value={recurringAmount}
                        onChangeText={(t) => setRecurringAmount(t.replace(/[^0-9.]/g, ""))}
                        placeholder="0.00"
                        placeholderTextColor={colors.muted}
                        inputAccessoryViewID="debtKeyboard"
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
