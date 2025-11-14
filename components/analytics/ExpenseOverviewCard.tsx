// components/analytics/ExpenseOverviewCard.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { AreaChart } from "@/components/charts/area-chart";
import { BarChart, type BarPoint } from "@/components/charts/bar-chart";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
import { ChartContainer } from "@/components/charts/chart-container";
import type { LinePoint } from "@/components/charts/line-chart";
import ChartSwitcher from "@/components/ChartSwitcher";
import { Text } from "@/components/ui/text";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

/** ===== schema-ready types (unchanged) ===== */
export type ExpensePoint = { date: string; amount: number };
export type ExpenseCandle = { date: string; open: number; high: number; low: number; close: number };
export type ExpenseDataset = { area: ExpensePoint[]; candle: ExpenseCandle[] };

type Props = {
  title?: string;
  description?: string;
  data: { daily: ExpenseDataset; weekly: ExpenseDataset };
  height?: number;
  initialChart?: "area" | "candle";
  initialRange?: "daily" | "weekly";
  style?: StyleProp<ViewStyle>;
  onRangeChange?: (range: "daily" | "weekly") => void;
  dailyLimit?: number; // Daily spending limit (e.g., 200)
};

export default function ExpenseOverviewCard({
  title = "Expense Overview",
  description = "Daily & weekly analytics",
  data,
  height = 220,                  // 🔼 a bit taller to fit labels nicely
  initialChart = "area",
  initialRange = "weekly",
  style,
  onRangeChange,
  dailyLimit = 200,              // Default daily spending limit
}: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const [range, setRange] = React.useState<"daily" | "weekly">(initialRange);

  const setRangeSafe = (r: "daily" | "weekly") => {
    setRange(r);
    onRangeChange?.(r);
  };

  const areaData: LinePoint[] = (
    range === "weekly" ? data.weekly.area : data.daily.area
  ).map((p) => ({ x: p.date, y: p.amount }));

  const candleData = (
    range === "weekly" ? data.weekly.candle : data.daily.candle
  ).map((c) => ({ date: c.date, open: c.open, high: c.high, low: c.low, close: c.close }));

  // Bar chart data for daily view - single bar showing today's total spending
  const todayTotal = range === "daily" 
    ? data.daily.area.reduce((sum, p) => sum + p.amount, 0) 
    : 0;
  
  // Color changes to red if over limit
  const isOverLimit = todayTotal > dailyLimit;
  
  const barData: BarPoint[] = range === "daily" ? [
    {
      label: "Today",
      value: todayTotal,
      // Use theme chart colors (chart3 = red, chart1 = green)
      color: isOverLimit ? (colors.chart3 || "#FF3B30") : (colors.chart1 || (isDark ? "#34C759" : "#30D158")),
    }
  ] : [];

  return (
    <ChartContainer
      title={title}
      description={description}
      // Use theme card color for the container so charts are on matte surfaces
      style={[{ backgroundColor: colors.card }, style]}
    >
      {/* Daily | Weekly segment */}
      <View
        style={{
          flexDirection: "row",
          alignSelf: "flex-start",
          padding: 4,
          borderRadius: 999,
          backgroundColor: colors.surface,
          marginBottom: 12,
        }}
      >
        <Segment
          label="Daily"
          active={range === "daily"}
          onPress={() => setRangeSafe("daily")}
          activeColor={isDark ? colors.primary : "#0b1220"}
          inactiveColor={colors.text}
          isDark={isDark}
        />
        <Segment
          label="Weekly"
          active={range === "weekly"}
          onPress={() => setRangeSafe("weekly")}
          activeColor={isDark ? colors.primary : "#0b1220"}
          inactiveColor={colors.text}
          isDark={isDark}
        />
      </View>

      {/* Conditional rendering: Bar chart for daily, Area/Candle switcher for weekly */}
      {range === "daily" ? (
        <View
          style={{
            width: "100%",
            height: height - 20,
            borderRadius: 12,
            // chart surface uses theme card for matte look
            backgroundColor: colors.card,
            padding: 8,
            shadowColor: isDark ? colors.accent : "#000",
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <BarChart
            data={barData}
            dailyLimit={dailyLimit}
            config={{
              height: height - 36,
              padding: 24,
              showLabels: true,
              animated: true,
              duration: 600,
            }}
            style={{
              width: "100%",
              height: height - 36,
              borderRadius: 8,
            }}
          />
        </View>
      ) : (
        <ChartSwitcher
          height={height}
          bg={isDark ? colors.card : "#ffffff"}
          pill={isDark ? "#0c1b33" : "#e8f1ff"}
          text={colors.text}
          textMuted={colors.text}
          initialKey={initialChart}
          tabs={[
            {
              key: "area",
              label: "Area",
              render: () => (
                  <AreaChart
                    data={areaData}
                    config={{
                      height: height - 20,
                      padding: 28,
                      showGrid: true,
                      showXLabels: true,
                      showYLabels: true,
                      showPoints: true,
                      formatX: (x: string | number) => String(x),
                      formatY: (y: number) => `$${y.toFixed(0)}`,
                    }}
                    style={{
                      width: "100%",
                      height: height - 20,
                      borderRadius: 12,
                      backgroundColor: colors.card,
                    }}
                  />
                ),
            },
            {
              key: "candle",
              label: "Candles",
                render: () => (
                <CandlestickChart
                  data={candleData}
                  config={{
                    height: height - 20,
                    padding: 20,
                    showGrid: true,
                    showLabels: true,
                    animated: true,
                    duration: 300,
                  }}
                  style={{
                    width: "100%",
                    height: height - 20,
                    borderRadius: 12,
                    backgroundColor: colors.card,
                  }}
                />
              ),
            },
          ]}
        />
      )}
    </ChartContainer>
  );
}

/** ------- tiny segmented button ------- */
function Segment({
  label,
  active,
  onPress,
  activeColor,
  inactiveColor,
  isDark,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
  isDark: boolean;
}) {
  const { colors: _colors, theme: _theme } = useAppTheme();
  const isDarkLocal = _theme === "dark";

  const handlePress = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: active ? _colors.surface : "transparent",
        borderWidth: active ? (isDarkLocal ? 0 : 1) : 0,
        borderColor: active ? (isDarkLocal ? "transparent" : "#dbeafe") : "transparent",
        marginRight: 6,
      }}
    >
      <Text
        style={{
          fontWeight: "800",
          fontSize: 12,
          color: active ? activeColor : inactiveColor,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
