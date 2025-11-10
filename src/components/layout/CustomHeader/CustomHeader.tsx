import { View, StyleSheet, Image, Pressable } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { closeIcon, headerBackArrow } from "@/assets/images";
import { colors } from "@/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";

interface CustomHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
}

export const CustomHeader = ({
  title,
  showBackButton,
  showCloseButton,
}: CustomHeaderProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
        })
      );
    }
  };

  const handleGoHome = () => {
    return containerNavigation.dispatch(
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
    <View
      style={[
        styles.header,
        { paddingTop: insets.top + getResponsiveSize(10) },
      ]}
    >
      {showBackButton ? (
        <Pressable onPress={handleGoBack}>
          <Image source={headerBackArrow} style={styles.backButton} />
        </Pressable>
      ) : (
        <View
          style={{
            width: showCloseButton ? getResponsiveSize(24) : 0,
            height: getResponsiveSize(24),
          }}
        />
      )}

      <CustomText fontSize={16} fontWeight={"600"} textAlign="center">
        {title}
      </CustomText>

      {showCloseButton ? (
        <Pressable onPress={handleGoHome}>
          <Image source={closeIcon} style={styles.backButton} />
        </Pressable>
      ) : (
        <View
          style={{
            width: showBackButton ? getResponsiveSize(24) : 0,
            height: getResponsiveSize(24),
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(12),
    backgroundColor: colors.white,
  },
  backButton: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
  side: { height: getResponsiveSize(24) },
});
