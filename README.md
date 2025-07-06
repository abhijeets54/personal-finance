# Personal Finance Visualizer

A beautiful, modern web application for tracking and visualizing personal finances with interactive charts, budgeting tools, and spending insights. Built with Next.js, React, and MongoDB with professional UI/UX design.

![Personal Finance Visualizer](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🎯 **Assignment Submission**

**Task**: Personal Finance Visualizer - A simple web application for tracking personal finances.

**Stack Requirements**: ✅ Next.js, React, shadcn/ui, Recharts, MongoDB
**Design Requirements**: ✅ Responsive design with error states
**Currency**: ✅ Indian Rupees (INR) formatting throughout

## ✅ **Required Features Implementation**

### **Core Features (100% Complete)**
- ✅ **Add/Edit/Delete transactions** (amount, date, description)
- ✅ **Transaction list view** with professional styling
- ✅ **Monthly expenses bar chart** with interactive tooltips
- ✅ **Basic form validation** with comprehensive error handling
- ✅ **Predefined categories** for transactions (15+ categories)
- ✅ **Category-wise pie chart** with donut design and legend
- ✅ **Dashboard with summary cards** (total expenses, category breakdown, recent transactions)
- ✅ **Set monthly category budgets** with easy-to-use interface
- ✅ **Budget vs actual comparison chart** with performance metrics
- ✅ **Simple spending insights** with personalized recommendations

### **Enhanced Features**
- 🇮🇳 **INR Currency Support** - All amounts in Indian Rupees
- 📱 **Fully Responsive Design** - Works on mobile, tablet, and desktop
- 🎨 **Professional UI/UX** - Modern gradients, shadows, and animations
- 🔄 **Real-time Updates** - Instant data refresh across components
- 📊 **Interactive Charts** - Hover effects, tooltips, and smooth transitions
- ⚡ **Loading States** - Professional loading indicators throughout
- 🚨 **Error Handling** - Comprehensive error states and user feedback

## 🚀 **Tech Stack (As Required)**

- **Frontend**: Next.js 15.3.5, React 19, TypeScript 5
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 4 with custom animations
- **Charts**: Recharts 3.0.2 for data visualization
- **Database**: MongoDB Atlas with connection pooling
- **Icons**: Lucide React for consistent iconography
- **Notifications**: Sonner for toast messages
- **Deployment**: Vercel (production-ready)

## � **Quick Start**

### **Live Demo**
🌐 **Deployment URL**: [https://personal-finance-visualizer-psi.vercel.app](https://personal-finance-visualizer-psi.vercel.app)

### **Local Development**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/personal-finance-visualizer.git
   cd personal-finance-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   MONGODB_DB=personal_finance
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### **Production Build**
```bash
npm run build
npm start
```

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

**Built with ❤️ for the Personal Finance Visualizer Assignment**
*Demonstrating full-stack development skills with modern technologies*
