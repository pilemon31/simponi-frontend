import { AUTH_ERROR_MESSAGES } from '@/constants/error-messages';

type ErrorMapping = Record<string, string>;

export const mapErrorMessage = (
  errorMessage: string,
  customMapping?: ErrorMapping,
): string => {
  const mappingToUse: ErrorMapping = {
    ...(AUTH_ERROR_MESSAGES as Record<string, string>),
    ...customMapping,
  };

  const normalizedError = (errorMessage || '').toLowerCase().trim();

  return mappingToUse[normalizedError] || errorMessage;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapErrorResponse = <T extends Record<string, any>>(
  errorResponse: T,
  customMapping?: ErrorMapping,
): T => {
  return {
    ...errorResponse,
    error: mapErrorMessage(errorResponse.error || '', customMapping),
    message: mapErrorMessage(errorResponse.message || '', customMapping),
  };
};
