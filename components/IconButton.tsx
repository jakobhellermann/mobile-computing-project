import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export function IconButton({ onPress, ...props }: { onPress?: () => void; } & React.ComponentProps<typeof MaterialIcons>) {
    return <TouchableOpacity onPress={onPress}>
        <MaterialIcons size={18} weight="medium" {...props} />
    </TouchableOpacity>;
}