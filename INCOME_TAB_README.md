# Income Tab Documentation

## 📁 File Structure

```
mobile_app/
├── app/
│   └── income.tsx                          # Main Income screen
├── components/
│   └── income/
│       ├── IncomeCard.tsx                  # Individual income transaction card
│       ├── IncomeSummaryCard.tsx           # Statistics overview card
│       ├── IconSelector.tsx                # Horizontal scrollable icon picker
│       └── AddIncomeModal.tsx              # Modal for adding new income
└── types/
    └── income.ts                           # TypeScript models and constants
```

## 🎯 Features

### ✨ Core Features
- **Income Tracking**: Add, view, and manage income transactions
- **Statistics Dashboard**: Total income, monthly income, transaction count, and average
- **Icon Selection**: 10 predefined income types with unique icons and colors
- **Dark/Light Mode**: Full theme support across all components
- **Haptic Feedback**: Touch feedback on all interactions
- **Pull to Refresh**: Refresh income data with native pull gesture

### 🎮 Gamification Elements
- **Icon-based Categories**: Each income type has a unique colorful icon
- **Visual Feedback**: Animated cards with shadows and elevation
- **Color Coding**: Different colors for different income types
- **Progress Tracking**: Visual statistics with icons and numbers

## 📊 TypeScript Models

### Income Interface
```typescript
interface Income {
  id: string;
  amount: number;
  type: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  icon?: string;
  color?: string;
}
```

### Income Types (10 Categories)
1. **Salary** - 💼 Green (#34C759)
2. **Freelance** - 💻 Purple (#5856D6)
3. **Investment** - 📈 Orange (#FF9500)
4. **Rental** - 🏠 Blue (#32ADE6)
5. **Business** - 🏪 Violet (#AF52DE)
6. **Gift** - 🎁 Pink (#FF2D55)
7. **Bonus** - ⭐ Yellow (#FFD60A)
8. **Refund** - 💵 Green (#30D158)
9. **Dividend** - 💰 Blue (#0A84FF)
10. **Other** - 💸 Gray (#8E8E93)

## 🎨 Component Breakdown

### 1. **IncomeCard** (`components/income/IncomeCard.tsx`)
Individual income transaction card with:
- Icon with background color
- Income type and amount
- Description and date
- Haptic feedback on press/long press
- Theme-aware styling

### 2. **IncomeSummaryCard** (`components/income/IncomeSummaryCard.tsx`)
Statistics overview with 4 metrics:
- Total Income
- This Month
- Transaction Count
- Average Income
Each with unique icon and color

### 3. **IconSelector** (`components/income/IconSelector.tsx`)
Horizontal scrollable selector:
- 10 income type options
- Visual selection state
- Haptic feedback
- Color-coded cards

### 4. **AddIncomeModal** (`components/income/AddIncomeModal.tsx`)
Full-featured modal with:
- Icon type selector
- Amount input
- Description field
- Form validation
- Animated entrance
- Haptic feedback

### 5. **Income Screen** (`app/income.tsx`)
Main screen with:
- Header with title and add button
- Summary statistics card
- Scrollable list of income transactions
- Pull to refresh
- Empty state
- FAB-style add button

## 🎭 Theme Integration

All components use `useAppTheme()` hook for:
- Dynamic colors (text, muted, primary, accent)
- Dark/light mode detection
- Consistent styling across components

### Dark Mode Colors
- Background: `#010817`, `#041225`
- Cards: `#0a1830`, `#0b162b`
- Text: Dynamic from theme

### Light Mode Colors
- Background: `#f0f4f8`, `#ffffff`
- Cards: `#f8fbff`, `#e8f1ff`
- Text: Dynamic from theme

## 🔧 Integration with Database

Replace sample data in `app/income.tsx` with your database calls:

```typescript
// Replace this:
const [incomes, setIncomes] = useState<Income[]>([...]);

// With your database fetch:
const { data: incomes, refetch } = useQuery('incomes', fetchIncomes);
```

### Database Schema Mapping
```sql
CREATE TABLE IF NOT EXISTS "Income" (
    "id" TEXT PRIMARY KEY,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP,
    "updatedAt" TIMESTAMP
);
```

Add columns for icon and color:
```sql
ALTER TABLE "Income" ADD COLUMN "icon" TEXT;
ALTER TABLE "Income" ADD COLUMN "color" TEXT;
```

## 🚀 Next Steps

1. **Connect to Database**: Replace sample data with actual database queries
2. **Add Edit/Delete**: Implement edit and delete functionality for income cards
3. **Add Filters**: Filter by date range, income type
4. **Add Charts**: Visualize income trends over time
5. **Add Export**: Export income data to CSV/PDF
6. **Add Notifications**: Remind users to log income

## 💡 Usage Example

```typescript
// In your navigation/layout file, add the income route
import IncomeScreen from './app/income';

// The screen is ready to use with:
<Stack.Screen name="income" component={IncomeScreen} />
```

## ✅ Best Practices Implemented

- ✅ TypeScript for type safety
- ✅ Component-based architecture
- ✅ Theme consistency
- ✅ Haptic feedback
- ✅ Accessibility labels
- ✅ Responsive design
- ✅ Error handling
- ✅ Clean code organization
- ✅ Reusable components
- ✅ Performance optimized (FlatList, memoization)
