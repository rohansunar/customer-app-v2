import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text, TextProps } from 'react-native';

type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme].text;

  const textStyles = {
    default: { fontSize: 16 },
    title: { fontSize: 20, fontWeight: 'bold' },
    defaultSemiBold: { fontSize: 16, fontWeight: '600' },
    subtitle: { fontSize: 14, color: Colors[theme].tabIconDefault },
    link: { fontSize: 16, color: Colors[theme].tint },
  };

  return <Text style={[{ color }, textStyles[type], style]} {...rest} />;
}