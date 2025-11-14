
// data/sampleDebts.ts
import type { Debt } from "@/types/debt";

export const SAMPLE_DEBTS: Debt[] = [
  {
    id: "1",
    name: "Credit Card - Chase",
    amount: 5000,
    interestRate: 18.5,
    minimumPayment: 150,
    status: "active",
    date: new Date(2023, 0, 15).toISOString(),
    isRecurring: true,
    recurringFrequency: "monthly",
    recurringAmount: 200,
    paidAmount: 2500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Student Loan",
    amount: 25000,
    interestRate: 4.5,
    minimumPayment: 300,
    status: "active",
    date: new Date(2020, 8, 1).toISOString(),
    isRecurring: true,
    recurringFrequency: "monthly",
    recurringAmount: 350,
    paidAmount: 8000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Personal Loan",
    amount: 3000,
    interestRate: 12,
    status: "paid",
    date: new Date(2023, 5, 20).toISOString(),
    isRecurring: false,
    paidAmount: 3000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
