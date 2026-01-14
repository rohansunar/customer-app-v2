import { statusColors } from '@/core/theme/statusColors';
import { Badge } from '@/core/ui/Badge';
import React from 'react';
import { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = statusColors[status] || {
    background: '#F0F0F0',
    text: '#333',
  };

  return (
    <Badge
      label={status}
      backgroundColor={styles.background}
      textColor={styles.text}
      style={{ marginTop: 8 }}
    />
  );
}
