export type DebtStatus = 'active' | 'paid' | 'overdue';
export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Debt {
  id: string;
  name: string;
  amount: number;
  interestRate?: number;
  minimumPayment?: number;
  status: DebtStatus;
  date: string;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringAmount?: number;
  paidAmount: number;
  icon?: string;
  color?: string;
  type?: string;
  autoPayEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DebtType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const DEBT_TYPES: DebtType[] = [
  { id: "credit_card", label: "Credit Card", icon: "credit-card", color: "#FF3B30" },
  { id: "student_loan", label: "Student Loan", icon: "school", color: "#FF9500" },
  { id: "mortgage", label: "Mortgage", icon: "home", color: "#34C759" },
  { id: "car_loan", label: "Car Loan", icon: "car", color: "#007AFF" },
  { id: "personal_loan", label: "Personal Loan", icon: "account", color: "#5856D6" },
  { id: "medical", label: "Medical", icon: "medical-bag", color: "#FF2D55" },
  { id: "business", label: "Business Loan", icon: "briefcase", color: "#AF52DE" },
  { id: "tax", label: "Tax Debt", icon: "file-document", color: "#8E8E93" },
  { id: "family", label: "Family/Friends", icon: "account-group", color: "#00C7BE" },
  { id: "other", label: "Other", icon: "cash-minus", color: "#32ADE6" },
];

export interface CreateDebtInput {
  name: string;
  amount: number;
  interestRate?: number;
  minimumPayment?: number;
  status: DebtStatus;
  date: string;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringAmount?: number;
  paidAmount: number;
  icon?: string;
  color?: string;
  type?: string;
  autoPayEnabled?: boolean;
}
