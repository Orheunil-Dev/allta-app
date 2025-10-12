import { useAuthControllerLogout } from "@/api/auth/auth";
import { CustomText } from "@/components/ui/CustomText";
import { ContainerStackParamList, SettingStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import CookieManager from "@react-native-cookies/cookies";
import { useState } from "react";
import { CustomModal } from "@/components/ui/CustomModal";

export const Setting = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const settingNavigation =
    useNavigation<NativeStackNavigationProp<SettingStackParamList>>();

  const [showModal, setShowModal] = useState(false);

  const { mutateAsync: logout, isPending: logoutLoading } =
    useAuthControllerLogout();

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

      <Pressable
        onPress={() => settingNavigation.navigate("NotificationSetting")}
        style={styles.button}
      >
        <CustomText fontSize={16}>알림 설정</CustomText>
      </Pressable>

      <Pressable style={styles.button}>
        <CustomText fontSize={16}>약관 및 정책</CustomText>
      </Pressable>

      <Pressable style={styles.button}>
        <CustomText fontSize={16}>버전 정보</CustomText>
      </Pressable>

      <Pressable onPress={() => setShowModal(true)} style={styles.button}>
        <CustomText fontSize={16}>로그아웃</CustomText>
      </Pressable>

      <Pressable style={[styles.button, { marginTop: getResponsiveSize(20) }]}>
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
    padding: getResponsiveSize(20),
    backgroundColor: colors.white,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: getResponsiveSize(12),
  },
});
