import { useAppTheme } from "@/app/providers/ThemeProvider";
import { SUBSCRIPTION_TYPES } from "@/types/subscription";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Props = {
  selectedType: string;
  onSelectType: (typeId: string, icon: string, color: string) => void;
};

export default function SubscriptionIconSelector({ selectedType, onSelectType }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  const handleSelectType = async (typeId: string, icon: string, color: string) => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    onSelectType(typeId, icon, color);
  };

  // Group subscription types by category for better organization
  const categories = [
    { id: "streaming", label: "Streaming", icon: "play-circle" },
    { id: "software", label: "Software", icon: "application" },
    { id: "productivity", label: "Productivity", icon: "briefcase" },
    { id: "cloud", label: "Cloud", icon: "cloud" },
    { id: "music", label: "Music", icon: "music" },
    { id: "social", label: "Social", icon: "account-group" },
    { id: "fitness", label: "Fitness", icon: "dumbbell" },
    { id: "gaming", label: "Gaming", icon: "gamepad-variant" },
    { id: "news", label: "News", icon: "newspaper" },
    { id: "other", label: "Other", icon: "dots-horizontal" },
  ];

  return (
    <View>
      <Text style={{ color: colors.muted, marginBottom: 12, fontSize: 13, fontWeight: "600" }}>
        Select Subscription Type
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        style={{ marginHorizontal: -4 }}
      >
        {SUBSCRIPTION_TYPES.map((type) => {
          const isSelected = selectedType === type.id;
          
          return (
            <TouchableOpacity
              key={type.id}
              onPress={() => handleSelectType(type.id, type.icon, type.color)}
              style={{
                alignItems: "center",
                marginHorizontal: 8,
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 16,
                backgroundColor: isSelected
                  ? type.color + "20"
                  : isDark
                    ? "#0a1830"
                    : "#f8fbff",
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected
                  ? type.color
                  : isDark
                    ? "transparent"
                    : "#e9eef7",
                minWidth: 80,
                shadowColor: isSelected ? type.color : "transparent",
                shadowOpacity: isSelected ? 0.3 : 0,
                shadowRadius: 8,
                elevation: isSelected ? 4 : 0,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: isSelected ? type.color + "30" : type.color + "20",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <MaterialCommunityIcons
                  name={type.icon as any}
                  size={20}
                  color={type.color}
                />
              </View>
              
              <Text
                style={{
                  color: isSelected ? type.color : colors.text,
                  fontSize: 11,
                  fontWeight: isSelected ? "700" : "600",
                  textAlign: "center",
                  lineHeight: 14,
                }}
                numberOfLines={2}
              >
                {type.label}
              </Text>
              
              {/* Category indicator */}
              <View
                style={{
                  marginTop: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 8,
                  backgroundColor: isDark ? "#1e3a5f40" : "#e9eef740",
                }}
              >
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 9,
                    fontWeight: "500",
                    textTransform: "uppercase",
                  }}
                >
                  {categories.find(cat => cat.id === type.category)?.label || type.category}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected subscription info */}
      {selectedType && (
        <View
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            backgroundColor: isDark ? "#0a1830" : "#f8fbff",
            borderWidth: isDark ? 0 : 1,
            borderColor: isDark ? "transparent" : "#e9eef7",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="information"
            size={16}
            color={colors.accent}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: colors.muted, fontSize: 12, flex: 1 }}>
            Selected:{" "}
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {SUBSCRIPTION_TYPES.find(t => t.id === selectedType)?.label || "Custom"}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
}