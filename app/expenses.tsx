import { useAppTheme } from "@/app/providers/ThemeProvider";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { BudgetModal } from "@/components/expenses/BudgetModal";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { ExpensesEmptyState } from "@/components/expenses/ExpensesEmptyState";
import { ExpensesSummaryCard } from "@/components/expenses/ExpensesSummaryCard";
import { useAuthGuard } from "@/hooks/useAuthGuard";
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
    TouchableOpacity,
    View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExpensesScreen() {
  // Protect this route
  const isAuthenticated = useAuthGuard();
  
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();

  if (!isAuthenticated) {
    return null;
  }
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [budget, setBudget] = useState<number | undefined>(1000); // Sample budget
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

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

  // Pagination logic
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = expenses.slice(startIndex, endIndex);

  const handleNextPage = async () => {
    if (currentPage < totalPages - 1) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        /* ignore */
      }
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = async () => {
    if (currentPage > 0) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        /* ignore */
      }
      setCurrentPage(currentPage - 1);
    }
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
    setCurrentPage(0); // Reset to first page when adding new expense
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
        data={currentItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {expenses.length > 0 && renderHeader()}
            {expenses.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 20,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Recent Expenses ({expenses.length})
                </Text>
                {totalPages > 1 && (
                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 14,
                    }}
                  >
                    Page {currentPage + 1} of {totalPages}
                  </Text>
                )}
              </View>
            )}
          </>
        }
        ListEmptyComponent={<ExpensesEmptyState />}
        ListFooterComponent={
          expenses.length > itemsPerPage ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 80,
                paddingHorizontal: 4,
              }}
            >
              <TouchableOpacity
                onPress={handlePreviousPage}
                disabled={currentPage === 0}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: currentPage === 0 ? "transparent" : "#EF444415",
                  opacity: currentPage === 0 ? 0.5 : 1,
                }}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={20}
                  color={currentPage === 0 ? colors.muted : "#EF4444"}
                />
                <Text
                  style={{
                    color: currentPage === 0 ? colors.muted : "#EF4444",
                    fontSize: 14,
                    fontWeight: "600",
                    marginLeft: 4,
                  }}
                >
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: currentPage >= totalPages - 1 ? "transparent" : "#EF444415",
                  opacity: currentPage >= totalPages - 1 ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    color: currentPage >= totalPages - 1 ? colors.muted : "#EF4444",
                    fontSize: 14,
                    fontWeight: "600",
                    marginRight: 4,
                  }}
                >
                  Next
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={currentPage >= totalPages - 1 ? colors.muted : "#EF4444"}
                />
              </TouchableOpacity>
            </View>
          ) : null
        }
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
