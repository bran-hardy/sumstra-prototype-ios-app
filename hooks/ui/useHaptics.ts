import * as Haptics from 'expo-haptics';
import { useCallback } from "react";
import { Platform } from "react-native";

type FeedbackType = 
    | 'light'
    | 'medium'
    | 'heavy'
    | 'selection'
    | 'success'
    | 'warning'
    | 'error';

export type HapticAction =
    | 'tap'
    | 'longPress'
    | 'swipeStart'
    | 'swipeThreshold'
    | 'swipeAction'
    | 'delete'
    | 'edit'
    | 'save'
    | 'cancel'
    | 'refresh'
    | 'navigation'

export const useHaptic = () => {
    const createHapticHandler = useCallback(
        (type: Haptics.ImpactFeedbackStyle) => {
            return Platform.OS === 'web' ? undefined : Haptics.impactAsync(type);
    }, []);

    const createNotificationFeedback = useCallback(
        (type: Haptics.NotificationFeedbackType) => {
            return Platform.OS === 'web' ? undefined : Haptics.notificationAsync(type);
    }, []);

    const triggerHaptic = useCallback((type: FeedbackType) => {
        try {
            switch (type) {
                case 'light':
                    createHapticHandler(Haptics.ImpactFeedbackStyle.Light);
                    break;
                case 'medium':
                    createHapticHandler(Haptics.ImpactFeedbackStyle.Medium);
                    break;
                case 'heavy':
                    createHapticHandler(Haptics.ImpactFeedbackStyle.Heavy);
                    break;
                case 'success':
                    createNotificationFeedback(Haptics.NotificationFeedbackType.Success);
                    break;
                case 'warning':
                    createNotificationFeedback(Haptics.NotificationFeedbackType.Warning);
                    break;
                case 'error':
                    createNotificationFeedback(Haptics.NotificationFeedbackType.Error);
                    break;
                case 'selection':
                    Haptics.selectionAsync();
                    break;
            }
        } catch (error) {
            console.warn('Haptic feedback failed:', error);
        }
    }, [createHapticHandler, createNotificationFeedback]);

    const triggerActionHaptic = useCallback((action: HapticAction) => {
        const actionMap: Record<HapticAction, FeedbackType> = {
            tap: 'light',
            longPress: 'medium',
            swipeStart: 'light',
            swipeThreshold: 'light',
            swipeAction: 'medium',
            delete: 'heavy',
            edit: 'medium',
            save: 'success',
            cancel: 'light',
            refresh: 'medium',
            navigation: 'selection',
        };

        triggerHaptic(actionMap[action]);
    }, [triggerHaptic]);

    // Convenience methods for common patterns
    const onTap = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
    const onLongPress = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
    const onDelete = useCallback(() => triggerHaptic('heavy'), [triggerHaptic]);
    const onEdit = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
    const onSuccess = useCallback(() => triggerHaptic('success'), [triggerHaptic]);
    const onError = useCallback(() => triggerHaptic('error'), [triggerHaptic]);

    return {
        triggerHaptic,
        triggerActionHaptic,
        onTap,
        onLongPress,
        onDelete,
        onEdit,
        onSuccess,
        onError,
    };
};