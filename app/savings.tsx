// app/savings.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import AddSavingModal from "@/components/savings/AddSavingModal";
import SavingCard from "@/components/savings/SavingCard";
import SavingsEmptyState from "@/components/savings/SavingsEmptyState";
import SavingsSummaryCard from "@/components/savings/SavingsSummaryCard";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { type CreateSavingInput, type Saving } from "@/types/saving";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
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
  // Protect this route
  const isAuthenticated = useAuthGuard();
  
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();

  if (!isAuthenticated) {
    return null;
  }

  const [savings, setSavings] = useState<Saving[]>(SAMPLE_SAVINGS);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

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

  // Pagination logic
  const totalPages = Math.ceil(savings.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = savings.slice(startIndex, endIndex);

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
    setCurrentPage(0); // Reset to first page when adding new saving
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

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
          data={currentItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 140,
          }}
          ListHeaderComponent={
            <>
              <SavingsSummaryCard
                totalSavings={statistics.total}
                transactionCount={statistics.count}
                savingsGoal={savingsGoal}
              />
              {savings.length > 0 && (
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
                    Recent Savings ({savings.length})
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
            <SavingCard
              saving={item}
              onPress={() => handlePressSaving(item)}
              onLongPress={() => handleLongPressSaving(item)}
            />
          )}
          ListFooterComponent={
            savings.length > itemsPerPage ? (
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
                    backgroundColor: currentPage === 0 ? "transparent" : "#FFD60A15",
                    opacity: currentPage === 0 ? 0.5 : 1,
                  }}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={20}
                    color={currentPage === 0 ? colors.muted : "#FFD60A"}
                  />
                  <Text
                    style={{
                      color: currentPage === 0 ? colors.muted : "#FFD60A",
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
                    backgroundColor: currentPage >= totalPages - 1 ? "transparent" : "#FFD60A15",
                    opacity: currentPage >= totalPages - 1 ? 0.5 : 1,
                  }}
                >
                  <Text
                    style={{
                      color: currentPage >= totalPages - 1 ? colors.muted : "#FFD60A",
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
                    color={currentPage >= totalPages - 1 ? colors.muted : "#FFD60A"}
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
