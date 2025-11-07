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
  createdAt: string;
  updatedAt: string;
}

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
}
