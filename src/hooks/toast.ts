import Toast from "react-native-toast-message";

export const useNotifications = () => {
    const notify = (info: { message: string, type?: 'success' | 'error'; }) => {
        /*if (ToastAndroid)
            ToastAndroid.show(info.message, 2000);
        else {
            alert(info.message);
        }*/
        Toast.show({
            type: info.type,
            text1: info.message,
        });
    };

    return {
        notify,
        showError: (message: string | Error) => {
            if (message instanceof Error) message = message.message;
            notify({ message, type: "error" });
        },
    };
};