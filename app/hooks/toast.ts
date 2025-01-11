import { ToastAndroid } from "react-native";

export const useNotifications = () => {
    const notify = (info: { message: string, type?: string; }) => {
        if (ToastAndroid)
            ToastAndroid.show(info.message, 2000);
        else {
            alert(info.message);
        }
        /*Notifier.showNotification({
            title: info.message,
        });*/
        /*showToastable({
            message: info.message,
            status: info.type,
        });*/
    };

    return {
        notify,
        showError: (message: string) => notify({ message, type: "danger" }),
    };
};