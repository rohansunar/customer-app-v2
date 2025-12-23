import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { profileService } from '../services/profileService';
import { Profile } from '../types';

export function useProfile() {
  const queryFn = useCallback(() => profileService.getProfile(), []);
  return useQuery<Profile>({
    queryKey: ['profile'],
    queryFn,
  });
}
