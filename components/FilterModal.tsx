
import { useEffect, useRef, useState } from 'react';
import { Animated, InteractionManager, Pressable, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Button from './ui/Button';

type FilterModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSelect: (filter: string) => void;
    position?: { bottom: number; left: number; };
}

const FILTERS = ['ALL', 'NEED', 'WANT', 'SAVING', 'THIS_MONTH'];
const buttonOffset = -150;

export default function FilterModal({ isVisible, onClose, onSelect, position = { bottom: 165, left: 20 } }: FilterModalProps) {
    const [rendered, setRendered] = useState(isVisible);
    const animations = useRef(
        FILTERS.map(() => new Animated.Value(buttonOffset))
    ).current;

    useEffect(() => {
        setRendered(true);
        if (isVisible) {
            handleEntry();
        } else if (rendered) {
            handleExit();
        }
    }, [isVisible]);

    function handleEntry() {
        Animated.stagger(25,
            animations.map(anim =>
                Animated.spring(anim, {
                    toValue: 0,
                    useNativeDriver: true,
                })
            ).reverse()
        ).start();
    }

    function handleExit() {
        Animated.stagger(0,
            animations.map(anim =>
                Animated.timing(anim, {
                    toValue: buttonOffset,
                    duration: 200,
                    useNativeDriver: true,
                })
            ).reverse()
        ).start(() => {
            InteractionManager.runAfterInteractions(() => {
                setRendered(false);
                onClose();
            })
        });
    }

    if (!rendered) return null;

    return (
        <TouchableWithoutFeedback onPress={() => !isVisible && onClose()}>
            <Pressable
                onPress={(e) => e.stopPropagation()}
                style={[styles.modal,
                { bottom: position.bottom, left: position.left }
                ]}
            >
                {FILTERS.map((filter, index) => (
                    <Animated.View
                        key={filter}
                        style={{
                            transform: [{ translateX: animations[index] }],
                        }}
                    >
                        <Button
                            key={filter}
                            buttonStyle={styles.button}
                            onPress={() => {
                                onSelect(filter);
                            }}
                            title={(filter[0] + filter.slice(1).toLowerCase()).replace('_', ' ')}
                        />
                    </Animated.View>
                ))}
            </Pressable>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: 150,
    },
    button: {
        flexGrow: 0,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 100,
        marginVertical: 4,
        boxShadow: '0 10px 20px -10px #00000088'
    },
});