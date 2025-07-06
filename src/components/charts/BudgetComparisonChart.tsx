'use client';

import { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BudgetComparison } from '@/types';

export function BudgetComparisonChart() {
  const [data, setData] = useState<BudgetComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // Current month
  );

  const fetchBudgetComparison = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/budget-comparison?month=${selectedMonth}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching budget comparison:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchBudgetComparison();
  }, [fetchBudgetComparison]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      dataKey: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const budgeted = payload.find((p) => p.dataKey === 'budgeted')?.value || 0;
      const actual = payload.find((p) => p.dataKey === 'actual')?.value || 0;
      const remaining = budgeted - actual;
      const percentage = budgeted > 0 ? ((actual / budgeted) * 100) : 0;

      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border-none rounded-xl shadow-xl">
          <p className="font-bold text-gray-800 text-lg mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-blue-600 font-semibold">Budgeted: {formatCurrency(budgeted)}</p>
            <p className="text-red-600 font-semibold">Actual: {formatCurrency(actual)}</p>
            <p className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {remaining >= 0 ? 'Remaining' : 'Over budget'}: {formatCurrency(Math.abs(remaining))}
            </p>
            <p className="text-gray-600 text-sm">
              Used: {percentage.toFixed(1)}% of budget
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Generate month options for the last 12 months
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-green-50/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            Budget vs Actual Performance
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Compare planned vs actual spending by category</p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {generateMonthOptions().map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
              barCategoryGap="25%"
            >
              <defs>
                <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7} />
                </linearGradient>
                <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                strokeOpacity={0.6}
                vertical={false}
              />
              <XAxis
                dataKey="category"
                stroke="#64748b"
                fontSize={12}
                fontWeight={500}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                tickLine={{ stroke: '#cbd5e1' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                fontWeight={500}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                tickLine={{ stroke: '#cbd5e1' }}
                tickFormatter={formatCurrency}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              <Bar
                dataKey="budgeted"
                fill="url(#budgetGradient)"
                name="Budgeted"
                radius={[6, 6, 0, 0]}
                filter="url(#barShadow)"
              />
              <Bar
                dataKey="actual"
                fill="url(#actualGradient)"
                name="Actual"
                radius={[6, 6, 0, 0]}
                filter="url(#barShadow)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        {data.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                <span className="text-sm font-semibold text-blue-800">Total Budgeted</span>
              </div>
              <p className="text-xl font-bold text-blue-900">
                {formatCurrency(data.reduce((sum, item) => sum + item.budgeted, 0))}
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                <span className="text-sm font-semibold text-red-800">Total Actual</span>
              </div>
              <p className="text-xl font-bold text-red-900">
                {formatCurrency(data.reduce((sum, item) => sum + item.actual, 0))}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-800">Variance</span>
              </div>
              <p className={`text-xl font-bold ${
                data.reduce((sum, item) => sum + item.actual, 0) > data.reduce((sum, item) => sum + item.budgeted, 0)
                  ? 'text-red-900'
                  : 'text-green-900'
              }`}>
                {formatCurrency(
                  data.reduce((sum, item) => sum + item.actual, 0) -
                  data.reduce((sum, item) => sum + item.budgeted, 0)
                )}
              </p>
            </div>
          </div>
        )}

        {data.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="font-medium">No budget data available</p>
            <p className="text-sm mt-1">
              for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
