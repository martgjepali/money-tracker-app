import ExpenseOverviewCard from "@/components/analytics/ExpenseOverviewCard";
import DebtsOverviewCard from "@/components/debts/DebtsOverviewCard";
import RecurringCard from "@/components/recurring/RecurringCard";
import FuturisticModal from "@/components/ui/modal";
import {
  DAILY_EXPENSE_DATA,
  WEEKLY_EXPENSE_DATA,
} from "@/constants/expensesConst";
import { RECURRING_ITEMS } from "@/constants/recurringConst";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, RefreshControl, ScrollView, Text, View } from "react-native";
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

  // Refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Rainbow gradient animation
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Card entrance animations
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;
  const fadeAnim5 = useRef(new Animated.Value(0)).current;
  const fadeAnim6 = useRef(new Animated.Value(0)).current;

  const translateY1 = useRef(new Animated.Value(50)).current;
  const translateY2 = useRef(new Animated.Value(50)).current;
  const translateY3 = useRef(new Animated.Value(50)).current;
  const translateY4 = useRef(new Animated.Value(50)).current;
  const translateY5 = useRef(new Animated.Value(50)).current;
  const translateY6 = useRef(new Animated.Value(50)).current;

  const insets = useSafeAreaInsets();
  const topPadding = Math.max(20, insets.top + 18);

  // Function to play entrance animations
  const playEntranceAnimations = () => {
    // Reset all animations
    fadeAnim1.setValue(0);
    fadeAnim2.setValue(0);
    fadeAnim3.setValue(0);
    fadeAnim4.setValue(0);
    fadeAnim5.setValue(0);
    fadeAnim6.setValue(0);
    translateY1.setValue(50);
    translateY2.setValue(50);
    translateY3.setValue(50);
    translateY4.setValue(50);
    translateY5.setValue(50);
    translateY6.setValue(50);

    // Staggered entrance animations
    const animations = [
      { fade: fadeAnim1, translate: translateY1, delay: 0 },
      { fade: fadeAnim2, translate: translateY2, delay: 100 },
      { fade: fadeAnim3, translate: translateY3, delay: 200 },
      { fade: fadeAnim4, translate: translateY4, delay: 300 },
      { fade: fadeAnim5, translate: translateY5, delay: 400 },
      { fade: fadeAnim6, translate: translateY6, delay: 500 },
    ];

    animations.forEach(({ fade, translate, delay }) => {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(translate, {
          toValue: 0,
          delay,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  useEffect(() => {
    // Gradient shift animation
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // Play entrance animations on mount
    playEntranceAnimations();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call - replace with actual data fetch
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
    // Replay animations after refresh
    playEntranceAnimations();
  };

  // Construct more vivid, Stocks-like UI pieces with glows and gradients (approximated with overlays)
  const heroCardStyle = {
    borderRadius: 14,
    padding: 20,
    backgroundColor: isDark ? colors.card : colors.card,
    overflow: "hidden",
  } as const;

  const smallCardBg = { backgroundColor: isDark ? "#071226" : "#ffffff" };

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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
          progressBackgroundColor={isDark ? "#0b1220" : "#ffffff"}
          progressViewOffset={topPadding + 40}
        />
      }
    >
      {/* <View style={{ marginTop: 20, marginBottom: 14 }}>
        <Text style={{ color: text, fontSize: 28, fontWeight: "800" }}>
          Dashboard
        </Text>
      </View> */}

      {/* Hero */}
      <Animated.View 
        style={{ 
          marginBottom: 18,
          opacity: fadeAnim1,
          transform: [{ translateY: translateY1 }],
        }}
      >
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
          
          {/* Animated Rainbow Gradient Text */}
          <MaskedView
            maskElement={
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "700",
                  backgroundColor: "transparent",
                  lineHeight: 28,
                }}
              >
                Financial{"\n"}Command{"\n"}Center
              </Text>
            }
          >
            <Animated.View
              style={{
                height: 90,
                justifyContent: "center",
                opacity: animatedValue.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.85, 1],
                }),
              }}
            >
              <LinearGradient
                colors={[
                  "#FF0080", // Hot pink
                  "#FF6B35", // Orange red
                  "#FFD700", // Gold
                  "#00FF7F", // Spring green
                  "#00CED1", // Turquoise
                  "#4169E1", // Royal blue
                  "#9370DB", // Purple
                  "#FF1493", // Deep pink
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 90,
                  width: "200%",
                }}
              />
            </Animated.View>
          </MaskedView>

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
      </Animated.View>

      {/* Row: Savings / Income / Expenses */}
      <Animated.View 
        style={{ 
          marginBottom: 16,
          opacity: fadeAnim2,
          transform: [{ translateY: translateY2 }],
        }}
      >
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
      </Animated.View>

      {/* Goals Progress with gradient bar */}
      <Animated.View 
        style={{ 
          marginBottom: 16,
          opacity: fadeAnim3,
          transform: [{ translateY: translateY3 }],
        }}
      >
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
      </Animated.View>

      {/* Debts — replaced with bna-ui demo components */}
      <Animated.View 
        style={{ 
          marginBottom: 18,
          opacity: fadeAnim4,
          transform: [{ translateY: translateY4 }],
        }}
      >
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
      </Animated.View>

      {/* Pay Debt primary action placed below the Debts Overview card */}

      {/* Upcoming Recurring */}
      <Animated.View 
        style={{ 
          marginBottom: 18,
          opacity: fadeAnim5,
          transform: [{ translateY: translateY5 }],
        }}
      >
        <RecurringCard
          items={RECURRING_ITEMS}
          onToggleActive={handleToggleActive}
          // onItemPress={(it) => console.log("Open details", it.id)} // optional
        />
      </Animated.View>

      {/* Expense Tracking Chart placeholder */}
      <Animated.View 
        style={{ 
          marginBottom: 32,
          opacity: fadeAnim6,
          transform: [{ translateY: translateY6 }],
        }}
      >
        <ExpenseOverviewCard
          title="Expense Tracking"
          description="Switch between Daily & Weekly analytics"
          data={{ daily: DAILY_EXPENSE_DATA, weekly: WEEKLY_EXPENSE_DATA }}
          height={180}
          initialChart="area"
          initialRange="weekly"
          onRangeChange={(range) => console.log("Selected range:", range)}
        />
      </Animated.View>
    </ScrollView>
  );
}
