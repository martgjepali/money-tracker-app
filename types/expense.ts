export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "entertainment"
  | "bills"
  | "health"
  | "education"
  | "travel"
  | "home"
  | "other";

export interface ExpenseType {
  id: ExpenseCategory;
  label: string;
  icon: string;
  color: string;
}

export const expenseTypes: ExpenseType[] = [
  { id: "food", label: "Food & Dining", icon: "food", color: "#FF6B6B" },
  { id: "transport", label: "Transport", icon: "car", color: "#4ECDC4" },
  { id: "shopping", label: "Shopping", icon: "shopping", color: "#FF9F1C" },
  { id: "entertainment", label: "Entertainment", icon: "gamepad-variant", color: "#A78BFA" },
  { id: "bills", label: "Bills & Utilities", icon: "receipt", color: "#F472B6" },
  { id: "health", label: "Health & Fitness", icon: "hospital-box", color: "#34D399" },
  { id: "education", label: "Education", icon: "school", color: "#60A5FA" },
  { id: "travel", label: "Travel", icon: "airplane", color: "#FBBF24" },
  { id: "home", label: "Home & Garden", icon: "home", color: "#8B5CF6" },
  { id: "other", label: "Other", icon: "dots-horizontal", color: "#94A3B8" },
];

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
