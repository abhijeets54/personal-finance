import { NextResponse } from 'next/server';

// Standard API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  code?: string;
}

// Standard error types
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  BAD_REQUEST = 'BAD_REQUEST',
}

// Custom error class for API errors
export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly details?: string;

  constructor(
    message: string,
    code: ApiErrorCode,
    statusCode: number,
    details?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Standard success response helper
export function createSuccessResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: statusCode }
  );
}

// Standard error response helper
export function createErrorResponse(
  error: string,
  statusCode: number = 500,
  code?: ApiErrorCode,
  details?: string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      details,
    },
    { status: statusCode }
  );
}

// Error handler for API routes
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return createErrorResponse(
      error.message,
      error.statusCode,
      error.code,
      error.details
    );
  }

  if (error instanceof Error) {
    // Check for specific MongoDB errors
    if (error.message.includes('MongoServerError')) {
      return createErrorResponse(
        'Database operation failed',
        500,
        ApiErrorCode.DATABASE_ERROR,
        error.message
      );
    }

    // Check for validation errors
    if (error.message.includes('validation') || error.message.includes('required')) {
      return createErrorResponse(
        'Validation failed',
        400,
        ApiErrorCode.VALIDATION_ERROR,
        error.message
      );
    }

    return createErrorResponse(
      'Internal server error',
      500,
      ApiErrorCode.INTERNAL_ERROR,
      error.message
    );
  }

  return createErrorResponse(
    'Unknown error occurred',
    500,
    ApiErrorCode.INTERNAL_ERROR
  );
}

// Async wrapper for API route handlers
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse<ApiResponse<R>>>
) {
  return async (...args: T): Promise<NextResponse<ApiResponse<R>>> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Validation helper
export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  );

  if (missingFields.length > 0) {
    throw new ApiError(
      `Missing required fields: ${missingFields.join(', ')}`,
      ApiErrorCode.VALIDATION_ERROR,
      400
    );
  }
}

// Type guard for checking if value is a positive number
export function isPositiveNumber(value: any): value is number {
  return typeof value === 'number' && value > 0 && !isNaN(value);
}

// Sanitize string input
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
