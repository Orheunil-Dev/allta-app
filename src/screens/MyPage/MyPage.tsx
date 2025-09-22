import { useAuthControllerLogout } from "@/api/auth/auth";
import { useUserControllerGetUserProfile } from "@/api/user/user";
import { ContainerStackParamList } from "@/navigations";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { CustomText } from "@/components/ui/CustomText";
import CookieManager from "@react-native-cookies/cookies";

export const MyPage = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const { data, error } = useUserControllerGetUserProfile({
    query: {
      retry: false,
      gcTime: 0,
    },
  });

  console.log(data);

  const { mutateAsync: logout, isPending: logoutLoading } =
    useAuthControllerLogout();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {}

    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    await CookieManager.clearByName(
      process.env.EXPO_PUBLIC_API_URL,
      "accessToken"
    );
    await CookieManager.clearByName(
      process.env.EXPO_PUBLIC_API_URL,
      "refreshToken"
    );

    return containerNavigation.navigate("LoginStack", { screen: "Login" });
  };

  return (
    <View style={styles.container}>
      <Text>내 정보</Text>

      <Pressable
        onPress={() =>
          containerNavigation.navigate("LoginStack", { screen: "Login" })
        }
      >
        <CustomText fontSize={20} marginBottom={20}>
          로그인
        </CustomText>
      </Pressable>

      <Pressable onPress={handleLogout}>
        <CustomText fontSize={20}>로그아웃</CustomText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
