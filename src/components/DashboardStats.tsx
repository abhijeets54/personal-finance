'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardStats as DashboardStatsType } from '@/types';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart, Clock } from 'lucide-react';

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500 py-8">
        Failed to load dashboard statistics
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-800">Total Income</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(stats.totalIncome)}</div>
            <p className="text-xs text-blue-600 mt-1 font-medium">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-red-800">Total Expenses</CardTitle>
            <div className="p-2 bg-red-500/10 rounded-full">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{formatCurrency(stats.totalExpenses)}</div>
            <p className="text-xs text-red-600 mt-1 font-medium">All time spending</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 ${stats.netAmount >= 0 ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-semibold ${stats.netAmount >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              Net Amount
            </CardTitle>
            <div className={`p-2 rounded-full ${stats.netAmount >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <DollarSign className={`h-4 w-4 ${stats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.netAmount >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              {formatCurrency(stats.netAmount)}
            </div>
            <p className={`text-xs mt-1 font-medium ${stats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.netAmount >= 0 ? 'Financial surplus' : 'Budget deficit'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-800">Transactions</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-full">
              <CreditCard className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.transactionCount}</div>
            <p className="text-xs text-purple-600 mt-1 font-medium">Total recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories and Recent Transactions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <PieChart className="h-5 w-5 text-blue-600" />
              </div>
              Top Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topCategories.length > 0 ? (
              <div className="space-y-4">
                {stats.topCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 hover:bg-white/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full shadow-sm bg-gradient-to-r ${
                        index === 0 ? 'from-blue-400 to-blue-600' :
                        index === 1 ? 'from-red-400 to-red-600' :
                        index === 2 ? 'from-green-400 to-green-600' :
                        index === 3 ? 'from-yellow-400 to-yellow-600' :
                        'from-purple-400 to-purple-600'
                      }`}></div>
                      <span className="text-sm font-semibold text-gray-800">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{formatCurrency(category.amount)}</div>
                      <div className="text-xs text-gray-600 font-medium">{category.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <PieChart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium">No expense data available</p>
                <p className="text-sm mt-1">Start adding expenses to see categories</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
              <div className="p-2 bg-green-500/10 rounded-full">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {stats.recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 hover:bg-white/80 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{transaction.description}</div>
                      <div className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                        <span className="font-medium">{formatDate(transaction.date)}</span>
                        <Badge variant="outline" className="text-xs font-medium bg-white/50">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                    <div className={`font-bold text-sm ml-3 ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium">No transactions yet</p>
                <p className="text-sm mt-1">Add your first transaction to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
