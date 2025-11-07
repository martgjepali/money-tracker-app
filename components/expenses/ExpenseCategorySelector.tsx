import { useAppTheme } from "@/app/providers/ThemeProvider";
import { ExpenseCategory, expenseTypes } from "@/types/expense";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, ScrollView, Text, View } from "react-native";

interface ExpenseCategorySelectorProps {
  selectedCategory: ExpenseCategory;
  onSelectCategory: (category: ExpenseCategory, icon: string, color: string) => void;
}

export function ExpenseCategorySelector({
  selectedCategory,
  onSelectCategory,
}: ExpenseCategorySelectorProps) {
  const { theme, colors } = useAppTheme();
  const isDark = theme === "dark";

  const handleSelect = async (category: ExpenseCategory, icon: string, color: string) => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      /* ignore */
    }
    onSelectCategory(category, icon, color);
  };

  return (
    <View>
      <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700", marginBottom: 12 }}>
        Category
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {expenseTypes.map((type) => {
          const isSelected = selectedCategory === type.id;
          return (
            <Pressable
              key={type.id}
              onPress={() => handleSelect(type.id, type.icon, type.color)}
              style={{
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isSelected ? type.color : (isDark ? "#1e3a5f" : "#e5e7eb"),
                backgroundColor: isSelected
                  ? type.color + "20"
                  : colors.surface,
                minWidth: 90,
              }}
            >
              <MaterialCommunityIcons
                name={type.icon as any}
                size={28}
                color={isSelected ? type.color : colors.muted}
              />
              <Text
                style={{
                  color: isSelected ? type.color : colors.text,
                  fontSize: 12,
                  fontWeight: isSelected ? "700" : "600",
                  marginTop: 6,
                  textAlign: "center",
                }}
                numberOfLines={2}
              >
                {type.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
