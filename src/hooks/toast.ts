import Toast from "react-native-toast-message";

export const useNotifications = () => {
    const notify = (info: { message: string, subtext?: string, type?: 'success' | 'error'; }) => {
        Toast.show({
            type: info.type,
            text1: info.message,
            text2: info.subtext,
        });
    };

    return {
        notify,
        showError: (message: string | Error) => {
            console.error(message);
            if (message instanceof Error) {
                console.log(message.message);
                if (message.message.includes('NetworkError')|| message.message.includes('Network request failed')) {
                    notify({ message: "No network connectivity!", subtext: "Please make sure you have service and try again.", type: "error" });
                } else if (message.message.includes('Invalid or expired token')) {
                    notify({ message: "Login expired", subtext: "Please login to make sure you're up to date", type: "error" });
                } else {
                    notify({ message: "Unexpected error occured!", subtext: "Please try again.", type: "error" });
                }
                return;
            }
            notify({ message, type: "error" });
        },
    };
};