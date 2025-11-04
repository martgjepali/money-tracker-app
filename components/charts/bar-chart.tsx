// components/charts/bar-chart.tsx
import { useColor } from "@/hooks/useColor";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { G, Rect, Text as SvgText } from "react-native-svg";

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
};

export const BarChart = ({ data, config = {}, style }: Props) => {
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

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const innerChartWidth = chartWidth - padding * 2;
  const chartHeight = height - padding * 2;
  const barWidth = (innerChartWidth / data.length) * 0.8;
  const barSpacing = (innerChartWidth / data.length) * 0.2;

  return (
    <View style={[{ width: "100%", height }, style]} onLayout={handleLayout}>
      <Svg width={chartWidth} height={height}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
          const y = height - padding - barHeight;

          return (
            <Bar
              key={`bar-${index}`}
              x={x}
              y={y}
              barWidth={barWidth}
              barHeight={barHeight}
              fill={item.color || primaryColor}
              showLabels={showLabels}
              label={item.label}
              value={item.value}
              baseY={height - 5}
              mutCol={mutedColor}
              animationProgress={animationProgress as SV<number>}
            />
          );
        })}
      </Svg>
    </View>
  );
};

function Bar({
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
}: {
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
  // 👇 use our version-agnostic SharedValue shape
  animationProgress: SV<number>;
}) {
  const barAnimatedProps = useAnimatedProps(() => ({
    height: Math.max(1, animationProgress.value * barHeight),
    y: y + (barHeight - Math.max(1, animationProgress.value * barHeight)),
  }));

  return (
    <G>
      <AnimatedRect x={x} width={barWidth} rx={4} fill={fill} animatedProps={barAnimatedProps} />
      {showLabels && (
        <>
          <SvgText x={x + barWidth / 2} y={baseY} textAnchor="middle" fontSize={12} fill={mutCol}>
            {label}
          </SvgText>
          <SvgText x={x + barWidth / 2} y={y - 5} textAnchor="middle" fontSize={11} fill={mutCol} fontWeight="600">
            {value}
          </SvgText>
        </>
      )}
    </G>
  );
}
