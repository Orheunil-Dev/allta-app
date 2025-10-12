import { useAuthControllerLogout } from "@/api/auth/auth";
import { CustomText } from "@/components/ui/CustomText";
import { ContainerStackParamList, SettingStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Platform, Pressable, StyleSheet, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import CookieManager from "@react-native-cookies/cookies";
import * as Linking from "expo-linking";
import { useState } from "react";
import { CustomModal } from "@/components/ui/CustomModal";
import { rigthArrowIcon } from "@/assets/images";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/recoil";

export const Setting = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const settingNavigation =
    useNavigation<NativeStackNavigationProp<SettingStackParamList>>();

  const setErrorModal = useSetAtom(errorModalAtom);

  const [showModal, setShowModal] = useState(false);

  // 로그아웃 API
  const { mutateAsync: logout, isPending: logoutLoading } =
    useAuthControllerLogout();

  // 앱 버전 업데이트
  const handleOpenStore = async () => {
    const storeUrl =
      Platform.OS === "ios"
        ? "https://apps.apple.com/app/id6467127880"
        : "https://play.google.com/store/apps/details?id=io.allta.user";

    try {
      await Linking.openURL(storeUrl);
    } catch (error) {
      setErrorModal({
        visible: true,
        message: "앱스토어 이동에 실패했습니다.",
      });
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {}

    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    await CookieManager.clearAll();

    return containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "LoginStack",
            state: {
              routes: [{ name: "Login" }],
            },
          },
        ],
      })
    );
  };

  return (
    <View style={styles.container}>
      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        closeButtonText="취소"
        onNext={handleLogout}
        nextButtonText="확인"
      >
        <CustomText fontSize={18} fontWeight={"600"}>
          로그아웃
        </CustomText>

        <CustomText marginTop={8} fontSize={16}>
          로그아웃 하시겠습니까?
        </CustomText>
      </CustomModal>

      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        closeButtonText="취소"
        onNext={handleLogout}
        nextButtonText="확인"
      >
        <CustomText fontSize={18} fontWeight={"600"}>
          로그아웃
        </CustomText>

        <CustomText marginTop={8} fontSize={16}>
          로그아웃 하시겠습니까?
        </CustomText>
      </CustomModal>

      <Pressable
        onPress={() => settingNavigation.navigate("NotificationSetting")}
        style={styles.button}
      >
        <CustomText fontSize={16}>알림 설정</CustomText>
        <Image source={rigthArrowIcon} style={styles.icon} />
      </Pressable>

      <Pressable
        onPress={() => settingNavigation.navigate("TermsList")}
        style={styles.button}
      >
        <CustomText fontSize={16}>약관 및 정책</CustomText>
        <Image source={rigthArrowIcon} style={styles.icon} />
      </Pressable>

      <View style={styles.button}>
        <CustomText fontSize={16}>버전 정보</CustomText>

        <Pressable onPress={handleOpenStore} style={styles.updateButton}>
          <CustomText color={colors.gray7} fontSize={12} fontWeight={"500"}>
            업데이트
          </CustomText>
        </Pressable>
      </View>

      <Pressable onPress={() => setShowModal(true)} style={styles.button}>
        <CustomText fontSize={16}>로그아웃</CustomText>
      </Pressable>

      <Pressable
        onPress={() => settingNavigation.navigate("Withdrawal")}
        style={[styles.button, { marginTop: getResponsiveSize(20) }]}
      >
        <CustomText
          color={colors.gray5}
          fontSize={15}
          textDecorationLine="underline"
        >
          탈퇴하기
        </CustomText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: getResponsiveSize(12),
  },
  icon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
  updateButton: {
    paddingVertical: getResponsiveSize(6),
    paddingHorizontal: getResponsiveSize(10),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
  },
});
