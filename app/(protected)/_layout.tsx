import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/other/HapticTab';
import { TabBarBackground } from '@/components/ui';
import { Colors } from '@/constants';
import { useColorScheme } from '@/hooks';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: 'Income',
          tabBarIcon: ({ color }) => <Feather size={28} name="plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="expense"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <Feather size={28} name="dollar-sign" color={color} />,
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          title: 'Charts',
          tabBarIcon: ({ color }) => <Feather size={28} name="bar-chart-2" color={color} />,
        }}
      />
    </Tabs>
  );
}
