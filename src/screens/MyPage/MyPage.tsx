import { useUserControllerGetUserProfile } from "@/api/user/user";
import { ContainerStackParamList } from "@/navigations";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const MyPage = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const { data, error } = useUserControllerGetUserProfile();

  return (
    <View style={styles.container}>
      <Text>내 정보</Text>

      <Pressable onPress={() => containerNavigation.navigate("LoginStack")}>
        <Text>로그인</Text>
      </Pressable>

      <Pressable onPress={() => containerNavigation.navigate("LoginStack")}>
        <Text>로그아웃</Text>
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
