import ExpenseOverviewCard from "@/components/analytics/ExpenseOverviewCard";
import DebtsOverviewCard from "@/components/debts/DebtsOverviewCard";
import RecurringCard from "@/components/recurring/RecurringCard";
import FuturisticModal from "@/components/ui/modal";
import {
  DAILY_EXPENSE_DATA,
  WEEKLY_EXPENSE_DATA,
} from "@/constants/expensesConst";
import { RECURRING_ITEMS } from "@/constants/recurringConst";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "./providers/ThemeProvider";

export default function Dashboard() {
  const [debtChartType, setDebtChartType] = React.useState<"pie" | "bar">(
    "pie"
  );
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const bg = colors.background;
  const primary = colors.primary;
  const text = colors.text;
  const muted = colors.muted;

  // Construct more vivid, Stocks-like UI pieces with glows and gradients (approximated with overlays)
  const heroCardStyle = {
    borderRadius: 14,
    padding: 20,
    backgroundColor: isDark ? colors.card : colors.card,
    overflow: "hidden",
  } as const;

  const smallCardBg = { backgroundColor: isDark ? "#071226" : "#ffffff" };

  const insets = useSafeAreaInsets();
  const topPadding = Math.max(20, insets.top + 18);

  const [payOpen, setPayOpen] = React.useState(false);

  // sample data for area chart (weekly expenses)
  const weeklyData = [
    { x: "Mon", y: 20 },
    { x: "Tue", y: 45 },
    { x: "Wed", y: 28 },
    { x: "Thu", y: 80 },
    { x: "Fri", y: 55 },
    { x: "Sat", y: 70 },
    { x: "Sun", y: 40 },
  ];

  const candleData = [
    { date: "Mon", open: 20, high: 46, low: 18, close: 32 },
    { date: "Tue", open: 32, high: 50, low: 28, close: 45 },
    { date: "Wed", open: 45, high: 52, low: 27, close: 30 },
    { date: "Thu", open: 30, high: 86, low: 29, close: 80 },
    { date: "Fri", open: 80, high: 82, low: 48, close: 55 },
    { date: "Sat", open: 55, high: 78, low: 52, close: 70 },
    { date: "Sun", open: 70, high: 74, low: 36, close: 40 },
  ];

  const totalDebt = 5000;
  const paidAmount = 450;

  const handleToggleActive = React.useCallback((item: any, active: boolean) => {
    // Hook your API later (enable/disable schedule, send email, etc.)
    console.log(`Recurring "${item.title}" is now ${active ? "ON" : "OFF"}`);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        paddingTop: topPadding,
        paddingBottom: 120,
      }}
      style={{ backgroundColor: bg, flex: 1 }}
    >
      {/* <View style={{ marginTop: 20, marginBottom: 14 }}>
        <Text style={{ color: text, fontSize: 28, fontWeight: "800" }}>
          Dashboard
        </Text>
      </View> */}

      {/* Hero */}
      <View style={{ marginBottom: 18 }}>
        <View style={heroCardStyle}>
          {/* inner gradient/glow overlay */}
          <View
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: isDark
                ? "rgba(46,230,255,0.04)"
                : "rgba(14,165,233,0.03)",
              borderRadius: 14,
            }}
          />
          <Text
            style={{
              color: colors.primary,
              textAlign: "center",
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            Financial{"\n"}Command{"\n"}Center
          </Text>
          <Text
            style={{
              color: muted,
              textAlign: "center",
              marginTop: 8,
              fontSize: 14,
            }}
          >
            Real-time insights into your financial universe
          </Text>
        </View>
      </View>

      {/* Row: Savings / Income / Expenses */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ marginBottom: 12 }}>
          <View
            style={{
              borderRadius: 14,
              padding: 14,
              ...smallCardBg,
              shadowColor: colors.accent,
              shadowOpacity: 0.25,
              shadowRadius: 18,
              elevation: 6,
            }}
          >
            <Text style={{ color: muted, fontSize: 12 }}>Total Savings</Text>
            <Text
              style={{
                color: "#34C759",
                fontSize: 24,
                fontWeight: "800",
                marginTop: 6,
              }}
            >
              $1,750.00
            </Text>
            <Text style={{ color: muted, fontSize: 12, marginTop: 8 }}>
              Secured
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <View
            style={{ flex: 1, borderRadius: 12, padding: 12, ...smallCardBg }}
          >
            <Text style={{ color: muted, fontSize: 12 }}>Total Income</Text>
            <Text
              style={{
                color: "#007AFF",
                fontSize: 20,
                fontWeight: "800",
                marginTop: 6,
              }}
            >
              $398.00
            </Text>
            <Text style={{ color: muted, fontSize: 12, marginTop: 6 }}>
              Inflow
            </Text>
          </View>
          <View
            style={{ flex: 1, borderRadius: 12, padding: 12, ...smallCardBg }}
          >
            <Text style={{ color: muted, fontSize: 12 }}>Total Expenses</Text>
            <Text
              style={{
                color: "#FF3B30",
                fontSize: 20,
                fontWeight: "800",
                marginTop: 6,
              }}
            >
              $100.00
            </Text>
            <Text style={{ color: muted, fontSize: 12, marginTop: 6 }}>
              Outflow
            </Text>
          </View>
        </View>
      </View>

      {/* Goals Progress with gradient bar */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ borderRadius: 14, padding: 14, ...smallCardBg }}>
          <Text
            style={{
              color: text,
              marginBottom: 8,
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            Goals Progress
          </Text>
          <Text style={{ color: muted, marginBottom: 8, fontSize: 14 }}>
            Progress toward your yearly targets
          </Text>
          <View
            style={{
              height: 12,
              backgroundColor: isDark ? "#021025" : "#eef6ff",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: "35%",
                height: "100%",
                backgroundColor: colors.accent,
                borderRadius: 8,
                shadowColor: colors.accent,
                shadowOpacity: 0.8,
                shadowRadius: 8,
                elevation: 6,
              }}
            />
          </View>
        </View>
      </View>

      {/* Debts — replaced with bna-ui demo components */}
      <View style={{ marginBottom: 18 }}>
        <DebtsOverviewCard
          totalDebt={5000}
          paidAmount={450}
          minimumPaymentAmount={50}
          showPayButton
          onPressPay={() => setPayOpen(true)}
        />

        <FuturisticModal
          visible={payOpen}
          onClose={() => setPayOpen(false)}
          minAmount={50}
          defaultAmount={50}
          onConfirm={(amount, method) => {
            // Later: call backend here (charge, record tx, email).
            console.log("CONFIRM:", { amount, method });
            setPayOpen(false);
          }}
        />
      </View>

      {/* Pay Debt primary action placed below the Debts Overview card */}

      {/* Upcoming Recurring */}
      <View style={{ marginBottom: 18 }}>
        <RecurringCard
          items={RECURRING_ITEMS}
          onToggleActive={handleToggleActive}
          // onItemPress={(it) => console.log("Open details", it.id)} // optional
        />
      </View>

      {/* Expense Tracking Chart placeholder */}
      <View style={{ marginBottom: 32 }}>
        <ExpenseOverviewCard
          title="Expense Tracking"
          description="Switch between Daily & Weekly analytics"
          data={{ daily: DAILY_EXPENSE_DATA, weekly: WEEKLY_EXPENSE_DATA }}
          height={180}
          initialChart="area"
          initialRange="weekly"
          onRangeChange={(range) => console.log("Selected range:", range)}
        />
      </View>
    </ScrollView>
  );
}
