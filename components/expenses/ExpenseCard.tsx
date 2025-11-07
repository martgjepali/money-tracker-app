import { useAppTheme } from "@/app/providers/ThemeProvider";
import { ExpenseCategory, expenseTypes } from "@/types/expense";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

interface ExpenseCardProps {
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function ExpenseCard({ amount, category, description, date, onPress, onLongPress }: ExpenseCardProps) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const expenseType = expenseTypes.find((t) => t.id === category);

  const handlePress = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    onPress?.();
  };

  const handleLongPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }
    onLongPress?.();
  };

  return (
    <RectButton
      onPress={handlePress}
      onLongPress={handleLongPress}
      rippleColor={isDark ? "#0b1220" : "#e6f6ff"}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: isDark ? "transparent" : "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Icon with gradient background */}
        <LinearGradient
          colors={[expenseType?.color || "#94A3B8", expenseType?.color + "80" || "#94A3B880"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <MaterialCommunityIcons
            name={expenseType?.icon as any || "dots-horizontal"}
            size={24}
            color="#fff"
          />
        </LinearGradient>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700", marginBottom: 4 }}>
            {expenseType?.label || "Other"}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 13 }} numberOfLines={1}>
            {description}
          </Text>
        </View>

        {/* Amount */}
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              color: expenseType?.color || "#94A3B8",
              fontSize: 18,
              fontWeight: "800",
              marginBottom: 2,
            }}
          >
            -${amount.toLocaleString()}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>
            {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </Text>
        </View>
      </View>
    </RectButton>
  );
}
