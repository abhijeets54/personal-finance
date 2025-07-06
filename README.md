# Personal Finance Visualizer

A beautiful, modern web application for tracking and visualizing personal finances with interactive charts, budgeting tools, and spending insights.

![Personal Finance Visualizer](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📊 Dashboard & Analytics
- **Real-time Dashboard** with summary cards showing total income, expenses, net amount, and transaction count
- **Monthly Expenses Bar Chart** to visualize spending trends over time
- **Category-wise Pie Chart** for expense breakdown by category
- **Budget vs Actual Comparison** charts with monthly budget tracking

### 💰 Transaction Management
- **Add/Edit/Delete Transactions** with comprehensive form validation
- **Transaction List View** with search, filter, and pagination
- **Predefined Categories** for consistent categorization
- **Income and Expense Tracking** with visual indicators

### 🎯 Budget Management
- **Set Monthly Category Budgets** with easy-to-use forms
- **Budget Tracking** with visual progress indicators
- **Budget vs Actual Comparison** with percentage calculations
- **Budget Alerts** when spending exceeds limits

### 🧠 Smart Insights
- **Spending Pattern Analysis** with personalized recommendations
- **Financial Health Indicators** including savings rate analysis
- **Trend Detection** for spending increases/decreases
- **Category Concentration Warnings** for balanced spending

### 🎨 Beautiful UI/UX
- **Modern Design** with gradient backgrounds and smooth animations
- **Responsive Layout** that works on all devices
- **Professional Theme** using shadcn/ui components
- **Interactive Charts** with hover effects and tooltips
- **Loading States** and error handling throughout

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Database**: MongoDB Atlas
- **Icons**: Lucide React
- **Notifications**: Sonner for toast messages
- **Deployment**: Vercel (production-ready)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-finance-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB=personal_finance
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `MONGODB_DB` | Database name | No (defaults to 'personal_finance') |

## 📱 Usage

### Adding Transactions
1. Navigate to the **Transactions** tab
2. Fill out the transaction form with amount, date, description, category, and type
3. Click "Add Transaction" to save

### Setting Budgets
1. Go to the **Budgets** tab
2. Select a month and category
3. Enter your budget amount
4. Click "Set Budget" to save

### Viewing Analytics
1. Visit the **Analytics** tab for detailed charts
2. Check the **Dashboard** for a quick overview
3. Explore **Insights** for personalized recommendations

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── transactions/  # Transaction CRUD operations
│   │   ├── budgets/       # Budget management
│   │   └── analytics/     # Data analytics endpoints
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main application page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── charts/           # Chart components
│   ├── DashboardStats.tsx
│   ├── TransactionForm.tsx
│   ├── TransactionList.tsx
│   ├── BudgetForm.tsx
│   ├── SpendingInsights.tsx
│   └── ErrorBoundary.tsx
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # Database connection
│   ├── db-utils.ts       # Database operations
│   ├── utils.ts          # General utilities
│   └── validation.ts     # Form validation
└── types/                # TypeScript type definitions
    └── index.ts
```

## 🔧 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/[id]` - Get specific transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Budgets
- `GET /api/budgets` - Get budgets (with optional month filter)
- `POST /api/budgets` - Create or update budget

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/categories` - Category breakdown
- `GET /api/analytics/monthly` - Monthly expense data
- `GET /api/analytics/budget-comparison` - Budget vs actual comparison

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables in Vercel**
   - Go to your project settings in Vercel
   - Add `MONGODB_URI` and `MONGODB_DB` in Environment Variables

## 🧪 Testing

The application includes comprehensive testing for:
- ✅ API endpoints functionality
- ✅ Database operations
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive design
- ✅ Cross-browser compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Recharts](https://recharts.org/) for interactive charts
- [MongoDB](https://www.mongodb.com/) for the database
- [Vercel](https://vercel.com/) for seamless deployment

---

**Built with ❤️ for better financial management**
