import { ThemedText } from '@/components/layout';
import React from 'react';
import { View } from 'react-native';

// This is a dummy page that will never be shown
// since we intercept the tab press in the TabLayout
export default function AddPage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ThemedText>This page should not be visible</ThemedText>
        </View>
    );
}