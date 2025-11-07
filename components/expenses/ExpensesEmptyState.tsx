import { useAppTheme } from "@/app/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export function ExpensesEmptyState() {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 32,
      }}
    >
      <LinearGradient
        colors={["#EF4444", "#DC2626"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          shadowColor: "#EF4444",
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <MaterialCommunityIcons name="wallet-outline" size={60} color="#fff" />
      </LinearGradient>

      <Text
        style={{
          color: colors.text,
          fontSize: 24,
          fontWeight: "800",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        No Expenses Yet
      </Text>

      <Text
        style={{
          color: colors.muted,
          fontSize: 16,
          textAlign: "center",
          lineHeight: 24,
        }}
      >
        Start tracking your spending by adding your first expense. Tap the + button below!
      </Text>

      <View
        style={{
          marginTop: 32,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 12,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: isDark ? "#1e3a5f" : "#e5e7eb",
        }}
      >
        <Text
          style={{
            color: "#EF4444",
            fontSize: 14,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          💡 Track • Analyze • Save
        </Text>
      </View>
    </View>
  );
}
