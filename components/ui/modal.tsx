import { useAppTheme } from "@/app/providers/ThemeProvider";
import { Text } from "@/components/ui/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number, method: string) => void;
  title?: string;
  note?: string;
  minAmount?: number; // e.g., 50
  defaultAmount?: number; // initial fill, e.g., 50
  style?: StyleProp<ViewStyle>;
};

const QUICK_AMOUNTS = [50, 100, 150, 200, 250, 300];

export default function FuturisticModal({
  visible,
  onClose,
  onConfirm,
  title = "Pay Debt",
  note = "Confirm the amount and method. This is a preview UI.",
  minAmount = 1,
  defaultAmount = 50,
  style,
}: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const glass = isDark ? "#0b162b" : "#ffffff";
  const border = isDark ? "rgba(125, 211, 252, 0.25)" : "rgba(7, 48, 74, 0.15)";
  const glow = colors.accent;

  const [amount, setAmount] = useState<number>(defaultAmount);
  const [method, setMethod] = useState<string>("Visa •••• 4242");

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

  const confirmDisabled = isNaN(amount) || amount < minAmount;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        {/* Backdrop */}
        <Pressable
          onPress={onClose}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
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
            style={[
              {
                backgroundColor: glass,
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: border,
                shadowColor: glow,
                shadowOpacity: 0.25,
                shadowRadius: 24,
                elevation: 10,
              },
              style,
            ]}
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
                name="credit-card-outline"
                size={20}
                color={colors.primary}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}
              >
                {title}
              </Text>
            </View>
            <Text
              style={{ color: colors.muted, marginBottom: 12, fontSize: 12 }}
            >
              {note}
            </Text>

            {/* Amount input */}
            <View
              style={{
                borderRadius: 14,
                padding: 14,
                backgroundColor: isDark ? "#0a1830" : "#f8fbff",
                borderWidth: isDark ? 0 : 1,
                borderColor: isDark ? "transparent" : "#e9eef7",
                marginBottom: 10,
              }}
            >
              <Text
                style={{ color: colors.muted, marginBottom: 6, fontSize: 12 }}
              >
                Amount
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 24,
                    fontWeight: "800",
                    marginRight: 6,
                  }}
                >
                  $
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={String(amount)}
                  onChangeText={(t) => {
                    const n = Number((t || "").replace(/[^0-9.]/g, ""));
                    setAmount(isNaN(n) ? 0 : n);
                  }}
                  placeholder="0"
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

              {/* quick chips */}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {QUICK_AMOUNTS.map((v, i) => (
                  <Pressable
                    key={`${v}-${i}`}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setAmount(v);
                    }}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      marginRight: 8,
                      marginBottom: 8,
                      borderRadius: 999,
                      backgroundColor: isDark ? "#0c1b33" : "#e8f1ff",
                      borderWidth: isDark ? 0 : 1,
                      borderColor: isDark ? "transparent" : "#dbeafe",
                    }}
                  >
                    <Text
                      style={{
                        color: isDark ? colors.text : "#0b1220",
                        fontWeight: "700",
                        fontSize: 12,
                      }}
                    >
                      ${v}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>
                Minimum allowed: ${minAmount.toFixed(2)}
              </Text>
            </View>

            {/* Method (placeholder picker) */}
            {/* <View
              style={{
                borderRadius: 14,
                padding: 14,
                backgroundColor: isDark ? "#0a1830" : "#f8fbff",
                borderWidth: isDark ? 0 : 1,
                borderColor: isDark ? "transparent" : "#e9eef7",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: colors.muted, marginBottom: 6, fontSize: 12 }}>
                Payment Method
              </Text>
              <Pressable
                onPress={() => {
                  // later: open real picker
                  setMethod((m) =>
                    m.includes("4242") ? "Mastercard •••• 1199" : "Visa •••• 4242"
                  );
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
                  {method}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={colors.muted}
                />
              </Pressable>
            </View> */}

            {/* Actions */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync();
                  onClose();
                }}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isDark ? "#1f2b44" : "#dbeafe",
                  marginRight: 10,
                  backgroundColor: isDark ? "#0b1220" : "#e8f1ff",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: isDark ? colors.text : "#0b1220",
                    fontWeight: "800",
                  }}
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                disabled={confirmDisabled}
                onPress={async () => {
                  try {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  } catch (e) {
                    /* ignore haptic errors */
                  }
                  onConfirm(amount, method);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                  backgroundColor: confirmDisabled ? "#94a3b8" : "#34C759",
                  shadowColor: confirmDisabled ? "#94a3b8" : "#34C759",
                  shadowOpacity: confirmDisabled ? 0 : 0.25,
                  shadowRadius: 14,
                  elevation: 6,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "800" }}>
                  Confirm
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
