// app/subscriptions.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import AddSubscriptionModal from "@/components/subscriptions/AddSubscriptionModal";
import SubscriptionCard from "@/components/subscriptions/SubscriptionCard";
import SubscriptionEmptyState from "@/components/subscriptions/SubscriptionEmptyState";
import SubscriptionSummaryCard from "@/components/subscriptions/SubscriptionSummaryCard";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { CreateSubscriptionInput, Subscription } from "@/types/subscription";
import { calculateNextBillingDate } from "@/types/subscription";
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

export default function SubscriptionsScreen() {
  // Protect this route
  const isAuthenticated = useAuthGuard();
  
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();

  if (!isAuthenticated) {
    return null;
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  // Sample data - replace with actual data from your database
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      name: "Netflix",
      description: "Premium streaming service",
      amount: 15.99,
      frequency: "monthly",
      startDate: "2025-01-01T00:00:00.000Z",
      nextBillingDate: "2025-12-01T00:00:00.000Z",
      isActive: true,
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
      icon: "netflix",
      color: "#E50914",
    },
    {
      id: "2",
      name: "Spotify Premium",
      description: "Music streaming service",
      amount: 9.99,
      frequency: "monthly",
      startDate: "2025-02-01T00:00:00.000Z",
      nextBillingDate: "2025-12-01T00:00:00.000Z",
      isActive: true,
      createdAt: "2025-02-01T00:00:00.000Z",
      updatedAt: "2025-02-01T00:00:00.000Z",
      icon: "spotify",
      color: "#1DB954",
    },
    {
      id: "3",
      name: "Adobe Creative Cloud",
      description: "Design and creativity tools",
      amount: 52.99,
      frequency: "monthly",
      startDate: "2025-03-01T00:00:00.000Z",
      nextBillingDate: "2025-11-15T00:00:00.000Z",
      isActive: true,
      createdAt: "2025-03-01T00:00:00.000Z",
      updatedAt: "2025-03-01T00:00:00.000Z",
      icon: "adobe",
      color: "#FF0000",
    },
    {
      id: "4",
      name: "GitHub Pro",
      description: "Developer platform",
      amount: 4.00,
      frequency: "monthly",
      startDate: "2025-04-01T00:00:00.000Z",
      nextBillingDate: "2025-11-12T00:00:00.000Z",
      isActive: true,
      createdAt: "2025-04-01T00:00:00.000Z",
      updatedAt: "2025-04-01T00:00:00.000Z",
      icon: "github",
      color: "#24292F",
    },
    {
      id: "5",
      name: "iCloud Storage",
      description: "50GB cloud storage",
      amount: 0.99,
      frequency: "monthly",
      startDate: "2025-01-15T00:00:00.000Z",
      nextBillingDate: "2025-11-30T00:00:00.000Z",
      isActive: false,
      createdAt: "2025-01-15T00:00:00.000Z",
      updatedAt: "2025-06-01T00:00:00.000Z",
      icon: "apple-icloud",
      color: "#007AFF",
    },
  ]);

  // Calculate statistics
  const activeSubscriptions = subscriptions.filter(sub => sub.isActive);
  
  // Calculate total monthly spend (convert all frequencies to monthly equivalent)
  const totalMonthlySpend = activeSubscriptions.reduce((sum, sub) => {
    switch (sub.frequency) {
      case "weekly":
        return sum + (sub.amount * 4.33); // ~4.33 weeks per month
      case "monthly":
        return sum + sub.amount;
      case "yearly":
        return sum + (sub.amount / 12);
      default:
        return sum;
    }
  }, 0);

  const totalYearlySpend = totalMonthlySpend * 12;
  const activeSubscriptionCount = activeSubscriptions.length;

  // Calculate subscriptions due soon (within 7 days)
  const today = new Date();
  const dueSoonCount = activeSubscriptions.filter(sub => {
    const nextBilling = new Date(sub.nextBillingDate);
    const daysUntil = Math.ceil((nextBilling.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil >= 0;
  }).length;

  // Pagination logic
  const totalPages = Math.ceil(subscriptions.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = subscriptions.slice(startIndex, endIndex);

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

  const handleAddSubscription = (subscriptionData: CreateSubscriptionInput) => {
    const startDate = new Date(subscriptionData.startDate);
    const nextBillingDate = calculateNextBillingDate(startDate, subscriptionData.frequency);

    const newSubscription: Subscription = {
      id: Date.now().toString(),
      name: subscriptionData.name,
      description: subscriptionData.description,
      amount: subscriptionData.amount,
      frequency: subscriptionData.frequency,
      startDate: subscriptionData.startDate,
      nextBillingDate: nextBillingDate.toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: subscriptionData.icon,
      color: subscriptionData.color || "#6B7280",
    };

    setSubscriptions([newSubscription, ...subscriptions]);
    setCurrentPage(0); // Reset to first page when adding new subscription
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

  const handleSubscriptionPress = (subscription: Subscription) => {
    // Handle subscription press - could open edit modal, show details, etc.
    console.log("Subscription pressed:", subscription.name);
  };

  const handleSubscriptionLongPress = (subscription: Subscription) => {
    // Handle long press - could show action sheet for edit/delete/toggle active
    console.log("Subscription long pressed:", subscription.name);
  };

  const handleToggleSubscription = async (subscriptionId: string, isActive: boolean) => {
    console.log(`Toggle subscription ${subscriptionId} to ${isActive}`);
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      /* ignore */
    }

    // Update the subscription in the state
    setSubscriptions(prev => {
      const updated = prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, isActive, updatedAt: new Date().toISOString() }
          : sub
      );
      console.log('Updated subscriptions:', updated.map(s => ({ id: s.id, name: s.name, isActive: s.isActive })));
      return updated;
    });

    // Here you would also make an API call to update the subscription in your database
    console.log(`Subscription ${subscriptionId} ${isActive ? 'activated' : 'deactivated'}`);
  };

  // Keep subscriptions in their original order to prevent jumping when toggling
  // Users can see active/inactive status from the visual indicators in each card
  const sortedSubscriptions = [...subscriptions];

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
          Subscriptions
        </Text>
        <Text
          style={{
            color: colors.muted,
            fontSize: 14,
            marginTop: 2,
          }}
        >
          Manage your recurring payments
        </Text>
      </View>

      {/* Content */}
      <FlatList
        data={currentItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <>
            <SubscriptionSummaryCard
              totalMonthlySpend={totalMonthlySpend}
              totalYearlySpend={totalYearlySpend}
              activeSubscriptions={activeSubscriptionCount}
              dueSoonCount={dueSoonCount}
            />
            {subscriptions.length > 0 && (
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
                  Your Subscriptions ({subscriptions.length})
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
          <SubscriptionCard 
            key={item.id}
            subscription={item} 
            onPress={() => handleSubscriptionPress(item)}
            onLongPress={() => handleSubscriptionLongPress(item)}
            onToggleActive={handleToggleSubscription}
          />
        )}
        ListEmptyComponent={<SubscriptionEmptyState />}
        ListFooterComponent={
          subscriptions.length > itemsPerPage ? (
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
                  backgroundColor: currentPage === 0 ? "transparent" : `${colors.primary}15`,
                  opacity: currentPage === 0 ? 0.5 : 1,
                }}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={20}
                  color={currentPage === 0 ? colors.muted : colors.primary}
                />
                <Text
                  style={{
                    color: currentPage === 0 ? colors.muted : colors.primary,
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
                  backgroundColor: currentPage >= totalPages - 1 ? "transparent" : `${colors.primary}15`,
                  opacity: currentPage >= totalPages - 1 ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    color: currentPage >= totalPages - 1 ? colors.muted : colors.primary,
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
                  color={currentPage >= totalPages - 1 ? colors.muted : colors.primary}
                />
              </TouchableOpacity>
            </View>
          ) : null
        }
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

      {/* Add Subscription Modal */}
      <AddSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddSubscription}
      />
    </SafeAreaView>
  );
}