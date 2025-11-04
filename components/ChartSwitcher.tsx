import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { RectButton } from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

type Tab = {
  key: string;
  label: string;
  render: () => React.ReactNode;
};

type Props = {
  tabs: Tab[];
  initialKey?: string;
  height?: number; // fixes layout jumps while switching
  pillRadius?: number;
  duration?: number;
  gap?: number;
  // simple colors; you can wire to your theme if you prefer
  bg?: string;
  pill?: string;
  text?: string;
  textMuted?: string;
};

export default function ChartSwitcher({
  tabs,
  initialKey,
  height = 180,
  pillRadius = 10,
  duration = 220,
  gap = 10,
  bg = "#0b1220",
  pill = "#1f2a44",
  text = "#fff",
  textMuted = "rgba(255,255,255,0.6)",
}: Props) {
  const keys = useMemo(() => tabs.map((t) => t.key), [tabs]);
  const [activeKey, setActiveKey] = useState<string>(initialKey ?? keys[0]);

  // progress goes from index(active) relative to 0..n-1
  const activeIndex = keys.indexOf(activeKey);
  const progress = useSharedValue(activeIndex);

  // When activeKey changes, animate to its index
  React.useEffect(() => {
    const idx = keys.indexOf(activeKey);
    progress.value = withTiming(idx, { duration });
  }, [activeKey]);

  return (
    <View style={{ width: "100%" }}>
      {/* Segmented control */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: pill,
          borderRadius: pillRadius,
          padding: 4,
          marginBottom: 12,
        }}
      >
        {tabs.map((t, i) => {
          const isActive = t.key === activeKey;
          return (
            <RectButton
              key={t.key}
              onPress={() => setActiveKey(t.key)}
              rippleColor={isActive ? bg : undefined}
              style={{
                flex: 1,
                paddingVertical: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isActive ? bg : "transparent",
                borderRadius: pillRadius - 4,
              }}
            >
              <Animated.Text
                style={{
                  color: isActive ? text : textMuted,
                  fontWeight: "700",
                }}
              >
                {t.label}
              </Animated.Text>
            </RectButton>
          );
        })}
      </View>

      {/* Switching stage */}
      <View
        style={{
          height,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {tabs.map((t, i) => {
          // Each chart layer animates opacity + slight horizontal slide
          const s = useAnimatedStyle(() => {
            const opacity = interpolate(
              progress.value,
              [i - 1, i, i + 1],
              [0, 1, 0]
            );
            const translateX = interpolate(
              progress.value,
              [i - 1, i, i + 1],
              [16, 0, -16]
            );
            return { opacity, transform: [{ translateX }] };
          });

          return (
            <Animated.View
              key={t.key}
              style={[
                {
                  position: "absolute",
                  inset: 0,
                  padding: gap,
                },
                s,
              ]}
              pointerEvents={activeKey === t.key ? "auto" : "none"}
            >
              {t.render()}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}
