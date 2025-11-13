export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon?: string;
  color?: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const GOAL_TYPES: GoalType[] = [
  { id: "emergency", label: "Emergency Fund", icon: "shield-check", color: "#FF3B30" },
  { id: "vacation", label: "Vacation", icon: "airplane", color: "#007AFF" },
  { id: "house", label: "House", icon: "home", color: "#34C759" },
  { id: "car", label: "Car", icon: "car", color: "#FF9500" },
  { id: "education", label: "Education", icon: "school", color: "#5856D6" },
  { id: "wedding", label: "Wedding", icon: "heart", color: "#FF2D55" },
  { id: "retirement", label: "Retirement", icon: "clock", color: "#8E8E93" },
  { id: "gadget", label: "Gadget", icon: "cellphone", color: "#00C7BE" },
  { id: "business", label: "Business", icon: "briefcase", color: "#AF52DE" },
  { id: "other", label: "Other", icon: "target", color: "#32ADE6" },
];

export interface CreateGoalInput {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: string;
  icon?: string;
  color?: string;
  type?: string;
}
