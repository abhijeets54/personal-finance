import { NextRequest } from 'next/server';
// Lazy load heavy dependencies to improve cold start
const getDbService = () => import('@/lib/db-utils').then(m => m.dbService);
const getApiUtils = () => import('@/lib/api-utils');

export async function GET(request: NextRequest) {
  const { withErrorHandling, createSuccessResponse } = await getApiUtils();

  return withErrorHandling(async () => {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');

    // Simple validation for limit parameter
    let limit = 20; // default
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }
      limit = parsedLimit;
    }

    const dbService = await getDbService();
    const transactions = await dbService.getTransactions(limit);
    return createSuccessResponse(transactions);
  })();
}

export async function POST(request: NextRequest) {
  const { withErrorHandling, createSuccessResponse } = await getApiUtils();
  const { validateInput, TransactionSchema } = await import('@/lib/validation');

  return withErrorHandling(async () => {
    const body = await request.json();

    // Validate input using Zod schema
    const validatedData = validateInput(TransactionSchema, body);

    const dbService = await getDbService();
    const id = await dbService.createTransaction(validatedData);
    return createSuccessResponse({ id }, 201);
  })();
}
