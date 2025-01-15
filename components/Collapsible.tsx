import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

export function Collapsible({ children, title, extraButton, ...props }: PropsWithChildren<ViewProps> & { title: string; extraButton?: React.ReactNode; }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View {...props}>


            <TouchableOpacity
                style={styles.heading}
                onPress={() => setIsOpen((value) => !value)}
                activeOpacity={0.8}>

                <View style={styles.foo}>
                    <MaterialIcons
                        name="chevron-right"
                        size={18}
                        weight="medium"
                        style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
                    />
                    <ThemedText type="defaultSemiBold">{title}</ThemedText>
                </View>

                {extraButton}
            </TouchableOpacity>
            {isOpen && <View style={styles.content}>{children}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    foo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },

    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    content: {
        marginTop: 6,
        marginLeft: 24,
    },
});
