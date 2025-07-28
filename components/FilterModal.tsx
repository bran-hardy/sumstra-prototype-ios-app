
import { AppConfig } from '@/constants/Colors';
import { FilterType } from '@/types/Transaction';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Button from './ui/Button';

type FilterModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSelect: (filter: FilterType) => void;
    currentFilter?: FilterType;
    position?: { bottom: number; left: number; };
}

const FILTERS: FilterType[] = ['ALL', 'NEED', 'WANT', 'SAVING', 'THIS_MONTH'];
const BUTTON_OFFSET = -150;

const formatFilterName = (filter: FilterType): string => {
    return filter.charAt(0) + filter.slice(1).toLowerCase().replace('_', ' ');
};

export default function FilterModal({
    isVisible,
    onClose,
    onSelect,
    currentFilter = 'ALL',
    position = { bottom: 165, left: 20 }
}: FilterModalProps) {
    const [rendered, setRendered] = useState(false);

    const animations = useRef(
        FILTERS.map(() => new Animated.Value(BUTTON_OFFSET))
    ).current;

    const handleEntry = () => {
        Animated.stagger(25,
            animations.map(anim =>
                Animated.spring(anim, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8,
                })
            ).reverse()
        ).start();
    };

    const handleExit = () => {
        Animated.stagger(0,
            animations.map(anim =>
                Animated.timing(anim, {
                    toValue: BUTTON_OFFSET,
                    duration: AppConfig.ANIMATION_DURATION.fast,
                    useNativeDriver: true,
                })
            ).reverse()
        ).start(() => {
            setRendered(false);
        });
    };

    const handleFilterSelect = (filter: FilterType) => {
        onSelect(filter);
    };

    const handleBackdropPress = () => {
        onClose();
    };

    useEffect(() => {
        if (isVisible) {
            setRendered(true)

            setTimeout(handleEntry, 10);
        } else if (rendered) {
            handleExit();
        }
    }, [isVisible, rendered]);

    if (!isVisible && !rendered) return null;

    return (
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View pointerEvents={isVisible ? 'auto' : 'none'}>
                <Pressable
                    onPress={(e) => e.stopPropagation()}
                    style={[
                        styles.modal,
                        { bottom: position.bottom, left: position.left }
                    ]}
                >
                    {FILTERS.map((filter, index) => {
                        const isSelected = filter === currentFilter;

                        return (
                            <Animated.View
                                key={filter}
                                style={{
                                    transform: [{ translateX: animations[index] }],
                                }}
                            >
                                <Button
                                    buttonStyle={[
                                        styles.button,
                                        isSelected && styles.selectedButton
                                    ]}
                                    textStyle={isSelected ? styles.selectedText : undefined}
                                    onPress={() => handleFilterSelect(filter)}
                                    title={formatFilterName(filter)}
                                />
                            </Animated.View>
                        );
                    })}
                </Pressable>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
    modal: {
        position: 'absolute',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: 150,
    },
    button: {
        flexGrow: 0,
        paddingVertical: AppConfig.SPACING.sm,
        paddingHorizontal: AppConfig.SPACING.md,
        borderRadius: AppConfig.BORDER_RADIUS.full,
        marginVertical: AppConfig.SPACING.xs,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    selectedButton: {
        opacity: 0.8,
        transform: [{ scale: 0.95 }],
    },
    selectedText: {
        fontWeight: '700',
    }
});