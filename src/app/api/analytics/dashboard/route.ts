import { dbService } from '@/lib/db-utils';
import { createSuccessResponse, withErrorHandling } from '@/lib/api-utils';

export const GET = withErrorHandling(async () => {
  const stats = await dbService.getDashboardStats();
  return createSuccessResponse(stats);
});
