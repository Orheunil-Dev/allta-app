import { Image, StyleSheet, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as TrackingTransparency from "expo-tracking-transparency";
import mmkvStorage from "@/libs/mmkv-storage";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { IS_NOTIFICATION_GRANTED, IS_GET_PERMISSION } from "@/constants";
import {
  PermissionAlarmIcon,
  PermissionCameraIcon,
  PermissionLocationIcon,
  PermissionPhotoIcon,
} from "@/assets/images";
import { colors } from "@/styles";

export const Permission = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const handleGoHome = async () => {
    // 알림 권한 요청
    await Notifications.requestPermissionsAsync();

    const { status } = await Notifications.requestPermissionsAsync();

    if (status === "granted") {
      mmkvStorage.setBoolean(IS_NOTIFICATION_GRANTED, true);
    } else {
      mmkvStorage.setBoolean(IS_NOTIFICATION_GRANTED, false);
    }

    // 위치 권한 요청
    await Location.requestForegroundPermissionsAsync();
    // 카메라 권한 요청
    await ImagePicker.requestCameraPermissionsAsync();
    // 앨범 권한 요청
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    // ATT 권한 요청
    await TrackingTransparency.requestTrackingPermissionsAsync();

    mmkvStorage.setBoolean(IS_GET_PERMISSION, true);

    containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "BottomTab",
            params: { screen: "Home" },
          },
        ],
      })
    );
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <View style={styles.container}>
        <View>
          <CustomText fontSize={22} fontWeight={"600"}>
            앱 사용을 위해
          </CustomText>
          <CustomText
            marginTop={4}
            marginBottom={30}
            fontSize={22}
            fontWeight={"600"}
          >
            접근 권한을 허용해주세요.
          </CustomText>

          <View style={styles.box}>
            <View style={styles.icon}>
              <Image
                source={PermissionAlarmIcon}
                style={{
                  width: getResponsiveSize(28),
                  height: getResponsiveSize(28),
                }}
              />
            </View>
            <View>
              <CustomText fontSize={16} fontWeight={"600"}>
                알림
              </CustomText>
              <CustomText marginTop={4} fontSize={14}>
                이벤트, 혜택, 공지사항 등 알림 제공
              </CustomText>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.icon}>
              <Image
                source={PermissionCameraIcon}
                style={{
                  width: getResponsiveSize(28),
                  height: getResponsiveSize(28),
                }}
              />
            </View>
            <View>
              <CustomText fontSize={16} fontWeight={"600"}>
                카메라
              </CustomText>
              <CustomText marginTop={4} fontSize={14}>
                매장 QR코드 스캔 및 주유 영수증 촬명
              </CustomText>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.icon}>
              <Image
                source={PermissionPhotoIcon}
                style={{
                  width: getResponsiveSize(28),
                  height: getResponsiveSize(28),
                }}
              />
            </View>
            <View>
              <CustomText fontSize={16} fontWeight={"600"}>
                사진
              </CustomText>
              <CustomText marginTop={4} fontSize={14}>
                주유 영수증 업로드
              </CustomText>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.icon}>
              <Image
                source={PermissionLocationIcon}
                style={{
                  width: getResponsiveSize(28),
                  height: getResponsiveSize(28),
                }}
              />
            </View>
            <View>
              <CustomText fontSize={16} fontWeight={"600"}>
                위치
              </CustomText>
              <CustomText marginTop={4} fontSize={14}>
                현 위치 기준 가까운 매장 안내
              </CustomText>
            </View>
          </View>
        </View>

        <CustomButton
          onPress={handleGoHome}
          height={getResponsiveSize(53)}
          backgroundColor={colors.main}
        >
          <CustomText color={colors.white} fontSize={16} fontWeight={"600"}>
            확인
          </CustomText>
        </CustomButton>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
    paddingHorizontal: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(20),
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: getResponsiveSize(16),
  },
  icon: {
    width: "auto",
    height: "auto",
    marginRight: getResponsiveSize(16),
    padding: getResponsiveSize(10),
    backgroundColor: colors.gray1,
    borderRadius: "100%",
  },
});
