// components/debts/DebtsOverviewCard.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { BarChart } from "@/components/charts/bar-chart";
import { Legend } from "@/components/charts/legend";
import { PieChart } from "@/components/charts/pie-chart";
import type { Debt } from "@/types/debt";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

export type DebtChartType = "pie" | "bar";

type Props = {
  /** Optional: full list of debts; if provided, all numbers are derived from this. */
  debts?: Debt[];

  /** Fallbacks when `debts` is not provided */
  totalDebt?: number;
  paidAmount?: number;
  nextPaymentLabel?: string;
  minimumPaymentAmount?: number;
  initialChartType?: DebtChartType;
  showPayButton?: boolean;
  onPressPay?: () => void;
};

/** Utility: compute overview numbers from a debts array */
function getDebtsOverviewFromList(debts: Debt[]) {
  if (!debts.length) {
    return {
      totalDebt: 0,
      totalPaid: 0,
      remaining: 0,
      minimumPaymentAmount: 0,
      nextPaymentLabel: "No upcoming payments",
    };
  }

  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = debts.reduce((sum, d) => sum + d.paidAmount, 0);
  const remaining = Math.max(0, totalDebt - totalPaid);

  const activeDebts = debts.filter((d) => d.status === "active");

  // Sum of minimum payments for active debts (or recurringAmount as backup)
  const minimumPaymentAmount = activeDebts.reduce((sum, d) => {
    if (typeof d.minimumPayment === "number") return sum + d.minimumPayment;
    if (typeof d.recurringAmount === "number") return sum + d.recurringAmount;
    return sum;
  }, 0);

  // Find the "next" debt by due date
  const nextDebt = activeDebts
    .filter((d) => !!d.date)
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )[0];

  let nextPaymentLabel = "No upcoming payments";

  if (nextDebt) {
    const due = new Date(nextDebt.date);
    const amount =
      nextDebt.minimumPayment ??
      nextDebt.recurringAmount ??
      0;

    const formattedDate = due.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

    nextPaymentLabel = `Next: $${amount.toFixed(2)} · ${formattedDate}`;
  }

  return {
    totalDebt,
    totalPaid,
    remaining,
    minimumPaymentAmount,
    nextPaymentLabel,
  };
}

export default function DebtsOverviewCard({
  debts,
  totalDebt,
  paidAmount,
  nextPaymentLabel = "Next payment: $50 · Nov 30",
  minimumPaymentAmount = 50,
  initialChartType = "pie",
  showPayButton = true,
  onPressPay,
}: Props) {
  const [chartType, setChartType] =
    React.useState<DebtChartType>(initialChartType);

  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const text = colors.text;
  const muted = colors.muted;

  // 🔢 Decide where our numbers come from: debts[] or props
  const derived = React.useMemo(() => {
    if (debts && debts.length > 0) {
      return getDebtsOverviewFromList(debts);
    }

    const safeTotalDebt = totalDebt ?? 0;
    const safePaidAmount = paidAmount ?? 0;
    const remaining = Math.max(0, safeTotalDebt - safePaidAmount);

    return {
      totalDebt: safeTotalDebt,
      totalPaid: safePaidAmount,
      remaining,
      minimumPaymentAmount,
      nextPaymentLabel,
    };
  }, [debts, totalDebt, paidAmount, minimumPaymentAmount, nextPaymentLabel]);

  const remaining = derived.remaining;
  const effectivePaidAmount = derived.totalPaid;
  const effectiveMinPayment = derived.minimumPaymentAmount;
  const effectiveNextLabel = derived.nextPaymentLabel;

  const paidColor = colors.chart1 || "#34C759";
  const remColor = colors.chart3 || "#FF3B30";

  const pieData = [
    { label: "Paid", value: effectivePaidAmount, color: paidColor },
    { label: "Remaining", value: remaining, color: remColor },
  ];
  const barData = pieData;

  const legendItems = [
    {
      label: "Paid",
      value: `$${effectivePaidAmount.toLocaleString()}`,
      color: paidColor,
    },
    // If you want, you *could* also show remaining here later:
    // { label: "Remaining", value: `$${remaining.toLocaleString()}`, color: remColor },
  ];

  return (
    <View
      style={{
        borderRadius: 14,
        padding: 16,
        backgroundColor: isDark ? "#071226" : "#ffffff",
      }}
    >
      <Text
        style={{
          color: text,
          marginBottom: 12,
          fontSize: 20,
          fontWeight: "700",
        }}
      >
        Debts Overview
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Summary */}
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: text }}>
            Remaining
          </Text>
          <Text
            style={{
              marginTop: 4,
              color: remColor,
              fontSize: 24,
              fontWeight: "800",
            }}
          >
            $
            {remaining.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text style={{ marginTop: 6, color: muted, fontSize: 12 }}>
            {effectiveNextLabel}
          </Text>
        </View>

        {/* Chart */}
        <View
          style={{
            width: 150,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {chartType === "pie" ? (
            <PieChart
              data={pieData}
              config={{ height: 120, animated: true, showLabels: false }}
              style={{ width: "100%", height: 120 }}
            />
          ) : (
            <BarChart
              data={barData}
              config={{
                height: 120,
                padding: 16,
                showLabels: true,
                animated: true,
                duration: 600,
              }}
              style={{ width: "100%", height: 120 }}
            />
          )}
        </View>
      </View>

      {/* Legend */}
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                color: text,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Minimum Payment
            </Text>
            <Text style={{ color: muted, fontSize: 14 }}>
              ${effectiveMinPayment.toFixed(2)}
            </Text>
          </View>

          {/* Toggle */}
          <View style={{ flexDirection: "row" }}>
            <RectButton
              accessibilityLabel="Show pie chart"
              onPress={async () => {
                try {
                  await Haptics.selectionAsync();
                } catch (e) {
                  /* ignore haptic errors */
                }
                setChartType("pie");
              }}
              rippleColor={
                chartType === "pie"
                  ? isDark
                    ? "#0b1220"
                    : "#e6f6ff"
                  : undefined
              }
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                marginRight: 8,
                backgroundColor:
                  chartType === "pie"
                    ? isDark
                      ? "#0b1220"
                      : "#e6f6ff"
                    : "transparent",
              }}
            >
              <Text
                style={{
                  color:
                    chartType === "pie"
                      ? isDark
                        ? colors.primary
                        : "#0b1220"
                      : muted,
                  fontWeight: "700",
                }}
              >
                Pie
              </Text>
            </RectButton>

            <RectButton
              accessibilityLabel="Show bar chart"
              onPress={async () => {
                try {
                  await Haptics.selectionAsync();
                } catch (e) {
                  /* ignore haptic errors */
                }
                setChartType("bar");
              }}
              rippleColor={
                chartType === "bar"
                  ? isDark
                    ? "#0b1220"
                    : "#e6f6ff"
                  : undefined
              }
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor:
                  chartType === "bar"
                    ? isDark
                      ? "#0b1220"
                      : "#e6f6ff"
                    : "transparent",
              }}
            >
              <Text
                style={{
                  color:
                    chartType === "bar"
                      ? isDark
                        ? colors.primary
                        : "#0b1220"
                      : muted,
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
              try {
                await Haptics.impactAsync(
                  Haptics.ImpactFeedbackStyle.Medium
                );
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
            <Text
              style={{
                color: "#fff",
                fontWeight: "800",
                fontSize: 16,
              }}
            >
              Pay Debt
            </Text>
          </RectButton>
        </View>
      )}
    </View>
  );
}
