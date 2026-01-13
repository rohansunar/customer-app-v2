import { colors } from '@/core/theme/colors';
import { typography } from '@/core/theme/typography';
import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

interface Props extends TextProps {
  variant?: keyof typeof typography.size;
  weight?: keyof typeof typography.weight;
  color?: string;
  centered?: boolean;
}

export function Text({
  style,
  variant = 'm',
  weight = 'regular',
  color = colors.textPrimary,
  centered,
  ...props
}: Props) {
  return (
    <RNText
      style={[
        {
          fontSize: typography.size[variant],
          fontWeight: typography.weight[weight] as any,
          lineHeight:
            typography.lineHeight[
              variant as keyof typeof typography.lineHeight
            ] || typography.lineHeight.m,
          color: color,
          textAlign: centered ? 'center' : 'auto',
        },
        style,
      ]}
      {...props}
    />
  );
}
