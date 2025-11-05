// types/income.ts
export interface Income {
  id: string;
  amount: number;
  type: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  icon?: string; // Icon name for visual representation
  color?: string; // Color associated with the income type
}

export interface IncomeType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const INCOME_TYPES: IncomeType[] = [
  { id: "salary", label: "Salary", icon: "briefcase", color: "#34C759" },
  { id: "freelance", label: "Freelance", icon: "laptop", color: "#5856D6" },
  { id: "investment", label: "Investment", icon: "chart-line", color: "#FF9500" },
  { id: "rental", label: "Rental", icon: "home", color: "#32ADE6" },
  { id: "business", label: "Business", icon: "store", color: "#AF52DE" },
  { id: "gift", label: "Gift", icon: "gift", color: "#FF2D55" },
  { id: "bonus", label: "Bonus", icon: "star", color: "#FFD60A" },
  { id: "refund", label: "Refund", icon: "cash-refund", color: "#30D158" },
  { id: "dividend", label: "Dividend", icon: "cash-multiple", color: "#0A84FF" },
  { id: "other", label: "Other", icon: "cash", color: "#8E8E93" },
];

export interface CreateIncomeInput {
  amount: number;
  type: string;
  date: string;
  description: string;
  icon?: string;
  color?: string;
  savingsAmount?: number;
}
