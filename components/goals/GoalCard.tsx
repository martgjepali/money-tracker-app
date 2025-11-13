import { useAppTheme } from "@/app/providers/ThemeProvider";
import type { Goal } from "@/types/goal";
import { GOAL_TYPES } from "@/types/goal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

type Props = {
  goal: Goal;
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function GoalCard({ goal, onPress, onLongPress }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  const handlePress = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    onPress?.();
  };

  const handleLongPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      /* ignore */
    }
    onLongPress?.();
  };

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = progress >= 100;

  // Get goal type info for icon and color
  let goalType = GOAL_TYPES.find(type => type.id === goal.type);
  
  // Fallback: If no type field, try to infer from goal name
  if (!goalType && goal.name) {
    const goalNameLower = goal.name.toLowerCase();
    goalType = GOAL_TYPES.find(type => 
      goalNameLower.includes(type.label.toLowerCase()) ||
      (type.id === 'emergency' && goalNameLower.includes('emergency')) ||
      (type.id === 'vacation' && (goalNameLower.includes('vacation') || goalNameLower.includes('trip') || goalNameLower.includes('travel'))) ||
      (type.id === 'house' && (goalNameLower.includes('house') || goalNameLower.includes('home'))) ||
      (type.id === 'car' && goalNameLower.includes('car')) ||
      (type.id === 'education' && (goalNameLower.includes('education') || goalNameLower.includes('school') || goalNameLower.includes('college'))) ||
      (type.id === 'wedding' && goalNameLower.includes('wedding')) ||
      (type.id === 'retirement' && goalNameLower.includes('retirement')) ||
      (type.id === 'gadget' && (goalNameLower.includes('gadget') || goalNameLower.includes('phone') || goalNameLower.includes('laptop'))) ||
      (type.id === 'business' && goalNameLower.includes('business'))
    );
  }
  
  const goalIcon = goalType?.icon || goal.icon || "target";
  const goalColor = goalType?.color || goal.color || colors.accent;

  const formattedDeadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No deadline";

  return (
    <RectButton
      onPress={handlePress}
      onLongPress={handleLongPress}
      rippleColor={isDark ? "#0b1220" : "#e6f6ff"}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: isDark ? "transparent" : "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: isCompleted ? "#10B98120" : goalColor + "20",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <MaterialCommunityIcons
            name={isCompleted ? "check-circle" : (goalIcon as any)}
            size={24}
            color={isCompleted ? "#10B981" : goalColor}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700", marginBottom: 4 }}>
            {goal.name || goalType?.label || "Goal"}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 13 }}>
            {formattedDeadline}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: isCompleted ? "#10B981" : goalColor, fontSize: 18, fontWeight: "800" }}>
            {progress.toFixed(0)}%
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>
            ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
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
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: isCompleted ? "#10B981" : goalColor,
          }}
        />
      </View>
    </RectButton>
  );
}
