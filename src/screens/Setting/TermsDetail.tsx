import { Dimensions, StyleSheet, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SettingStackParamList } from "@/navigations";
import RenderHTML from "react-native-render-html";
import { getFontSize, getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { terms } from "@/constants";
import { colors } from "@/styles";
import { ScrollView } from "react-native-gesture-handler";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";

const { width: screenWidth } = Dimensions.get("window");

type TermsDetailRouteProp = RouteProp<SettingStackParamList, "TermsDetail">;

export const TermsDetail = () => {
  const route = useRoute<TermsDetailRouteProp>();

  const term = terms.find((term) => term.title === route.params.title);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <ScrollView style={styles.container}>
        <CustomText marginBottom={20} fontSize={22} fontWeight={"600"}>
          {route.params.title}
        </CustomText>

        <RenderHTML
          contentWidth={screenWidth - getResponsiveSize(40)}
          source={{ html: term?.content ?? "" }}
          tagsStyles={{
            h3: {
              fontFamily: "Pretendard-SemiBold",
              color: colors.black,
              fontSize: getFontSize(16),
              fontWeight: "600",
              lineHeight: getFontSize(14) * 1.5,
            },
            p: {
              fontFamily: "Pretendard-Regular",
              color: colors.black,
              fontSize: getFontSize(14),
              lineHeight: getFontSize(14) * 1.5,
            },
            li: {
              fontFamily: "Pretendard-Regular",
              color: colors.black,
              fontSize: getFontSize(14),
              lineHeight: getFontSize(14) * 1.5,
            },
          }}
        />
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
  },
});
