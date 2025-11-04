import { useAppTheme } from "@/app/providers/ThemeProvider";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { BORDER_RADIUS } from "@/theme/globals";
import { StyleProp, ViewStyle } from "react-native";

type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const ChartContainer = ({
  title,
  description,
  children,
  style,
}: Props) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: BORDER_RADIUS,
          padding: 16,
          width: "100%", // Full container width
        },
        style,
      ]}
    >
      {title && (
        <Text
          variant="subtitle"
          style={{ marginBottom: 4, color: colors.text }}
        >
          {title}
        </Text>
      )}
      {description && (
        <Text
          variant="caption"
          style={{ marginBottom: 16, color: colors.muted }}
        >
          {description}
        </Text>
      )}
      {children}
    </View>
  );
};
