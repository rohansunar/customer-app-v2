import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { orderService } from '../services/orderService';

export function useSubmitSupportTicket() {
  return useMutation({
    mutationFn: (payload: {
      orderNo: string;
      subject: string;
      message: string;
    }) => orderService.submitSupportTicket(payload),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Ticket Submitted',
        text2: 'We have received your request and will get back to you soon.',
      });
    },
    onError: (error) => {
      console.error('Support ticket submission failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: 'Could not submit your request. Please try again.',
      });
    },
  });
}
