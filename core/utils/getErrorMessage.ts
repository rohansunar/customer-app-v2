import { AxiosError } from 'axios';

const USER_FRIENDLY_MESSAGES: Record<string, string> = {
  NETWORK_ERROR:
    'Unable to save address. Please check your internet connection and try again.',
  TIMEOUT: 'Unable to save address. Please try again.',
  400: 'Invalid address details. Please check and retry.',
  401: 'Session expired. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'Address not found. It may have been deleted.',
  409: 'This address already exists.',
  422: 'Invalid address details. Please check and retry.',
  500: 'Unable to save address. Please try again.',
  502: 'Service temporarily unavailable. Please try again later.',
  503: 'Service temporarily unavailable. Please try again later.',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status) {
      const friendlyMessage = USER_FRIENDLY_MESSAGES[status.toString()];
      if (friendlyMessage) {
        return friendlyMessage;
      }
    }

    const networkCode = error.code;
    if (networkCode === 'ECONNABORTED' || networkCode === 'NETWORK_ERROR') {
      return USER_FRIENDLY_MESSAGES.NETWORK_ERROR;
    }

    const responseMessage = error.response?.data?.message;
    if (typeof responseMessage === 'string' && responseMessage.length > 0) {
      return responseMessage;
    }

    return error.message || 'Request failed';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
