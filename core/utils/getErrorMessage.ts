import { AxiosError } from 'axios';

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 502) {
      return 'Service temporarily unavailable. Please try again later.';
    }

    return error.response?.data?.message ?? error.message ?? 'Request failed';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error';
}
