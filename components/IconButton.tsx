import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export function IconButton({ onPress, ...props }: { onPress?: () => void; } & React.ComponentProps<typeof MaterialIcons>) {
    return <TouchableOpacity disabled={props.disabled} onPress={onPress}>
        <MaterialIcons size={18} weight="medium" {...props} color={props.disabled ? "grey" : props.color} />
    </TouchableOpacity>;
}