import AddGoalModal from "@/components/goals/AddGoalModal";
import GoalCard from "@/components/goals/GoalCard";
import GoalsEmptyState from "@/components/goals/GoalsEmptyState";
import GoalsSummaryCard from "@/components/goals/GoalsSummaryCard";
import type { CreateGoalInput, Goal } from "@/types/goal";
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
const SAMPLE_GOALS: Goal[] = [
  {
    id: "1",
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 6500,
    deadline: new Date(2024, 11, 31).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Vacation to Japan",
    targetAmount: 5000,
    currentAmount: 2300,
    deadline: new Date(2024, 6, 15).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "New Car",
    targetAmount: 25000,
    currentAmount: 25000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function GoalsScreen() {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();

  const [goals, setGoals] = useState<Goal[]>(SAMPLE_GOALS);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount).length;
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  const handleAddGoal = (goalData: CreateGoalInput) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalData.name,
      targetAmount: goalData.targetAmount,
      currentAmount: goalData.currentAmount || 0,
      deadline: goalData.deadline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setGoals([newGoal, ...goals]);
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
          Goals
        </Text>
      </View>

      {/* Goals List */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          totalGoals > 0 ? (
            <GoalsSummaryCard
              totalGoals={totalGoals}
              completedGoals={completedGoals}
              totalTargetAmount={totalTargetAmount}
              totalCurrentAmount={totalCurrentAmount}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <GoalCard
            goal={item}
            onPress={() => {
              // Handle goal press
            }}
            onLongPress={() => {
              // Handle long press for edit/delete
            }}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: totalGoals > 0 ? 20 : 0,
          paddingBottom: 140,
          flexGrow: 1,
        }}
        ListEmptyComponent={<GoalsEmptyState />}
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
          backgroundColor: colors.accent,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </RectButton>

      <AddGoalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddGoal}
      />
    </SafeAreaView>
  );
}
