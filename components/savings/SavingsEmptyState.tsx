// components/savings/SavingsEmptyState.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { Text } from "@/components/ui/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

export default function SavingsEmptyState() {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
        paddingVertical: 60,
      }}
    >
      {/* Floating Badge Container */}
      <View
        style={{
          width: 200,
          height: 200,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        {/* Glow circles */}
        <View
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: "#FFD60A",
            opacity: 0.08,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: "#FFD60A",
            opacity: 0.12,
          }}
        />

        {/* Main Icon */}
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#FFD60A",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#FFD60A",
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <MaterialCommunityIcons name="piggy-bank" size={50} color="#fff" />
        </View>

        {/* Floating Badges */}
        <View
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#FF9500",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#FF9500",
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <MaterialCommunityIcons name="shield-alert" size={24} color="#fff" />
        </View>

        <View
          style={{
            position: "absolute",
            top: 20,
            right: 0,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#34C759",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#34C759",
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <MaterialCommunityIcons name="account-clock" size={24} color="#fff" />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 10,
            left: 20,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#5856D6",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#5856D6",
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <MaterialCommunityIcons name="airplane" size={24} color="#fff" />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 10,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#32ADE6",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#32ADE6",
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <MaterialCommunityIcons name="home-city" size={24} color="#fff" />
        </View>
      </View>

      {/* Text Content */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: colors.text,
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Start Saving Today
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: colors.muted,
          textAlign: "center",
          lineHeight: 24,
        }}
      >
        Build your financial future one deposit at a time. Track emergency funds, vacation goals,
        retirement, and more.
      </Text>
    </View>
  );
}
