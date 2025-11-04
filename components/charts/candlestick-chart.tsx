// components/charts/candlestick-chart.tsx
import { useColor } from "@/hooks/useColor";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { G, Line, Rect, Text as SvgText } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedLine = Animated.createAnimatedComponent(Line);

// 👇 Version-agnostic SharedValue type
type SV<T> = { value: T };

interface ChartConfig {
  width?: number;
  height?: number;
  padding?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  animated?: boolean;
  duration?: number;
}

export interface CandlestickDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

type Props = {
  data: CandlestickDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
  labelFormatter?: (raw: string) => string; // 👈 NEW
};

export const CandlestickChart = ({
  data,
  config = {},
  style,
  labelFormatter,
}: Props) => {
  const [containerWidth, setContainerWidth] = useState(300);

  const {
    height = 200,
    padding = 20,
    showGrid = true,
    showLabels = true,
    animated = true,
    duration = 800,
  } = config;

  const chartWidth = containerWidth || config.width || 300;

  const bullishColor = useColor("green");
  const bearishColor = useColor("red");
  const mutedColor = useColor("mutedForeground");

  const animationProgress = useSharedValue(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) setContainerWidth(width);
  };

  useEffect(() => {
    animationProgress.value = animated ? withTiming(1, { duration }) : 1;
  }, [data, animated, duration]);

  if (!data || data.length === 0) {
    return (
      <View
        style={[{ width: "100%", height }, style]}
        onLayout={handleLayout}
      />
    );
  }

  const allValues = data.flatMap((d) => [d.open, d.high, d.low, d.close]);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const valueRange = maxValue - minValue || 1;

  const innerChartWidth = chartWidth - padding * 2;
  const chartHeight = height - padding * 2;
  const candleWidth = (innerChartWidth / data.length) * 0.6;
  const candleSpacing = (innerChartWidth / data.length) * 0.4;

  return (
    <View style={[{ width: "100%", height }, style]} onLayout={handleLayout}>
      <Svg width={chartWidth} height={height}>
        {/* Grid */}
        {showGrid && (
          <G>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <Line
                key={`grid-${i}`}
                x1={padding}
                y1={padding + ratio * chartHeight}
                x2={chartWidth - padding}
                y2={padding + ratio * chartHeight}
                stroke={mutedColor}
                strokeWidth={0.5}
                opacity={0.3}
              />
            ))}
          </G>
        )}

        {/* Candles */}
        {data.map((item, index) => {
          const isBullish = item.close >= item.open;
          const color = isBullish ? bullishColor : bearishColor;

          const x =
            padding + index * (candleWidth + candleSpacing) + candleSpacing / 2;
          const highY =
            padding + ((maxValue - item.high) / valueRange) * chartHeight;
          const lowY =
            padding + ((maxValue - item.low) / valueRange) * chartHeight;
          const openY =
            padding + ((maxValue - item.open) / valueRange) * chartHeight;
          const closeY =
            padding + ((maxValue - item.close) / valueRange) * chartHeight;
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.max(1, Math.abs(closeY - openY));

          return (
            <Candle
              key={`candle-${index}`}
              x={x}
              width={candleWidth}
              highY={highY}
              lowY={lowY}
              bodyTop={bodyTop}
              bodyHeight={bodyHeight}
              color={color}
              showLabel={
                showLabels &&
                index % Math.max(1, Math.floor(data.length / 5)) === 0
              }
              label={labelFormatter ? labelFormatter(item.date) : item.date} // 👈
              labelY={height - 5}
              labelColor={mutedColor}
              animationProgress={animationProgress as SV<number>}
            />
          );
        })}
      </Svg>
    </View>
  );
};

function Candle({
  x,
  width,
  highY,
  lowY,
  bodyTop,
  bodyHeight,
  color,
  showLabel,
  label,
  labelY,
  labelColor,
  animationProgress,
}: {
  x: number;
  width: number;
  highY: number;
  lowY: number;
  bodyTop: number;
  bodyHeight: number;
  color: string;
  showLabel: boolean;
  label: string;
  labelY: number;
  labelColor: string;
  // 👇 version-agnostic SharedValue shape
  animationProgress: SV<number>;
}) {
  const wickAnimatedProps = useAnimatedProps(() => ({
    y1: highY,
    y2: lowY,
    opacity: animationProgress.value,
  }));

  const bodyAnimatedProps = useAnimatedProps(() => ({
    y: bodyTop,
    height: Math.max(1, animationProgress.value * bodyHeight),
    opacity: animationProgress.value,
  }));

  return (
    <G>
      <AnimatedLine
        x1={x + width / 2}
        x2={x + width / 2}
        stroke={color}
        strokeWidth={1}
        animatedProps={wickAnimatedProps}
      />
      <AnimatedRect
        x={x}
        width={width}
        fill={color}
        stroke={color}
        strokeWidth={1}
        animatedProps={bodyAnimatedProps}
      />
      {showLabel && (
        <SvgText
          x={x + width / 2}
          y={labelY}
          textAnchor="middle"
          fontSize={10}
          fill={labelColor}
        >
          {label}
        </SvgText>
      )}
    </G>
  );
}
