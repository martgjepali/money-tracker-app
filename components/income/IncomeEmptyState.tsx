// components/income/IncomeEmptyState.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function IncomeEmptyState() {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 80,
        paddingHorizontal: 40,
      }}
    >
      {/* Futuristic Icon Stack */}
      <View style={{ position: "relative", marginBottom: 24 }}>
        {/* Background glow circles */}
        <View
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: `${colors.primary}15`,
            top: -20,
            left: -20,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: `${colors.accent}10`,
            top: 0,
            left: 0,
          }}
        />

        {/* Main icon */}
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: isDark ? "#0a1830" : "#f8fbff",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: isDark ? "#1f2b44" : "#e9eef7",
          }}
        >
          <MaterialCommunityIcons
            name="cash-plus"
            size={48}
            color={colors.primary}
          />
        </View>

        {/* Floating icon badges */}
        <View
          style={{
            position: "absolute",
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#34C759",
            alignItems: "center",
            justifyContent: "center",
            top: -8,
            right: -8,
            shadowColor: "#34C759",
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <MaterialCommunityIcons name="briefcase" size={16} color="#ffffff" />
        </View>

        <View
          style={{
            position: "absolute",
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#5856D6",
            alignItems: "center",
            justifyContent: "center",
            bottom: -8,
            left: -8,
            shadowColor: "#5856D6",
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <MaterialCommunityIcons name="laptop" size={16} color="#ffffff" />
        </View>

        <View
          style={{
            position: "absolute",
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#FF9500",
            alignItems: "center",
            justifyContent: "center",
            bottom: 10,
            right: -10,
            shadowColor: "#FF9500",
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <MaterialCommunityIcons name="chart-line" size={16} color="#ffffff" />
        </View>
      </View>

      {/* Text */}
      <Text
        style={{
          color: colors.text,
          fontSize: 22,
          fontWeight: "800",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Start Your Journey
      </Text>
      <Text
        style={{
          color: colors.muted,
          fontSize: 15,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        Track your earnings and watch your{"\n"}wealth grow over time 🚀
      </Text>

      {/* Decorative elements */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 24,
          gap: 12,
        }}
      >
        {[colors.primary, colors.accent, "#34C759"].map((color, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: color,
              opacity: 0.5,
            }}
          />
        ))}
      </View>
    </View>
  );
}
