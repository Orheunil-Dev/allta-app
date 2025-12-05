import {
  SuccessToast,
  ErrorToast,
  InfoToast,
  ToastProps,
  ToastConfigParams,
} from "react-native-toast-message";
import { StyleSheet, Text, View } from "react-native";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";

export const toastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <View style={styles.infoToast}>
      <CustomText
        textAlign="center"
        color={colors.white}
        fontSize={14}
        fontWeight={"500"}
      >
        {props.text1}
      </CustomText>
    </View>
  ),
  error: (props: ToastConfigParams<any>) => (
    <View style={styles.infoToast}>
      <CustomText
        textAlign="center"
        color={colors.white}
        fontSize={14}
        fontWeight={"500"}
      >
        {props.text1}
      </CustomText>
    </View>
  ),
  info: (props: ToastConfigParams<any>) => (
    <View style={styles.infoToast}>
      <CustomText
        textAlign="center"
        color={colors.white}
        fontSize={14}
        fontWeight={"500"}
      >
        {props.text1}
      </CustomText>
    </View>
  ),
};

const styles = StyleSheet.create({
  infoToast: {
    backgroundColor: "rgba(38, 38, 39, 0.8)",
    width: getResponsiveSize(235),
    paddingVertical: getResponsiveSize(8),
    borderRadius: 8,
  },
});
