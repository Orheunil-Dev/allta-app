import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import mmkvStorage from "@/libs/mmkv-storage";
import { useNotificationControllerUpdatePushToken } from "@/api/notification/notification";
import { ContainerStackParamList, LoginStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { IS_NOTIFICATION_GRANTED } from "@/constants";
import { signupCompleteImage } from "@/assets/images";
import { colors } from "@/styles";

type SignUpCompleteRouteProp = RouteProp<LoginStackParamList, "SignUpComplete">;

export const SignUpComplete = () => {
  const router = useRoute<SignUpCompleteRouteProp>();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  // 푸시토큰 업데이트 API
  const {
    mutate: updatePushToken,
    isPending: updatePushTokenLoading,
    isError: updatePushTokenError,
  } = useNotificationControllerUpdatePushToken();

  const handleGoHome = () => {
    containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "BottomTab",
            params: {
              screen: "Home",
              params: {
                isReceiveCoupon: router.params.isCouponReceived,
              },
            },
          },
        ],
      })
    );
  };

  const handleGoRegister = () => {
    loginStackNavigation.navigate("RegisterCar", {
      isCouponReceived: router.params.isCouponReceived,
    });
  };

  // 푸시토큰 업데이트
  useEffect(() => {
    const checkNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "granted") {
        mmkvStorage.setBoolean(IS_NOTIFICATION_GRANTED, true);

        const pushToken = await Notifications.getExpoPushTokenAsync({
          projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
        });

        updatePushToken({
          data: {
            pushToken: pushToken.data,
          },
        });
      } else {
        mmkvStorage.setBoolean(IS_NOTIFICATION_GRANTED, false);
      }
    };

    checkNotificationPermission();
  }, []);

  return (
    <CustomSafeAreaView edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Image source={signupCompleteImage} style={styles.image} />

        <CustomText fontSize={22} fontWeight={"600"} marginBottom={12}>
          회원가입이 완료되었어요!
        </CustomText>

        <CustomText textAlign="center" fontSize={16} color={colors.gray7}>
          올타 회원이 되신 것을 환영해요.
        </CustomText>
        <CustomText
          textAlign="center"
          fontSize={16}
          color={colors.gray7}
          marginBottom={40}
        >
          첫 세차를 위해 차량과 카드를 먼저 등록해보세요!
        </CustomText>

        <View style={styles.buttonBox}>
          <CustomButton
            onPress={handleGoHome}
            flex={1}
            height={getResponsiveSize(53)}
            backgroundColor={colors.white}
            borderWidth={1}
            borderColor={colors.gray2}
          >
            <CustomText color={colors.black} fontSize={16} fontWeight={"600"}>
              홈으로 가기
            </CustomText>
          </CustomButton>

          <CustomButton
            onPress={handleGoRegister}
            flex={1}
            height={getResponsiveSize(53)}
            backgroundColor={colors.main}
          >
            <CustomText color={colors.white} fontSize={16} fontWeight={"600"}>
              등록하기
            </CustomText>
          </CustomButton>
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: getResponsiveSize(20),
  },
  image: {
    width: getResponsiveSize(200),
    height: getResponsiveSize(200),
    marginBottom: getResponsiveSize(20),
  },
  buttonBox: {
    flexDirection: "row",
    gap: getResponsiveSize(16),
  },
});
