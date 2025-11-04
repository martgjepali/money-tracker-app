import { useAppTheme } from "@/app/providers/ThemeProvider";
import { Switch } from "@/components/ui/switch"; // ⬅️ your Switch component
import { Text } from "@/components/ui/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

export type RecurringType = "expense" | "income";

export type RecurringItem = {
  id: string;
  title: string;
  amount: number;        // raw amount (positive number)
  type: RecurringType;   // "expense" | "income"
  cadence: string;       // e.g., "Monthly"
  nextDateISO: string;   // e.g., "2025-11-24"
  accentColor?: string;  // optional pill/glow color
  active?: boolean;      // optional initial active state
};

type Props = {
  title?: string;                           // default: "Upcoming Recurring Transactions"
  items: RecurringItem[];
  style?: StyleProp<ViewStyle>;
  onItemPress?: (item: RecurringItem) => void;
  onToggleActive?: (item: RecurringItem, active: boolean) => void; // for backend later
};

export default function RecurringCard({
  title = "Upcoming Recurring Transactions",
  items,
  style,
  onItemPress,
  onToggleActive,
}: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const text = colors.text;
  const muted = colors.muted;

  const cardBg = isDark ? "#071226" : "#ffffff";
  const stageBg = isDark ? "#041225" : "#f8fafc";
  const glow = colors.accent;

  // local active state per item (id -> boolean)
  const initialActive = useMemo(
    () =>
      items.reduce<Record<string, boolean>>((acc, it) => {
        acc[it.id] = it.active ?? true;
        return acc;
      }, {}),
    [items]
  );
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>(initialActive);

  const formatMoney = (n: number, t: RecurringType) => {
    const sign = t === "expense" ? "-" : "+";
    return `${sign}$${Math.abs(n).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  return (
    <View
      style={[
        {
          borderRadius: 14,
          padding: 14,
          backgroundColor: cardBg,
          overflow: "hidden",
          shadowColor: glow,
          shadowOpacity: 0.2,
          shadowRadius: 18,
          elevation: 6,
        },
        style,
      ]}
    >
      {/* Header (no circular shadow on the right anymore) */}
      <View style={{ marginBottom: 10 }}>
        <Text
          style={{
            color: text,
            fontSize: 20,
            fontWeight: "800",
            letterSpacing: 0.4,
          }}
        >
          {title}
        </Text>
        <Text style={{ color: muted, marginTop: 4, fontSize: 12 }}>
          Auto-scheduled charges & deposits
        </Text>
      </View>

      {/* Stage with subtle grid */}
      <View
        style={{
          borderRadius: 12,
          padding: 10,
          backgroundColor: stageBg,
          overflow: "hidden",
          borderWidth: isDark ? 0 : 1,
          borderColor: isDark ? "transparent" : "#e5e7eb",
        }}
      >
        {/* grid overlay */}
        <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${(i + 1) * 16}%`,
                borderBottomWidth: 1,
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(7,48,74,0.04)",
              }}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${(i + 1) * 14}%`,
                borderLeftWidth: 1,
                borderLeftColor: isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(7,48,74,0.03)",
              }}
            />
          ))}
        </View>

        {/* List */}
        <View style={{ gap: 10 }}>
          {items.map((it) => {
            const isExpense = it.type === "expense";
            const amountColor = isExpense ? "#FF3B30" : "#34C759";
            const pill = it.accentColor || (isExpense ? "#ff4d4f" : "#22c55e");
            const icon = isExpense ? "arrow-down-bold" : "arrow-up-bold";
            const isActive = activeMap[it.id];

            return (
              <Pressable
                key={it.id}
                onPress={() => onItemPress?.(it)}
                style={{
                  borderRadius: 12,
                  padding: 12,
                  backgroundColor: isDark ? "#0a1830" : "#ffffff",
                  borderWidth: isDark ? 0 : 1,
                  borderColor: isDark ? "transparent" : "#e9eef7",
                  shadowColor: pill,
                  shadowOpacity: isDark ? 0.2 : 0.08,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Left: title + meta */}
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: pill,
                          marginRight: 8,
                        }}
                      />
                      <Text style={{ color: text, fontWeight: "700", fontSize: 16 }}>
                        {it.title}
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row", marginTop: 6, flexWrap: "wrap" }}>
                      <Badge label={it.cadence} icon="refresh" />
                      <Badge label={`Due ${formatDate(it.nextDateISO)}`} icon="calendar" />
                    </View>
                  </View>

                  {/* Right: amount & Active switch */}
                  <View style={{ alignItems: "flex-end" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <MaterialCommunityIcons
                        name={icon as any}
                        size={16}
                        color={amountColor}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          color: amountColor,
                          fontSize: 16,
                          fontWeight: "800",
                          letterSpacing: 0.2,
                        }}
                      >
                        {formatMoney(it.amount, it.type)}
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                      <Text style={{ color: muted, marginRight: 8, fontWeight: "600" }}>
                        Active
                      </Text>
                      <Switch
                        value={!!isActive}
                        onValueChange={(val) => {
                          setActiveMap((prev) => ({ ...prev, [it.id]: val }));
                          onToggleActive?.(it, val);
                        }}
                        // optional: accessibility
                        accessibilityLabel={`Toggle ${it.title} active`}
                      />
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

/* ————— Small internal UI atoms ————— */

function Badge({ label, icon }: { label: string; icon?: string }) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 999,
        marginRight: 8,
        marginBottom: 6,
        backgroundColor: isDark ? "#0c1b33" : "#e8f1ff",
        borderWidth: isDark ? 0 : 1,
        borderColor: isDark ? "transparent" : "#dbeafe",
      }}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon as any}
          size={12}
          color={isDark ? colors.primary : "#0b1220"}
          style={{ marginRight: 6 }}
        />
      ) : null}
      <Text
        style={{
          color: isDark ? colors.text : "#0b1220",
          fontSize: 12,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
