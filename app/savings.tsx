// app/savings.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import AddSavingModal from "@/components/savings/AddSavingModal";
import SavingCard from "@/components/savings/SavingCard";
import SavingsEmptyState from "@/components/savings/SavingsEmptyState";
import SavingsSummaryCard from "@/components/savings/SavingsSummaryCard";
import { type CreateSavingInput, type Saving } from "@/types/saving";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, StatusBar, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Sample data
const SAMPLE_SAVINGS: Saving[] = [
  {
    id: "1",
    amount: 500,
    date: "2024-01-15T10:30:00.000Z",
    description: "Emergency Fund deposit",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
    icon: "shield-alert",
    color: "#FF3B30",
  },
  {
    id: "2",
    amount: 300,
    date: "2024-01-10T14:20:00.000Z",
    description: "Summer vacation fund",
    createdAt: "2024-01-10T14:20:00.000Z",
    updatedAt: "2024-01-10T14:20:00.000Z",
    icon: "airplane",
    color: "#FF9500",
  },
  {
    id: "3",
    amount: 1000,
    date: "2024-01-05T09:00:00.000Z",
    description: "Retirement contribution",
    createdAt: "2024-01-05T09:00:00.000Z",
    updatedAt: "2024-01-05T09:00:00.000Z",
    icon: "account-clock",
    color: "#34C759",
  },
];

export default function SavingsScreen() {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();

  const [savings, setSavings] = useState<Saving[]>(SAMPLE_SAVINGS);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Optional savings goal - set to null to hide progress bar, or a number to show it
  const savingsGoal = 10000;

  const statistics = useMemo(() => {
    const total = savings.reduce((sum, item) => sum + item.amount, 0);
    const count = savings.length;

    // Calculate this month's savings
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthSavings = savings
      .filter((s) => new Date(s.date) >= startOfMonth)
      .reduce((sum, s) => sum + s.amount, 0);

    return { total, thisMonthSavings, count };
  }, [savings]);

  const handleAddSaving = (input: CreateSavingInput) => {
    const newSaving: Saving = {
      id: Date.now().toString(),
      amount: input.amount,
      date: input.date,
      description: input.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: input.icon,
      color: input.color,
    };
    setSavings((prev) => [newSaving, ...prev]);
    setModalVisible(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handlePressSaving = async (saving: Saving) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      /* ignore */
    }
    // TODO: Navigate to detail or edit
    console.log("Pressed saving:", saving.id);
  };

  const handleLongPressSaving = async (saving: Saving) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }
    // TODO: Show options (edit/delete)
    console.log("Long pressed saving:", saving.id);
  };

  const handleAddPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
          Savings
        </Text>
        <Text
          style={{
            color: colors.muted,
            fontSize: 14,
            marginTop: 2,
          }}
        >
          Grow your wealth systematically
        </Text>
      </View>

      {/* Content */}
      {savings.length === 0 ? (
        <SavingsEmptyState />
      ) : (
        <FlatList
          data={savings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 140,
          }}
          ListHeaderComponent={
            <SavingsSummaryCard
              totalSavings={statistics.total}
              transactionCount={statistics.count}
              savingsGoal={savingsGoal}
            />
          }
          renderItem={({ item }) => (
            <SavingCard
              saving={item}
              onPress={() => handlePressSaving(item)}
              onLongPress={() => handleLongPressSaving(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <View
        style={{
          position: "absolute",
          right: 20,
          bottom: Math.max(100, insets.bottom + 88),
          zIndex: 100,
        }}
        pointerEvents="box-none"
      >
        <RectButton
          onPress={handleAddPress}
          rippleColor="#FFD60A30"
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#FFD60A",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#FFD60A",
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <MaterialCommunityIcons name="plus" size={32} color="#ffffff" />
          </View>
        </RectButton>
      </View>

      {/* Add Saving Modal */}
      <AddSavingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleAddSaving}
      />
    </SafeAreaView>
  );
}
