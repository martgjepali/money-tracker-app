import { RecurringItem } from "@/components/recurring/RecurringCard";

export const RECURRING_ITEMS: RecurringItem[] = [
  {
    id: "1",
    title: "Payment for Credit Card",
    amount: 100,
    type: "expense",
    cadence: "Monthly",
    nextDateISO: "2025-11-24",
    accentColor: "#FF3B30",
    active: true,
  },
  {
    id: "2",
    title: "Spotify Family",
    amount: 14.99,
    type: "expense",
    cadence: "Monthly",
    nextDateISO: "2025-11-19",
    accentColor: "#22c55e",
    active: true,
  },
  {
    id: "3",
    title: "Salary Deposit",
    amount: 2100,
    type: "income",
    cadence: "Monthly",
    nextDateISO: "2025-12-01",
    accentColor: "#10b981",
    active: false,
  },
];
