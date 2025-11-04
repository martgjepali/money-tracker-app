// components/charts/area-chart.tsx
import { LineChart, type LineChartConfig, type LinePoint } from "@/components/charts/line-chart";
import { ViewStyle } from "react-native";

type Props = {
  data: LinePoint[];
  config?: LineChartConfig;
  style?: ViewStyle;
};

export const AreaChart = ({ data, config = {}, style }: Props) => {
  return (
    <LineChart
      data={data}
      config={{ ...config, gradient: true }}
      style={style}
    />
  );
};
