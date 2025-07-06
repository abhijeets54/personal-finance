'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyExpense } from '@/types';

export function MonthlyExpensesChart() {
  const [data, setData] = useState<MonthlyExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      const response = await fetch('/api/analytics/monthly');
      const result = await response.json();
      
      if (result.success) {
        // Format data for chart
        const formattedData = result.data.map((item: MonthlyExpense) => ({
          ...item,
          monthName: new Date(item.month + '-01').toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          })
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching monthly data:', error);
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

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
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
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          Monthly Expenses Trend
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">Track your spending patterns over time</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
              barCategoryGap="20%"
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7} />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.3"/>
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                strokeOpacity={0.6}
                vertical={false}
              />
              <XAxis
                dataKey="monthName"
                stroke="#64748b"
                fontSize={12}
                fontWeight={500}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                tickLine={{ stroke: '#cbd5e1' }}
                angle={-45}
                textAnchor="end"
                height={60}
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
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Expenses']}
                labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar
                dataKey="amount"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                filter="url(#shadow)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {data.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No expense data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
