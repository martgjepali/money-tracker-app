// types/saving.ts
export interface Saving {
  id: string;
  amount: number;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  icon?: string; // Icon name for visual representation
  color?: string; // Color associated with the saving type
}

export interface SavingType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const SAVING_TYPES: SavingType[] = [
  { id: "emergency", label: "Emergency Fund", icon: "shield-alert", color: "#FF3B30" },
  { id: "vacation", label: "Vacation", icon: "airplane", color: "#FF9500" },
  { id: "retirement", label: "Retirement", icon: "account-clock", color: "#34C759" },
  { id: "education", label: "Education", icon: "school", color: "#5856D6" },
  { id: "home", label: "Home Purchase", icon: "home-city", color: "#32ADE6" },
  { id: "car", label: "Car", icon: "car", color: "#AF52DE" },
  { id: "investment", label: "Investment", icon: "chart-areaspline", color: "#0A84FF" },
  { id: "wedding", label: "Wedding", icon: "heart", color: "#FF2D55" },
  { id: "health", label: "Health", icon: "medical-bag", color: "#30D158" },
  { id: "general", label: "General Savings", icon: "piggy-bank", color: "#FFD60A" },
];

export interface CreateSavingInput {
  amount: number;
  date: string;
  description: string;
  icon?: string;
  color?: string;
}
