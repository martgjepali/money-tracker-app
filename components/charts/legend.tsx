import React from "react";
import { Text, View } from "react-native";

type LegendItem = { label: string; value: number | string; color: string };

export function Legend({
  items,
  textColor = "#fff",
  gap = 12,
}: {
  items: LegendItem[];
  textColor?: string;
  gap?: number;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
      {items.map((it, i) => (
        <View
          key={i}
          style={{ flexDirection: "row", alignItems: "center", marginRight: gap, marginBottom: 6 }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: it.color,
              marginRight: 6,
            }}
          />
          <Text style={{ color: textColor, fontWeight: "600" }}>
            {it.label}: {it.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
