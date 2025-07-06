import { NextRequest } from 'next/server';
import { dbService } from '@/lib/db-utils';
import { createSuccessResponse, withErrorHandling } from '@/lib/api-utils';

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');

  if (!month) {
    throw new Error('Month parameter is required');
  }

  // Validate month format
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error('Month must be in YYYY-MM format');
  }

  const comparison = await dbService.getBudgetComparison(month);
  return createSuccessResponse(comparison);
});
