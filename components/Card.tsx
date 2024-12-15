import { StyleSheet, View, ViewProps } from 'react-native';

type Props = ViewProps;

export function Card(props: Props) {
    const { style, children, ...rest } = props;
    return <View style={[styles.card, style]} {...rest}>
        {children && children}
    </View>;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#e2e2e2",
        borderRadius: 8,
        padding: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
