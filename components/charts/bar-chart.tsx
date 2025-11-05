// components/charts/bar-chart.tsx
import { useColor } from "@/hooks/useColor";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Defs, G, LinearGradient, Rect, Stop, Text as SvgText } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

// 👇 Version-agnostic SharedValue type
type SV<T> = { value: T };

interface ChartConfig {
  width?: number;
  height?: number;
  padding?: number;
  showLabels?: boolean;
  animated?: boolean;
  duration?: number;
}

export interface BarPoint {
  label: string;
  value: number;
  color?: string;
}

type Props = {
  data: BarPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
  dailyLimit?: number; // Daily spending limit (e.g., 200)
};

export const BarChart = ({ data, config = {}, style, dailyLimit }: Props) => {
  const [containerWidth, setContainerWidth] = useState(300);
  const { height = 200, padding = 20, showLabels = true, animated = true, duration = 800 } = config;

  const chartWidth = containerWidth || config.width || 300;
  const primaryColor = useColor("primary");
  const mutedColor = useColor("mutedForeground");
  const animationProgress = useSharedValue(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) setContainerWidth(width);
  };

  useEffect(() => {
    animationProgress.value = animated ? withTiming(1, { duration }) : 1;
  }, [data, animated, duration]);

  if (!data || data.length === 0) {
    return <View style={[{ width: "100%", height }, style]} onLayout={handleLayout} />;
  }

  // Use dailyLimit for scaling if provided, otherwise use max data value
  const maxValue = dailyLimit || Math.max(...data.map((d) => d.value), 1);
  const innerChartWidth = chartWidth - padding * 2;
  const chartHeight = height - padding * 2;
  
  // For single bar (today's total), make it thinner and centered
  const isSingleBar = data.length === 1;
  const barWidth = isSingleBar 
    ? Math.min(innerChartWidth * 0.25, 60) // 25% of width, max 60px for single bar (thinner)
    : (innerChartWidth / data.length) * 0.8;
  const barSpacing = isSingleBar 
    ? 0 
    : (innerChartWidth / data.length) * 0.2;

  return (
    <View style={[{ width: "100%", height }, style]} onLayout={handleLayout}>
      <Svg width={chartWidth} height={height}>
        <Defs>
          {data.map((item, index) => {
            const baseColor = item.color || primaryColor;
            return (
              <LinearGradient key={`grad-${index}`} id={`barGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={baseColor} stopOpacity={0.95} />
                <Stop offset="1" stopColor={baseColor} stopOpacity={0.65} />
              </LinearGradient>
            );
          })}
        </Defs>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          // Center single bar horizontally
          const x = isSingleBar 
            ? (chartWidth - barWidth) / 2 
            : padding + index * (barWidth + barSpacing) + barSpacing / 2;
          const y = height - padding - barHeight;
          
          // Check if limit is exceeded
          const isOverLimit = !!(dailyLimit && item.value > dailyLimit);
          const barColor = isOverLimit ? "#FF3B30" : (item.color || primaryColor);

          return (
            <Bar
              key={`bar-${index}`}
              index={index}
              x={x}
              y={y}
              barWidth={barWidth}
              barHeight={barHeight}
              fill={barColor}
              showLabels={showLabels}
              label={item.label}
              value={item.value}
              baseY={height - 5}
              mutCol={mutedColor}
              animationProgress={animationProgress as SV<number>}
              isSingleBar={isSingleBar}
              isOverLimit={isOverLimit}
              dailyLimit={dailyLimit}
            />
          );
        })}
      </Svg>
    </View>
  );
};

function Bar({
  index,
  x,
  y,
  barWidth,
  barHeight,
  fill,
  showLabels,
  label,
  value,
  baseY,
  mutCol,
  animationProgress,
  isSingleBar,
  isOverLimit,
  dailyLimit,
}: {
  index: number;
  x: number;
  y: number;
  barWidth: number;
  barHeight: number;
  fill: string;
  showLabels: boolean;
  label: string;
  value: number;
  baseY: number;
  mutCol: string;
  animationProgress: SV<number>;
  isSingleBar?: boolean;
  isOverLimit?: boolean;
  dailyLimit?: number;
}) {
  const barAnimatedProps = useAnimatedProps(() => ({
    height: Math.max(1, animationProgress.value * barHeight),
    y: y + (barHeight - Math.max(1, animationProgress.value * barHeight)),
  }));

  // Moderate glow for single bar
  const glowSize = isSingleBar ? 3 : 1;
  const cornerRadius = isSingleBar ? 8 : 5;

  return (
    <G>
      {/* Glow effect behind the bar - stronger if over limit */}
      <AnimatedRect
        x={x - glowSize}
        width={barWidth + glowSize * 2}
        rx={cornerRadius + 2}
        fill={fill}
        opacity={isOverLimit ? 0.4 : (isSingleBar ? 0.25 : 0.2)}
        animatedProps={barAnimatedProps}
      />
      {/* Main bar with gradient */}
      <AnimatedRect
        x={x}
        width={barWidth}
        rx={cornerRadius}
        fill={`url(#barGrad-${index})`}
        animatedProps={barAnimatedProps}
      />
      {showLabels && (
        <>
          <SvgText 
            x={x + barWidth / 2} 
            y={baseY} 
            textAnchor="middle" 
            fontSize={isSingleBar ? 13 : 10} 
            fill={mutCol} 
            opacity={0.8}
            fontWeight={isSingleBar ? "600" : "400"}
          >
            {label}
          </SvgText>
          <SvgText 
            x={x + barWidth / 2} 
            y={y - (isSingleBar ? 10 : 8)} 
            textAnchor="middle" 
            fontSize={isSingleBar ? 16 : 12} 
            fill={fill} 
            fontWeight="700"
          >
            {`$${value.toLocaleString()}`}
          </SvgText>
          {/* Show limit warning if exceeded */}
          {isOverLimit && dailyLimit && isSingleBar && (
            <SvgText 
              x={x + barWidth / 2} 
              y={y - 28} 
              textAnchor="middle" 
              fontSize={11} 
              fill="#FF3B30" 
              fontWeight="700"
            >
              {`Over $${dailyLimit} limit!`}
            </SvgText>
          )}
        </>
      )}
    </G>
  );
}
