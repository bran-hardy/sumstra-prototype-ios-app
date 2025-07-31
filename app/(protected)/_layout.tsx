import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { HapticTab } from '@/components/other/HapticTab';
import { AppConfig, Colors } from '@/constants';
import { useColorScheme, useThemeColor } from '@/hooks';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { BarChart2, DollarSign, FileText, Home } from 'lucide-react-native';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const tabBackground = useThemeColor('primary');

    const screenOptions: BottomTabNavigationOptions = {
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarIconStyle: styles.icon,
        tabBarActiveBackgroundColor: '#FFFFFF44',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: [
            { backgroundColor: tabBackground, },
            styles.container
        ],
    }

    return (
        <Tabs
            screenOptions={screenOptions}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <Home size={28} color={ color } />,
                }}
            />
            <Tabs.Screen
                name="income"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <DollarSign size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="expense"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <FileText size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="charts"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <BarChart2 size={28} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: AppConfig.BORDER_RADIUS.xxl,
        height: 64,
        position: 'absolute',
    },
    icon: {
        color: '#FFFFFF',
    }
});