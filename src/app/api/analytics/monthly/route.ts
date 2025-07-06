import { dbService } from '@/lib/db-utils';
import { createSuccessResponse, withErrorHandling } from '@/lib/api-utils';

export const GET = withErrorHandling(async () => {
  const monthlyExpenses = await dbService.getMonthlyExpenses();
  return createSuccessResponse(monthlyExpenses);
});
