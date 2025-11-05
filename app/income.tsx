// app/income.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import AddIncomeModal from "@/components/income/AddIncomeModal";
import IncomeCard from "@/components/income/IncomeCard";
import IncomeEmptyState from "@/components/income/IncomeEmptyState";
import IncomeSummaryCard from "@/components/income/IncomeSummaryCard";
import type { CreateIncomeInput, Income } from "@/types/income";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
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

export default function IncomeScreen() {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sample data - replace with actual data from your database
  const [incomes, setIncomes] = useState<Income[]>([
    {
      id: "1",
      amount: 5000,
      type: "Salary",
      date: "2025-11-01T00:00:00.000Z",
      description: "Monthly salary November",
      createdAt: "2025-11-01T00:00:00.000Z",
      updatedAt: "2025-11-01T00:00:00.000Z",
      icon: "briefcase",
      color: "#34C759",
    },
    {
      id: "2",
      amount: 1500,
      type: "Freelance",
      date: "2025-10-28T00:00:00.000Z",
      description: "Website development project",
      createdAt: "2025-10-28T00:00:00.000Z",
      updatedAt: "2025-10-28T00:00:00.000Z",
      icon: "laptop",
      color: "#5856D6",
    },
    {
      id: "3",
      amount: 250,
      type: "Investment",
      date: "2025-10-25T00:00:00.000Z",
      description: "Stock dividends",
      createdAt: "2025-10-25T00:00:00.000Z",
      updatedAt: "2025-10-25T00:00:00.000Z",
      icon: "chart-line",
      color: "#FF9500",
    },
  ]);

  // Calculate statistics
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyIncome = incomes
    .filter((income) => {
      const incomeDate = new Date(income.date);
      return (
        incomeDate.getMonth() === currentMonth &&
        incomeDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, income) => sum + income.amount, 0);

  const transactionCount = incomes.length;
  const averageIncome = transactionCount > 0 ? totalIncome / transactionCount : 0;

  const handleAddIncome = (incomeData: CreateIncomeInput) => {
    const newIncome: Income = {
      id: Date.now().toString(),
      amount: incomeData.amount,
      type: incomeData.type,
      date: incomeData.date,
      description: incomeData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: incomeData.icon,
      color: incomeData.color,
    };

    setIncomes([newIncome, ...incomes]);
    setModalVisible(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call - replace with actual data fetch
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleOpenModal = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      /* ignore */
    }
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#010817" : "#f0f4f8",
      }}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#010817" : "#f0f4f8"}
      />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 28,
            fontWeight: "800",
          }}
        >
          Income
        </Text>
        <Text
          style={{
            color: colors.muted,
            fontSize: 14,
            marginTop: 2,
          }}
        >
          Track your earnings
        </Text>
      </View>

      {/* Content */}
      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <IncomeSummaryCard
            totalIncome={totalIncome}
            monthlyIncome={monthlyIncome}
            transactionCount={transactionCount}
            averageIncome={averageIncome}
          />
        }
        renderItem={({ item }) => <IncomeCard income={item} />}
        ListEmptyComponent={<IncomeEmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      {/* Floating Action Button */}
      <RectButton
        onPress={handleOpenModal}
        rippleColor={`${colors.primary}30`}
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
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: colors.primary,
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <MaterialCommunityIcons name="plus" size={32} color="#ffffff" />
        </View>
      </RectButton>

      {/* Add Income Modal */}
      <AddIncomeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleAddIncome}
      />
    </SafeAreaView>
  );
}
