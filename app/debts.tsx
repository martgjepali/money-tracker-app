import AddDebtModal from "@/components/debts/AddDebtModal";
import DebtCard from "@/components/debts/DebtCard";
import DebtsEmptyState from "@/components/debts/DebtsEmptyState";
import DebtsSummaryCard from "@/components/debts/DebtsSummaryCard";
import type { CreateDebtInput, Debt } from "@/types/debt";
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
import { useAppTheme } from "./providers/ThemeProvider";

// Sample data
const SAMPLE_DEBTS: Debt[] = [
  {
    id: "1",
    name: "Credit Card - Chase",
    amount: 5000,
    interestRate: 18.5,
    minimumPayment: 150,
    status: "active",
    date: new Date(2023, 0, 15).toISOString(),
    isRecurring: true,
    recurringFrequency: "monthly",
    recurringAmount: 200,
    paidAmount: 2500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Student Loan",
    amount: 25000,
    interestRate: 4.5,
    minimumPayment: 300,
    status: "active",
    date: new Date(2020, 8, 1).toISOString(),
    isRecurring: true,
    recurringFrequency: "monthly",
    recurringAmount: 350,
    paidAmount: 8000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Personal Loan",
    amount: 3000,
    interestRate: 12,
    status: "paid",
    date: new Date(2023, 5, 20).toISOString(),
    isRecurring: false,
    paidAmount: 3000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function DebtsScreen() {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();

  const [debts, setDebts] = useState<Debt[]>(SAMPLE_DEBTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const totalDebts = debts.length;
  const activeDebts = debts.filter((d) => d.status === "active").length;
  const totalAmount = debts.reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = debts.reduce((sum, d) => sum + d.paidAmount, 0);

  const handleAddDebt = (debtData: CreateDebtInput) => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: debtData.name,
      amount: debtData.amount,
      interestRate: debtData.interestRate,
      minimumPayment: debtData.minimumPayment,
      status: debtData.status,
      date: debtData.date,
      isRecurring: debtData.isRecurring,
      recurringFrequency: debtData.recurringFrequency,
      recurringAmount: debtData.recurringAmount,
      paidAmount: debtData.paidAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDebts([newDebt, ...debts]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleFabPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#010817" : "#f0f4f8" }}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#010817" : "#f0f4f8"}
      />

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <Text
          style={{
            color: colors.text,
            fontSize: 28,
            fontWeight: "800",
          }}
        >
          Debts
        </Text>
      </View>

      {/* Debts List */}
      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          totalDebts > 0 ? (
            <DebtsSummaryCard
              totalDebts={totalDebts}
              activeDebts={activeDebts}
              totalAmount={totalAmount}
              totalPaid={totalPaid}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <DebtCard
            debt={item}
            onPress={() => {
              // Handle debt press
            }}
            onLongPress={() => {
              // Handle long press for edit/delete
            }}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: totalDebts > 0 ? 20 : 0,
          paddingBottom: 140,
          flexGrow: 1,
        }}
        ListEmptyComponent={<DebtsEmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <RectButton
        onPress={handleFabPress}
        rippleColor={isDark ? "#0052CC" : "#4D94FF"}
        style={{
          position: "absolute",
          right: 20,
          bottom: Math.max(100, insets.bottom + 88),
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#EF4444",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#EF4444",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </RectButton>

      <AddDebtModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddDebt}
      />
    </SafeAreaView>
  );
}
