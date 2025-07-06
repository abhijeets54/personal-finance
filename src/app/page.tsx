'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats } from '@/components/DashboardStats';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { BudgetForm } from '@/components/BudgetForm';
import { MonthlyExpensesChart } from '@/components/charts/MonthlyExpensesChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { BudgetComparisonChart } from '@/components/charts/BudgetComparisonChart';
import { SpendingInsights } from '@/components/SpendingInsights';
import { BarChart3, PieChart, TrendingUp, Wallet, Lightbulb } from 'lucide-react';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Personal Finance Visualizer
        </h1>
        <p className="text-gray-600 text-lg">
          Track, analyze, and visualize your financial journey
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/50 backdrop-blur-sm border border-gray-200">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="budgets" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Budgets
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <DashboardStats key={refreshTrigger} />
          
          <div className="grid gap-6 lg:grid-cols-2">
            <MonthlyExpensesChart />
            <CategoryPieChart />
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <TransactionForm onTransactionCreated={handleDataChange} />
            </div>
            <div className="lg:col-span-2">
              <TransactionList 
                refreshTrigger={refreshTrigger} 
                onTransactionDeleted={handleDataChange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6">
            <MonthlyExpensesChart />
            <div className="grid gap-6 lg:grid-cols-2">
              <CategoryPieChart />
              <BudgetComparisonChart />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <BudgetForm onBudgetCreated={handleDataChange} />
            </div>
            <div className="lg:col-span-2">
              <BudgetComparisonChart />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <SpendingInsights key={refreshTrigger} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
