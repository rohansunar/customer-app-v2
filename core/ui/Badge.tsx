import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface BadgeProps {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge = ({
  label,
  backgroundColor,
  textColor,
  borderColor,
  style,
  textStyle,
}: BadgeProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor || colors.background,
          borderColor: borderColor || 'transparent',
          borderWidth: borderColor ? 1 : 0,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: textColor || colors.textPrimary,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: spacing.radius.s,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
});
