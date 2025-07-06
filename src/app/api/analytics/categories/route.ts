import { dbService } from '@/lib/db-utils';
import { createSuccessResponse, withErrorHandling } from '@/lib/api-utils';

export const GET = withErrorHandling(async () => {
  const categories = await dbService.getCategorySummary();
  return createSuccessResponse(categories);
});
