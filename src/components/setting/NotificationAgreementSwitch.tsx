import { Alert, Linking, StyleSheet, Switch, View } from "react-native";
import * as Notifications from "expo-notifications";
import {
  useNotificationControllerCheckPushTokenStored,
  useNotificationControllerDeletePushToken,
  useNotificationControllerUpdatePushToken,
} from "@/api/notification/notification";
import mmkvStorage from "@/libs/mmkv-storage";
import { useToastMessage } from "@/hooks";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "../ui/CustomText";
import { IS_NOTIFICATION_GRANTED } from "@/constants";
import { colors } from "@/styles";

export const NotificationAgreementSwitch = () => {
  const { SuccessToast, ErrorToast } = useToastMessage();

  const isNotificationGranted = mmkvStorage.getBoolean(IS_NOTIFICATION_GRANTED);

  // 푸시토큰 저장 여부 조회 API
  const { data, isLoading, isError, refetch } =
    useNotificationControllerCheckPushTokenStored();

  // 푸시토큰 업데이트 API
  const {
    mutate: updatePushToken,
    isPending: updatePushTokenLoading,
    isError: updatePushTokenError,
  } = useNotificationControllerUpdatePushToken();

  // 푸시토큰 삭제 API
  const {
    mutate: deletePushToken,
    isPending: deletePushTokenLoading,
    isError: deletePushTokenError,
  } = useNotificationControllerDeletePushToken();

  // 알림 설정 허용
  const handleGrantNotificationAgreement = async () => {
    if (!data || (data.isPushTokenStored && isNotificationGranted)) return;

    let { status, canAskAgain } = await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      if (canAskAgain) {
        const res = await Notifications.requestPermissionsAsync();

        status = res.status;
      }

      if (status !== "granted") {
        Alert.alert(
          "알림 권한이 없습니다",
          "앱 설정에서 알림 권한을 허용할 수 있습니다. 이동하시겠습니까?",
          [
            { text: "닫기", style: "cancel" },
            {
              text: "설정",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }
    }

    mmkvStorage.setBoolean(IS_NOTIFICATION_GRANTED, true);

    const pushToken = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    });

    updatePushToken(
      {
        data: {
          pushToken: pushToken.data,
        },
      },
      {
        onSuccess: () => {
          SuccessToast("알림 수신 동의");
          refetch();
        },
        onError: () => {
          ErrorToast("요청 중 오류가 발생했습니다.");
        },
      }
    );
  };

  // 알림 설정 해제
  const handleDenyNotificationAgreement = async () => {
    if (!data || !data.isPushTokenStored || !isNotificationGranted) return;

    mmkvStorage.setBoolean(IS_NOTIFICATION_GRANTED, false);

    deletePushToken(undefined, {
      onSuccess: () => {
        SuccessToast("알림 수신 해제");
        refetch();
      },
      onError: () => {
        ErrorToast("요청 중 오류가 발생했습니다.");
      },
    });
  };

  return (
    <View style={styles.container}>
      <CustomText fontSize={16}>이벤트 • 혜택 및 정보 알림</CustomText>

      <Switch
        value={data?.isPushTokenStored && isNotificationGranted ? true : false}
        onValueChange={() => {
          if (data?.isPushTokenStored && isNotificationGranted) {
            handleDenyNotificationAgreement();
          } else {
            handleGrantNotificationAgreement();
          }
        }}
        trackColor={{ true: colors.point2 }}
        thumbColor={colors.white}
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: getResponsiveSize(12),
  },
  switch: {
    width: getResponsiveSize(41),
    height: getResponsiveSize(25),
  },
});
