'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategorySummary } from '@/types';

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
  '#14b8a6', '#f43f5e', '#8b5cf6', '#06b6d4', '#84cc16'
];

const GRADIENT_COLORS = [
  { start: '#3b82f6', end: '#1d4ed8' },
  { start: '#ef4444', end: '#dc2626' },
  { start: '#10b981', end: '#059669' },
  { start: '#f59e0b', end: '#d97706' },
  { start: '#8b5cf6', end: '#7c3aed' },
  { start: '#06b6d4', end: '#0891b2' },
  { start: '#84cc16', end: '#65a30d' },
  { start: '#f97316', end: '#ea580c' },
  { start: '#ec4899', end: '#db2777' },
  { start: '#6366f1', end: '#4f46e5' }
];

export function CategoryPieChart() {
  const [data, setData] = useState<CategorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await fetch('/api/analytics/categories');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border-none rounded-xl shadow-xl">
          <p className="font-bold text-gray-800 text-lg">{data.category}</p>
          <p className="text-blue-600 font-semibold text-base">{formatCurrency(data.amount)}</p>
          <p className="text-gray-600 text-sm">{data.percentage.toFixed(1)}% of total</p>
          <p className="text-gray-600 text-sm">{data.count} transactions</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, category }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for slices less than 5%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
        style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.7))' }}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
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
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
          Category Breakdown
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">Expense distribution by category</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {GRADIENT_COLORS.map((color, index) => (
                  <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color.start} />
                    <stop offset="100%" stopColor={color.end} />
                  </linearGradient>
                ))}
                <filter id="pieShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.15"/>
                </filter>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={110}
                innerRadius={40}
                fill="#8884d8"
                dataKey="amount"
                filter="url(#pieShadow)"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index % GRADIENT_COLORS.length})`}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Legend */}
        {data.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.map((entry, index) => (
              <div key={entry.category} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50/50 transition-colors">
                <div
                  className="w-4 h-4 rounded-full shadow-md flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${GRADIENT_COLORS[index % GRADIENT_COLORS.length].start}, ${GRADIENT_COLORS[index % GRADIENT_COLORS.length].end})`
                  }}
                ></div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-800 block truncate">{entry.category}</span>
                  <span className="text-xs text-gray-500">{entry.percentage.toFixed(1)}%</span>
                </div>
                <span className="text-sm font-bold text-gray-700">{formatCurrency(entry.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {data.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="font-medium">No category data available</p>
            <p className="text-sm mt-1">Add some expenses to see the breakdown</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
