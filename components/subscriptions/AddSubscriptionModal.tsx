import { useAppTheme } from "@/app/providers/ThemeProvider";
import SubscriptionIconSelector from "@/components/subscriptions/SubscriptionIconSelector";
import { DatePicker } from "@/components/ui/date-picker";
import KeyboardAccessory from "@/components/ui/KeyboardAccessory";
import { Text } from "@/components/ui/text";
import {
    calculateNextBillingDate,
    SUBSCRIPTION_TYPES,
    type CreateSubscriptionInput,
    type SubscriptionFrequency
} from "@/types/subscription";
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
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (subscription: CreateSubscriptionInput) => void;
};

const FREQUENCY_OPTIONS: { value: SubscriptionFrequency; label: string; description: string }[] = [
  { value: "weekly", label: "Weekly", description: "Every 7 days" },
  { value: "monthly", label: "Monthly", description: "Every month" },
  { value: "yearly", label: "Yearly", description: "Every year" },
];

export default function AddSubscriptionModal({ visible, onClose, onAdd }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const glass = isDark ? "#0b162b" : "#ffffff";
  const border = isDark ? "rgba(125, 211, 252, 0.25)" : "rgba(7, 48, 74, 0.15)";
  const glow = colors.accent;

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<SubscriptionFrequency>("monthly");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedType, setSelectedType] = useState<string>("netflix");
  const [selectedIcon, setSelectedIcon] = useState<string>("netflix");
  const [selectedColor, setSelectedColor] = useState<string>("#E50914");

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
    setDescription("");
    setFrequency("monthly");
    setStartDate(new Date());
    setSelectedType("netflix");
    setSelectedIcon("netflix");
    setSelectedColor("#E50914");
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

    const typeLabel = SUBSCRIPTION_TYPES.find((t) => t.id === selectedType)?.label || name.trim();

    const subscriptionData: CreateSubscriptionInput = {
      name: name.trim() || typeLabel,
      description: description.trim() || `${typeLabel} subscription`,
      amount: parseFloat(amount),
      frequency,
      startDate: startDate.toISOString(),
      icon: selectedIcon,
      color: selectedColor,
    };

    // Debug logging (remove in production)
    console.log('Creating Subscription with data:', {
      ...subscriptionData,
      selectedType,
      selectedIcon,
      selectedColor,
      nextBillingDate: calculateNextBillingDate(startDate, frequency),
      availableTypes: SUBSCRIPTION_TYPES.map(t => ({ id: t.id, label: t.label }))
    });

    onAdd(subscriptionData);
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

  // Calculate estimated costs
  const getEstimatedCosts = () => {
    const monthlyAmount = parseFloat(amount) || 0;
    if (monthlyAmount <= 0) return { monthly: 0, yearly: 0 };

    switch (frequency) {
      case "weekly":
        return {
          monthly: monthlyAmount * 4.33,
          yearly: monthlyAmount * 52,
        };
      case "monthly":
        return {
          monthly: monthlyAmount,
          yearly: monthlyAmount * 12,
        };
      case "yearly":
        return {
          monthly: monthlyAmount / 12,
          yearly: monthlyAmount,
        };
    }
  };

  const estimatedCosts = getEstimatedCosts();

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
                  name="calendar-sync"
                  size={24}
                  color={colors.primary}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
                  Add Subscription
                </Text>
              </View>
              <Text style={{ color: colors.muted, marginBottom: 20, fontSize: 13 }}>
                Track your recurring payments 💳
              </Text>

              {/* Subscription Icon Selector */}
              <View style={{ marginBottom: 20 }}>
                <SubscriptionIconSelector selectedType={selectedType} onSelectType={handleSelectType} />
              </View>

              {/* Subscription Name */}
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
                  Subscription Name (Optional)
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={SUBSCRIPTION_TYPES.find(t => t.id === selectedType)?.label || "Custom subscription name..."}
                  placeholderTextColor={colors.muted}
                  inputAccessoryViewID="subscriptionKeyboard"
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

              {/* Description */}
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
                  placeholder="Premium subscription for streaming..."
                  placeholderTextColor={colors.muted}
                  inputAccessoryViewID="subscriptionKeyboard"
                  returnKeyType="done"
                  blurOnSubmit
                  multiline
                  numberOfLines={2}
                  style={{
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: "500",
                    paddingVertical: 4,
                    textAlignVertical: "top",
                  }}
                />
              </View>

              {/* Amount and Frequency */}
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                {/* Amount */}
                <View
                  style={{
                    flex: 2,
                    borderRadius: 16,
                    padding: 16,
                    backgroundColor: isDark ? "#0a1830" : "#f8fbff",
                    borderWidth: isDark ? 0 : 1,
                    borderColor: isDark ? "transparent" : "#e9eef7",
                  }}
                >
                  <Text style={{ color: colors.muted, marginBottom: 8, fontSize: 13 }}>
                    Amount
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: selectedColor,
                        fontSize: 24,
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
                      inputAccessoryViewID="subscriptionKeyboard"
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
                </View>

                {/* Frequency */}
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
                    Billing
                  </Text>
                  <View style={{ gap: 6 }}>
                    {FREQUENCY_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => setFrequency(option.value)}
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 8,
                          borderRadius: 8,
                          backgroundColor: frequency === option.value 
                            ? selectedColor + "20" 
                            : "transparent",
                          borderWidth: frequency === option.value ? 1 : 0,
                          borderColor: frequency === option.value ? selectedColor : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            color: frequency === option.value ? selectedColor : colors.text,
                            fontSize: 12,
                            fontWeight: frequency === option.value ? "700" : "500",
                            textAlign: "center",
                          }}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Start Date */}
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
                  Start Date
                </Text>
                <DatePicker
                  mode="date"
                  value={startDate}
                  onChange={(newDate) => newDate && setStartDate(newDate)}
                  placeholder="Select start date"
                  variant="filled"
                />
              </View>

              {/* Cost Estimation */}
              {estimatedCosts.monthly > 0 && (
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
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <MaterialCommunityIcons
                      name="calculator"
                      size={16}
                      color={colors.accent}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600" }}>
                      Cost Breakdown
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ color: "#3B82F6", fontSize: 18, fontWeight: "800" }}>
                        ${estimatedCosts.monthly.toFixed(2)}
                      </Text>
                      <Text style={{ color: colors.muted, fontSize: 11 }}>
                        per month
                      </Text>
                    </View>
                    
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ color: "#10B981", fontSize: 18, fontWeight: "800" }}>
                        ${estimatedCosts.yearly.toFixed(2)}
                      </Text>
                      <Text style={{ color: colors.muted, fontSize: 11 }}>
                        per year
                      </Text>
                    </View>
                  </View>
                </View>
              )}

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
                    Add Subscription
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
      <KeyboardAccessory nativeID="subscriptionKeyboard" />
    </Modal>
  );
}