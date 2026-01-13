import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { View, ViewProps } from 'react-native';

type ThemedViewProps = ViewProps & {
  type?: 'default' | 'background';
};

export function ThemedView({
  style,
  type = 'default',
  ...rest
}: ThemedViewProps) {
  const theme = useColorScheme() ?? 'light';
  const backgroundColor =
    type === 'background' ? Colors[theme].background : undefined;

  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
