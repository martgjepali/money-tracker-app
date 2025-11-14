import AddGoalModal from "@/components/goals/AddGoalModal";
import GoalCard from "@/components/goals/GoalCard";
import GoalsEmptyState from "@/components/goals/GoalsEmptyState";
import GoalsSummaryCard from "@/components/goals/GoalsSummaryCard";
import { useAuthGuard } from "@/hooks/useAuthGuard";
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
  TouchableOpacity,
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
  // Protect this route
  const isAuthenticated = useAuthGuard();
  
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();

  if (!isAuthenticated) {
    return null;
  }

  const [goals, setGoals] = useState<Goal[]>(SAMPLE_GOALS);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount).length;
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  // Pagination logic
  const totalPages = Math.ceil(goals.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = goals.slice(startIndex, endIndex);

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
    setCurrentPage(0); // Reset to first page when adding new goal
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

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
        data={currentItems}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {totalGoals > 0 && (
              <GoalsSummaryCard
                totalGoals={totalGoals}
                completedGoals={completedGoals}
                totalTargetAmount={totalTargetAmount}
                totalCurrentAmount={totalCurrentAmount}
              />
            )}
            {goals.length > 0 && (
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
                  Your Goals ({goals.length})
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
        ListFooterComponent={
          goals.length > itemsPerPage ? (
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
                  backgroundColor: currentPage === 0 ? "transparent" : `${colors.accent}15`,
                  opacity: currentPage === 0 ? 0.5 : 1,
                }}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={20}
                  color={currentPage === 0 ? colors.muted : colors.accent}
                />
                <Text
                  style={{
                    color: currentPage === 0 ? colors.muted : colors.accent,
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
                  backgroundColor: currentPage >= totalPages - 1 ? "transparent" : `${colors.accent}15`,
                  opacity: currentPage >= totalPages - 1 ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    color: currentPage >= totalPages - 1 ? colors.muted : colors.accent,
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
                  color={currentPage >= totalPages - 1 ? colors.muted : colors.accent}
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
