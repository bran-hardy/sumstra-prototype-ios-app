import { CategoryColors, CategoryType } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export const useCategoryColor = (category: string): string => {
    const scheme = useColorScheme();
    const safeCategory = category.toUpperCase() as CategoryType;

    return CategoryColors[safeCategory]?.[scheme ?? 'light'] || '#ccc';
}