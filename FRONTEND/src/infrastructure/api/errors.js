export class ApiError extends Error {
  constructor(message, status, code, validationErrors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.validationErrors = validationErrors;
  }
}

export function normalizeError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.response) {
    const status = error.response.status;
    const responseData = error.response.data || {};
    const message = responseData.message || responseData.error || 'Server error';
    const code = responseData.code || 'SERVER_ERROR';
    const validationErrors = responseData.errors || null;

    return new ApiError(message, status, code, validationErrors);
  }

  if (error.request) {
    return new ApiError('No response received from the server', 0, 'NETWORK_ERROR');
  }

  return new ApiError(error.message || 'An unexpected error occurred', 500, 'UNKNOWN_ERROR');
}
