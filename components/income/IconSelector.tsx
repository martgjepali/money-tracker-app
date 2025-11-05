// components/income/IconSelector.tsx
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { INCOME_TYPES } from "@/types/income";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

type Props = {
  selectedType?: string;
  onSelectType: (typeId: string, icon: string, color: string) => void;
};

export default function IconSelector({ selectedType, onSelectType }: Props) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  const handleSelect = async (typeId: string, icon: string, color: string) => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    onSelectType(typeId, icon, color);
  };

  return (
    <View>
      <Text
        style={{
          color: colors.text,
          fontSize: 15,
          fontWeight: "700",
          marginBottom: 12,
        }}
      >
        Select Income Type
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: 16,
        }}
      >
        {INCOME_TYPES.map((type) => {
          const isSelected = selectedType === type.id;
          return (
            <RectButton
              key={type.id}
              onPress={() => handleSelect(type.id, type.icon, type.color)}
              rippleColor={`${type.color}30`}
              style={{
                marginRight: 10,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 12,
                  borderRadius: 16,
                  minWidth: 90,
                  backgroundColor: isSelected
                    ? `${type.color}20`
                    : isDark
                    ? "#0a1830"
                    : "#f8fbff",
                  borderWidth: isSelected ? 2 : isDark ? 0 : 1,
                  borderColor: isSelected
                    ? type.color
                    : isDark
                    ? "transparent"
                    : "#e9eef7",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: `${type.color}15`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <MaterialCommunityIcons
                    name={type.icon as any}
                    size={26}
                    color={type.color}
                  />
                </View>
                <Text
                  style={{
                    color: isSelected ? type.color : colors.text,
                    fontSize: 12,
                    fontWeight: isSelected ? "700" : "600",
                  }}
                >
                  {type.label}
                </Text>
              </View>
            </RectButton>
          );
        })}
      </ScrollView>
    </View>
  );
}
