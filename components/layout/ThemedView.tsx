import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks';

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export default function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
    const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

    return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
