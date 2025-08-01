import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Popup, TransactionFrom } from '@/components';
import { AppConfig, Colors } from '@/constants';
import { useColorScheme, useThemeColor } from '@/hooks';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { DollarSign, FileText, Home, Plus, Settings } from 'lucide-react-native';

const CustomTabBar = ({ state, descriptors, navigation, handleAddPress }: any) => {
    const colorScheme = useColorScheme();
    const activeTintColor = Colors[colorScheme ?? 'light'].tint;

    const getTabIcon = (name: string, focused: boolean) => {
        const color = '#FFFFFF';
        const size = 28;

        switch (name) {
            case 'index':
                return <Home size={size} color={color} />
            case 'income':
                return <DollarSign size={size} color={color} />
            case 'add':
                return <Plus size={24} color='#000000' />
            case 'expense':
                return <FileText size={size} color={color} />
            case 'settings':
                return <Settings size={size} color={color} />
        }
    };

    return (
        <LinearGradient
            colors={['#E4340A', '#FF8C11']}
            start={{ x: 0.1, y: 1 }}
            end={{ x: 0.9, y: 0 }}
            style={styles.customTabBar}
        >
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const isAddButton = route.name === 'add';

                const onPress = () => {
                    if (isAddButton) {
                        handleAddPress();
                        return;
                    }

                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.preventDefaulted) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={[
                            styles.customTabItem,
                            isAddButton && styles.addTabItem
                        ]}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.tabIconContainer,
                            isAddButton && styles.addButtonStyle,
                            isFocused && !isAddButton && styles.activeTab
                        ]}>
                            {getTabIcon(route.name, isFocused)}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </LinearGradient>
    );
};

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const tabBackground = useThemeColor('primary');
    const [showAddPopup, setShowAddPopup] = useState(false);

    const screenOptions: BottomTabNavigationOptions = {
        headerShown: false,
    };

    const handleAddButtonPress = () => {
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
    }

    const handleTransactionSuccess = () => {
        setShowAddPopup(false);
        console.log('Transaction saved successfully');
    }

    return (
        <>
            <Tabs
                screenOptions={screenOptions}
                tabBar={(props) => (
                    <CustomTabBar
                        {...props}
                        handleAddPress={handleAddButtonPress}
                    />
                )}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="income" />
                <Tabs.Screen name="add" />
                <Tabs.Screen name="expense" />
                <Tabs.Screen name="settings" />
            </Tabs>

            <Popup
                visible={showAddPopup}
                onClose={handleClosePopup}
                animationType='scale'
                title='Add Transaction'
            >
                <TransactionFrom onSuccess={handleClosePopup} />
            </Popup>
        </>
    );
}

const styles = StyleSheet.create({
    customTabBar: {
        left: 20,
        right: 20,
        bottom: 20,
        flexDirection: 'row',
        borderRadius: AppConfig.BORDER_RADIUS.xxl,
        height: 64,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    customTabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    addTabItem: {
        // Special styling for add button if needed
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        width: 64,
        borderRadius: AppConfig.BORDER_RADIUS.full,
    },
    activeTab: {
        backgroundColor: '#FFFFFF44',
    },
    addButtonStyle: {
        backgroundColor: '#FFFFFF',
        width: 48,
        height: 48,
        borderRadius: AppConfig.BORDER_RADIUS.full,
        elevation: 5,
    },
});