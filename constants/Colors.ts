/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
    light: {
        text:               '#202020',
        textContrast:       '#FFFFFF',
        background:         '#FFFFFF',
        tint:               tintColorLight,
        icon:               '#202020',
        tabIconDefault:     '#FFFFFF',
        tabIconSelected:    '#FFFFFF44',
        primary:            '#FF5900',
        secondary:          '#FFFFFF',
        input:              '#e2e2e2ff',
        placeholder:        '#00000044',
        error:              '#FF6666',
        gradientStart:      '#D80F07',
        gradientEnd:        '#FF8C11',
    },
    dark: {
        text:               '#FFFFFF',
        textContrast:       '#202020',
        background:         '#161616',
        tint:               tintColorDark,
        icon:               '#FFFFFF',
        tabIconDefault:     '#FFFFFF',
        tabIconSelected:    '#FFFFFF44',
        primary:            '#FF5900',
        secondary:          '#202020',
        input:              '#202020',
        placeholder:        '#FFFFFF44',
        error:              '#FF6666',
        gradientStart:      '#D80F07',
        gradientEnd:        '#FF8C11'
    }
};

export const CategoryColors = {
    NEED: {
        light: '#ff690055',
        dark: '#813600',
    },
    WANT: {
        light: '#00bba755',
        dark: '#006d62',
    },
    SAVING: {
        light: '#00c95155',
        dark: '#005823',
    },
    INCOME: {
        light: '#28a74555',
        dark: '#1e5f32',
    },
};

export type CategoryType = keyof typeof CategoryColors;