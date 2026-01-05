export function getErrorMessage(error: any): string {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong! Please Try Later'
  );
}
