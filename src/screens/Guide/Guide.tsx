import { Dimensions, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomImage } from "@/components/ui/CustomImage";
import { guideImage } from "@/assets/images";

const { width: screenWidth } = Dimensions.get("window");

export const Guide = () => {
  const navigation = useNavigation();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // 뒤로 갈 화면이 없으면 홈으로
      containerNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "BottomTab",
              params: { screen: "Home" },
            },
          ],
        }),
      );
    }
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <ScrollView>
        <CustomImage source={guideImage} width={screenWidth} />
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
});
