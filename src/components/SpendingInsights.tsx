'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardStats, CategorySummary, MonthlyExpense } from '@/types';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

interface Insight {
  type: 'warning' | 'success' | 'info' | 'tip';
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function SpendingInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateInsights = useCallback(async () => {
    try {
      const [dashboardResponse, categoriesResponse, monthlyResponse] = await Promise.all([
        fetch('/api/analytics/dashboard'),
        fetch('/api/analytics/categories'),
        fetch('/api/analytics/monthly')
      ]);

      const [dashboardResult, categoriesResult, monthlyResult] = await Promise.all([
        dashboardResponse.json(),
        categoriesResponse.json(),
        monthlyResponse.json()
      ]);

      if (dashboardResult.success && categoriesResult.success && monthlyResult.success) {
        const generatedInsights = analyzeSpendingPatterns(
          dashboardResult.data,
          categoriesResult.data,
          monthlyResult.data
        );
        setInsights(generatedInsights);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  const analyzeSpendingPatterns = (
    dashboard: DashboardStats,
    categories: CategorySummary[],
    monthly: MonthlyExpense[]
  ): Insight[] => {
    const insights: Insight[] = [];

    // Helper function to format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount);
    };

    // Net amount analysis
    if (dashboard.netAmount < 0) {
      insights.push({
        type: 'warning',
        title: 'Spending Exceeds Income',
        description: `You're spending ${formatCurrency(Math.abs(dashboard.netAmount))} more than you earn. Consider reviewing your expenses.`,
        icon: <AlertTriangle className="h-5 w-5" />
      });
    } else if (dashboard.netAmount > 0) {
      insights.push({
        type: 'success',
        title: 'Positive Cash Flow',
        description: `Great job! You have a surplus of ${formatCurrency(dashboard.netAmount)}. Consider investing or saving this amount.`,
        icon: <CheckCircle className="h-5 w-5" />
      });
    }

    // Category analysis
    if (categories.length > 0) {
      const topCategory = categories[0];
      if (topCategory.percentage > 40) {
        insights.push({
          type: 'warning',
          title: 'High Concentration in One Category',
          description: `${topCategory.category} accounts for ${topCategory.percentage.toFixed(1)}% of your expenses. Consider diversifying your spending.`,
          icon: <AlertTriangle className="h-5 w-5" />
        });
      }

      // Food & Dining analysis
      const foodCategory = categories.find(c => c.category === 'Food & Dining');
      if (foodCategory && foodCategory.percentage > 25) {
        insights.push({
          type: 'tip',
          title: 'High Food Expenses',
          description: `Food & Dining is ${foodCategory.percentage.toFixed(1)}% of your expenses. Try meal planning or cooking at home to save money.`,
          icon: <Lightbulb className="h-5 w-5" />
        });
      }
    }

    // Monthly trend analysis
    if (monthly.length >= 2) {
      const lastMonth = monthly[monthly.length - 1];
      const previousMonth = monthly[monthly.length - 2];
      const changePercent = ((lastMonth.amount - previousMonth.amount) / previousMonth.amount) * 100;

      if (changePercent > 20) {
        insights.push({
          type: 'warning',
          title: 'Spending Increased Significantly',
          description: `Your expenses increased by ${changePercent.toFixed(1)}% compared to last month. Review recent purchases.`,
          icon: <TrendingUp className="h-5 w-5" />
        });
      } else if (changePercent < -10) {
        insights.push({
          type: 'success',
          title: 'Spending Decreased',
          description: `Great! Your expenses decreased by ${Math.abs(changePercent).toFixed(1)}% compared to last month.`,
          icon: <TrendingDown className="h-5 w-5" />
        });
      }
    }

    // Transaction frequency analysis
    if (dashboard.transactionCount > 0) {
      const avgTransactionAmount = dashboard.totalExpenses / dashboard.transactionCount;
      if (avgTransactionAmount < 1000) { // Adjusted threshold for INR (roughly equivalent to $20)
        insights.push({
          type: 'tip',
          title: 'Many Small Transactions',
          description: `You have many small transactions (avg ${formatCurrency(avgTransactionAmount)}). Consider bundling purchases to reduce fees.`,
          icon: <Lightbulb className="h-5 w-5" />
        });
      }
    }

    // Savings rate analysis
    if (dashboard.totalIncome > 0) {
      const savingsRate = (dashboard.netAmount / dashboard.totalIncome) * 100;
      if (savingsRate >= 20) {
        insights.push({
          type: 'success',
          title: 'Excellent Savings Rate',
          description: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up the great work!`,
          icon: <CheckCircle className="h-5 w-5" />
        });
      } else if (savingsRate < 10 && savingsRate > 0) {
        insights.push({
          type: 'tip',
          title: 'Low Savings Rate',
          description: `You're saving ${savingsRate.toFixed(1)}% of your income. Aim for at least 20% for better financial health.`,
          icon: <Lightbulb className="h-5 w-5" />
        });
      }
    }

    // General tips if no specific insights
    if (insights.length === 0) {
      insights.push({
        type: 'info',
        title: 'Start Tracking More Transactions',
        description: 'Add more transactions to get personalized insights about your spending patterns.',
        icon: <Lightbulb className="h-5 w-5" />
      });
    }

    return insights.slice(0, 6); // Limit to 6 insights
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-red-200 bg-red-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'tip':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      case 'tip':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 rounded-lg bg-gray-50">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <Lightbulb className="h-5 w-5" />
          Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getInsightColor(insight.type)} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <div className={`${getIconColor(insight.type)} mt-0.5`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                  <p className="text-gray-700 text-sm">{insight.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {insight.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
