// components/debts/DebtsOverviewCard.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { BarChart } from "@/components/charts/bar-chart";
import { Legend } from "@/components/charts/legend";
import { PieChart } from "@/components/charts/pie-chart";
import * as Haptics from 'expo-haptics';
import React from "react";
import { Text, View } from "react-native";
import { RectButton } from 'react-native-gesture-handler';

export type DebtChartType = "pie" | "bar";

type Props = {
  totalDebt: number;                 // e.g., 5000
  paidAmount: number;                // e.g., 450
  nextPaymentLabel?: string;         // e.g., "Next payment: $50 · Nov 30"
  minimumPaymentAmount?: number;     // e.g., 50
  initialChartType?: DebtChartType;  // default "pie"
  showPayButton?: boolean;           // default true
  onPressPay?: () => void;           // handler for "Pay Debt"
};

export default function DebtsOverviewCard({
  totalDebt,
  paidAmount,
  nextPaymentLabel = "Next payment: $50 · Nov 30",
  minimumPaymentAmount = 50,
  initialChartType = "pie",
  showPayButton = true,
  onPressPay,
}: Props) {
  const [chartType, setChartType] = React.useState<DebtChartType>(initialChartType);

  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const text = colors.text;
  const muted = colors.muted;

  const remaining = Math.max(0, totalDebt - paidAmount);
  const paidColor = colors.chart1 || "#34C759";
  const remColor  = colors.chart3 || "#FF3B30";

  const pieData = [
    { label: "Paid",      value: paidAmount, color: paidColor },
    { label: "Remaining", value: remaining,  color: remColor  },
  ];
  const barData = pieData;

  // ⬇️ Legend shows ONLY "Paid"
  const legendItems = [
    { label: "Paid", value: `$${paidAmount.toLocaleString()}`, color: paidColor },
  ];

  return (
    <View style={{ borderRadius: 14, padding: 16, backgroundColor: isDark ? "#071226" : "#ffffff" }}>
      <Text style={{ color: text, marginBottom: 12, fontSize: 20, fontWeight: "700" }}>
        Debts Overview
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        {/* Summary */}
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: text }}>
            Amount Remaining
          </Text>
          <Text
            style={{
              marginTop: 6,
              color: remColor,
              fontSize: 20,
              fontWeight: "800",
            }}
          >
            ${remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={{ marginTop: 8, color: muted, fontSize: 12 }}>
            {nextPaymentLabel}
          </Text>
        </View>

        {/* Chart */}
        <View style={{ width: 150, alignItems: "center", justifyContent: "center" }}>
          {chartType === "pie" ? (
            <PieChart
              data={pieData}
              config={{ height: 120, animated: true, showLabels: false }}
              style={{ width: "100%", height: 120 }}
            />
          ) : (
            <BarChart
              data={barData}
              config={{ height: 120, padding: 8, showLabels: false, animated: true }}
              style={{ width: "100%", height: 120 }}
            />
          )}
        </View>
      </View>

      {/* Unified legend (Paid only) */}
      <Legend items={legendItems} textColor={text} />

      {/* Footer: Minimum + Toggle */}
      <View
        style={{
          marginTop: 14,
          borderRadius: 10,
          padding: 12,
          backgroundColor: isDark ? "#071226" : "#ffffff",
          borderWidth: isDark ? 0 : 1,
          borderColor: isDark ? "transparent" : "#e5e7eb",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ color: text, fontWeight: "600", fontSize: 16 }}>Minimum Payment</Text>
            <Text style={{ color: muted, fontSize: 14 }}>${minimumPaymentAmount.toFixed(2)}</Text>
          </View>

          {/* Toggle */}
          <View style={{ flexDirection: "row" }}>
            <RectButton
              accessibilityLabel="Show pie chart"
              onPress={() => setChartType("pie")}
              rippleColor={chartType === "pie" ? (isDark ? "#0b1220" : "#e6f6ff") : undefined}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                marginRight: 8,
                backgroundColor: chartType === "pie" ? (isDark ? "#0b1220" : "#e6f6ff") : "transparent",
              }}
            >
              <Text
                style={{
                  color: chartType === "pie" ? (isDark ? colors.primary : "#0b1220") : muted,
                  fontWeight: "700",
                }}
              >
                Pie
              </Text>
            </RectButton>

            <RectButton
              accessibilityLabel="Show bar chart"
              onPress={() => setChartType("bar")}
              rippleColor={chartType === "bar" ? (isDark ? "#0b1220" : "#e6f6ff") : undefined}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor: chartType === "bar" ? (isDark ? "#0b1220" : "#e6f6ff") : "transparent",
              }}
            >
              <Text
                style={{
                  color: chartType === "bar" ? (isDark ? colors.primary : "#0b1220") : muted,
                  fontWeight: "700",
                }}
              >
                Bar
              </Text>
            </RectButton>
          </View>
        </View>
      </View>

      {/* Primary action (optional) */}
      {showPayButton && (
        <View style={{ marginTop: 14, alignItems: "center" }}>
          <RectButton
            onPress={async () => {
              // stronger feedback for a primary action
              try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              } catch (e) {
                /* ignore haptic errors */
              }
              onPressPay && onPressPay();
            }}
            rippleColor="#ffffff20"
            style={{
              width: 320,
              backgroundColor: "#FF3B30",
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: "center",
              shadowColor: "#FF3B30",
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
              Pay Debt
            </Text>
          </RectButton>
        </View>
      )}
    </View>
  );
}
