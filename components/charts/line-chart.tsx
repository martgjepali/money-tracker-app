// components/charts/line-chart.tsx
import { useColor } from "@/hooks/useColor";
import React, { useMemo } from "react";
import { View, ViewStyle } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Line as SvgLine,
  Text as SvgText,
} from "react-native-svg";

export type LinePoint = { x: string | number; y: number };

export interface LineChartConfig {
  width?: number;
  height?: number;
  padding?: number;

  // visuals
  gradient?: boolean;
  showGrid?: boolean;
  showXLabels?: boolean;
  showYLabels?: boolean;
  showPoints?: boolean;

  // axes/labels
  yTicks?: number; // number of horizontal grid lines / y labels
  formatX?: (x: string | number) => string;
  formatY?: (y: number) => string;
}

type Props = {
  data: LinePoint[];
  config?: LineChartConfig;
  style?: ViewStyle;
};

export const LineChart = ({ data, config = {}, style }: Props) => {
  const primary = useColor("green");        // line color
  const fillDown = useColor("green");       // gradient base
  const gridColor = useColor("mutedForeground");

  const {
    width = 300,
    height = 240,          // give more room for labels by default
    padding = 28,
    gradient = true,
    showGrid = true,
    showXLabels = true,
    showYLabels = true,
    showPoints = false,
    yTicks = 4,
    formatX = (x) => String(x),
    formatY = (y: number) => y.toFixed(0),
  } = config;

  const safeData = Array.isArray(data) ? data : [];

  const {
    pathD,
    fillPath,
    xs,
    ys,
    minY,
    maxY,
    xAt,
    yAt,
    innerW,
    innerH,
  } = useMemo(() => {
    const xsIdx = safeData.map((_, i) => i);
    const ysVals = safeData.map((p) => p.y);

    const min = ysVals.length ? Math.min(...ysVals) : 0;
    const max = ysVals.length ? Math.max(...ysVals) : 1;
    const rangeY = Math.max(1, max - min);

    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;

    const xPos = (i: number) =>
      padding + (i / Math.max(1, safeData.length - 1)) * innerWidth;
    const yPos = (v: number) =>
      padding + (1 - (v - min) / rangeY) * innerHeight;

    // Smooth curve with Catmull-Rom → cubic Bezier
    const toCubic = (pts: { x: number; y: number }[]) => {
      if (pts.length < 2) return "";
      const p = pts;
      let d = `M ${p[0].x} ${p[0].y}`;
      for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[i - 1] || p[i];
        const p1 = p[i];
        const p2 = p[i + 1];
        const p3 = p[i + 2] || p[i + 1];

        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
      }
      return d;
    };

    const pts = safeData.map((p, i) => ({ x: xPos(i), y: yPos(p.y) }));
    const path = pts.length ? toCubic(pts) : "";

    const fp =
      pts.length
        ? `${path} L ${xPos(pts.length - 1)} ${padding + innerHeight} L ${xPos(0)} ${padding + innerHeight} Z`
        : "";

    return {
      pathD: path,
      fillPath: fp,
      xs: xsIdx,
      ys: ysVals,
      minY: min,
      maxY: max,
      xAt: xPos,
      yAt: yPos,
      innerW: innerWidth,
      innerH: innerHeight,
    };
  }, [safeData, width, height, padding]);

  return (
    <View style={[{ width: "100%", height }, style]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="lc_grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={fillDown} stopOpacity={0.25} />
            <Stop offset="1" stopColor={fillDown} stopOpacity={0.05} />
          </LinearGradient>
        </Defs>

        {/* Plot background holder so layout is stable */}
        <Rect x={0} y={0} width={width} height={height} fill="transparent" />

        {/* Grid + Y labels */}
        {showGrid &&
          Array.from({ length: yTicks + 1 }).map((_, i) => {
            const ratio = i / yTicks;
            const y = padding + ratio * innerH;
            const val = maxY - ratio * (maxY - minY);
            return (
              <React.Fragment key={`grid-${i}`}>
                <SvgLine
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke={gridColor}
                  strokeWidth={0.5}
                  opacity={0.25}
                />
                {showYLabels && (
                  <SvgText
                    x={padding - 6}
                    y={y + 4}
                    fontSize={10}
                    fill={gridColor}
                    textAnchor="end"
                  >
                    {formatY(val)}
                  </SvgText>
                )}
              </React.Fragment>
            );
          })}

        {/* X labels (spread across ~6 ticks) */}
        {showXLabels &&
          safeData.map((p, i) => {
            const step = Math.max(1, Math.floor(safeData.length / 6));
            if (i % step !== 0) return null;
            const x = xAt(i);
            return (
              <SvgText
                key={`xlabel-${i}`}
                x={x}
                y={height - (padding - 8)}
                fontSize={10}
                fill={gridColor}
                textAnchor="middle"
              >
                {formatX(p.x)}
              </SvgText>
            );
          })}

        {/* Filled area */}
        {gradient && fillPath ? (
          <Path d={fillPath} fill="url(#lc_grad)" />
        ) : null}

        {/* Smooth stroke path */}
        {pathD ? (
          <Path d={pathD} stroke={primary} strokeWidth={2} fill="none" />
        ) : null}

        {/* Optional points */}
        {showPoints &&
          safeData.map((p, i) => (
            <Circle
              key={`pt-${i}`}
              cx={xAt(i)}
              cy={yAt(p.y)}
              r={3}
              fill={primary}
              opacity={0.9}
            />
          ))}
      </Svg>
    </View>
  );
};

export default LineChart;
