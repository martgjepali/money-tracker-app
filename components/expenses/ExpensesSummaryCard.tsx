import { useAppTheme } from "@/app/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

interface ExpensesSummaryCardProps {
  totalExpenses: number;
  transactionCount: number;
  budget?: number;
  onBudgetPress?: () => void;
}

export function ExpensesSummaryCard({
  totalExpenses,
  transactionCount,
  budget,
  onBudgetPress,
}: ExpensesSummaryCardProps) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  const budgetPercentage = budget ? (totalExpenses / budget) * 100 : 0;
  const isOverBudget = budgetPercentage > 100;

  const handleBudgetPress = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    onBudgetPress?.();
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: isDark ? "transparent" : "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <LinearGradient
          colors={["#EF4444", "#DC2626"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <MaterialCommunityIcons name="wallet-outline" size={28} color="#fff" />
        </LinearGradient>

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 4 }}>
            Total Expenses
          </Text>
          <Text style={{ color: colors.text, fontSize: 32, fontWeight: "900" }}>
            ${totalExpenses.toLocaleString()}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: isDark ? "#1e3a5f" : "#e5e7eb",
        }}
      >
        <View>
          <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 4 }}>
            Transactions
          </Text>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>
            {transactionCount}
          </Text>
        </View>

        <Pressable
          onPress={handleBudgetPress}
          style={{
            alignItems: "flex-end",
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 8,
          }}
        >
          {budget ? (
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 4 }}>
                Budget Status
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text
                  style={{
                    color: isOverBudget ? "#EF4444" : "#10B981",
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  {budgetPercentage.toFixed(0)}%
                </Text>
                <MaterialCommunityIcons name="pencil" size={16} color={colors.muted} />
              </View>
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#10B981" />
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
                Set Budget
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {budget && (
        <View style={{ marginTop: 16 }}>
          <View
            style={{
              height: 8,
              backgroundColor: isDark ? "#1e3a5f" : "#e2e8f0",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${Math.min(budgetPercentage, 100)}%`,
                backgroundColor: isOverBudget ? "#EF4444" : "#10B981",
              }}
            />
          </View>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8, textAlign: "center" }}>
            ${totalExpenses.toLocaleString()} of ${budget.toLocaleString()} budget
            {isOverBudget && " (Over Budget!)"}
          </Text>
        </View>
      )}
    </View>
  );
}
