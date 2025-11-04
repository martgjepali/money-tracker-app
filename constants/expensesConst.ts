import { ExpenseDataset } from "@/components/analytics/ExpenseOverviewCard";

export const DAILY_EXPENSE_DATA: ExpenseDataset = {
    area: [
        { date: "2025-11-01", amount: 22 },
        { date: "2025-11-02", amount: 18 },
        { date: "2025-11-03", amount: 35 },
        { date: "2025-11-04", amount: 12 },
        { date: "2025-11-05", amount: 40 },
    ],
    candle: [
        { date: "2025-11-01", open: 10, high: 26, low: 8, close: 22 },
        { date: "2025-11-02", open: 22, high: 24, low: 12, close: 18 },
        { date: "2025-11-03", open: 18, high: 38, low: 16, close: 35 },
        { date: "2025-11-04", open: 35, high: 36, low: 9, close: 12 },
        { date: "2025-11-05", open: 12, high: 42, low: 10, close: 40 },
    ],
};

export const WEEKLY_EXPENSE_DATA: ExpenseDataset = {
    area: [
        { date: "Mon", amount: 20 },
        { date: "Tue", amount: 45 },
        { date: "Wed", amount: 28 },
        { date: "Thu", amount: 80 },
        { date: "Fri", amount: 55 },
        { date: "Sat", amount: 70 },
        { date: "Sun", amount: 40 },
    ],
    candle: [
        { date: "Mon", open: 20, high: 46, low: 18, close: 32 },
        { date: "Tue", open: 32, high: 50, low: 28, close: 45 },
        { date: "Wed", open: 45, high: 52, low: 27, close: 30 },
        { date: "Thu", open: 30, high: 86, low: 29, close: 80 },
        { date: "Fri", open: 80, high: 82, low: 48, close: 55 },
        { date: "Sat", open: 55, high: 78, low: 52, close: 70 },
        { date: "Sun", open: 70, high: 74, low: 36, close: 40 },
    ],
};
