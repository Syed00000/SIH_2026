import { normalizeError, ApiError } from './errors.js';

describe('API Error Normalization', () => {
  it('should return ApiError instance unmodified', () => {
    const originalError = new ApiError('Custom error', 400, 'BAD_REQUEST');
    const result = normalizeError(originalError);
    expect(result).toBe(originalError);
  });

  it('should normalize server response error', () => {
    const errorMock = {
      response: {
        status: 400,
        data: {
          message: 'Invalid parameters',
          code: 'VALIDATION_FAILED',
          errors: { email: 'Email already exists' },
        },
      },
    };

    const result = normalizeError(errorMock);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBe(400);
    expect(result.message).toBe('Invalid parameters');
    expect(result.code).toBe('VALIDATION_FAILED');
    expect(result.validationErrors).toEqual({ email: 'Email already exists' });
  });

  it('should handle network timeout/offline errors', () => {
    const errorMock = {
      request: {},
    };

    const result = normalizeError(errorMock);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBe(0);
    expect(result.code).toBe('NETWORK_ERROR');
    expect(result.message).toBe('No response received from the server');
  });

  it('should return generic error for unknown exceptions', () => {
    const errorMock = new Error('Random JS crash');
    const result = normalizeError(errorMock);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBe(500);
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.message).toBe('Random JS crash');
  });
});
