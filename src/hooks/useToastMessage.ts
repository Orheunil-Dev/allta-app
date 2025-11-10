import Toast from "react-native-toast-message";
import { getResponsiveSize } from "@/utils";

export const useToastMessage = () => {
  let toastTimeout: NodeJS.Timeout | null = null;

  const showToast = (type: "info" | "success" | "error", message: string) => {
    Toast.hide();

    if (toastTimeout) clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      Toast.show({
        type,
        text1: message,
        position: "bottom",
        bottomOffset: getResponsiveSize(60),
        visibilityTime: 1250,
        swipeable: true,
      });
    }, 200);
  };

  const InfoToast = (message: string) => showToast("info", message);
  const SuccessToast = (message: string) => showToast("success", message);
  const ErrorToast = (message: string) => showToast("error", message);

  return { InfoToast, SuccessToast, ErrorToast };
};
