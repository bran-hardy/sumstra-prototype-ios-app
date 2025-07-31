/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants';
import { useColorScheme } from '@/hooks/ui/useColorScheme';

export const useThemeColor = (
    colorName: 
        keyof typeof Colors.light & 
        keyof typeof Colors.dark,
    props?: { 
        light?: string;
        dark?: string;
    }
): string => {
    const theme = useColorScheme() ?? 'light';
    let colorFromProps = undefined;

    // Check if a prop for light or dark has been called
    if (props) {
        colorFromProps = props[theme];
    }

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}
