import { useAppTheme } from "@/app/providers/ThemeProvider";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { BudgetModal } from "@/components/expenses/BudgetModal";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { ExpensesEmptyState } from "@/components/expenses/ExpensesEmptyState";
import { ExpensesSummaryCard } from "@/components/expenses/ExpensesSummaryCard";
import { Expense } from "@/types/expense";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    Text,
    View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExpensesScreen() {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [budget, setBudget] = useState<number | undefined>(1000); // Sample budget

  // Sample data - replace with actual database queries
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      amount: 45.99,
      category: "food",
      description: "Lunch at Italian restaurant",
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      amount: 89.50,
      category: "shopping",
      description: "New running shoes",
      date: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      amount: 120.00,
      category: "bills",
      description: "Internet and phone bill",
      date: new Date(Date.now() - 172800000).toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);

  const statistics = {
    total: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    count: expenses.length,
  };

  const handleAddExpense = async (expenseData: {
    amount: number;
    category: Expense["category"];
    description: string;
    date: string;
  }) => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      /* ignore */
    }

    const newExpense: Expense = {
      id: Math.random().toString(),
      ...expenseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setExpenses([newExpense, ...expenses]);
    setModalVisible(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call - replace with actual data fetching
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleOpenModal = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }
    setModalVisible(true);
  };

  const handleBudgetPress = () => {
    setBudgetModalVisible(true);
  };

  const handleSaveBudget = async (newBudget: number | undefined) => {
    setBudget(newBudget);
    // TODO: Save to database
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      /* ignore */
    }
  };

  const handlePressExpense = (item: Expense) => {
    // TODO: Navigate to expense details or edit
    console.log("Pressed expense:", item);
  };

  const handleLongPressExpense = (item: Expense) => {
    // TODO: Show delete/edit options
    console.log("Long pressed expense:", item);
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <ExpenseCard
      amount={item.amount}
      category={item.category}
      description={item.description}
      date={item.date}
      onPress={() => handlePressExpense(item)}
      onLongPress={() => handleLongPressExpense(item)}
    />
  );

  const renderHeader = () => (
    <ExpensesSummaryCard
      totalExpenses={statistics.total}
      transactionCount={statistics.count}
      budget={budget}
      onBudgetPress={handleBudgetPress}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: "800" }}>
          Expenses
        </Text>
        <Text style={{ color: colors.muted, fontSize: 14, marginTop: 4 }}>
          Track and manage your spending
        </Text>
      </View>

      {/* Content */}
      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={expenses.length > 0 ? renderHeader : null}
        ListEmptyComponent={<ExpensesEmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 140,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <RectButton
        onPress={handleOpenModal}
        rippleColor="#EF444430"
        style={{
          position: "absolute",
          right: 20,
          bottom: Math.max(100, insets.bottom + 88),
          width: 60,
          height: 60,
          borderRadius: 30,
          overflow: "hidden",
          zIndex: 100,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "#EF4444",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#EF4444",
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <MaterialCommunityIcons name="plus" size={32} color="#ffffff" />
        </View>
      </RectButton>

      {/* Add Expense Modal */}
      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddExpense}
      />

      {/* Budget Modal */}
      <BudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        currentBudget={budget}
        onSave={handleSaveBudget}
      />
    </SafeAreaView>
  );
}
