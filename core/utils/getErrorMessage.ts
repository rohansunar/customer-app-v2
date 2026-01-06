export function getErrorMessage(error: any): string {
  const { message } = error?.response?.data;
  if (Array.isArray(message)) {
    return message.join('\n');
  }
  return message || error?.message || 'Something went wrong! Please Try Later';
}
