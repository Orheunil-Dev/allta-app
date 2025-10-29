import { Dimensions, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RouteProp, useRoute } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";
import dayjs from "dayjs";
import { useNoticeControllerGetNoticeDetail } from "@/api/notice/notice";
import { NoticeStackParamList } from "@/navigations/NoticeStack";
import { getFontSize, getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";

const { width: screenWidth } = Dimensions.get("window");

type NoticeDetailRouteProp = RouteProp<NoticeStackParamList, "NoticeDetail">;

export const NoticeDetail = () => {
  const router = useRoute<NoticeDetailRouteProp>();

  // 공지사항 상세 조회 API
  const {
    data: noticeData,
    isLoading: noticeLoading,
    isError: noticeError,
  } = useNoticeControllerGetNoticeDetail(router.params.id, {
    query: { enabled: !!router.params.id },
  });

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      {noticeData && (
        <ScrollView style={styles.container}>
          <CustomText fontSize={22} fontWeight={"600"}>
            {noticeData.data.title}
          </CustomText>
          <CustomText color={colors.gray5} fontSize={16}>
            {dayjs(noticeData.data.createdAt).format("YYYY.MM.DD")}
          </CustomText>

          <View style={styles.html}>
            <RenderHTML
              contentWidth={screenWidth - getResponsiveSize(40)}
              source={{ html: noticeData.data.content }}
              tagsStyles={{
                h3: {
                  fontFamily: "Pretendard-SemiBold",
                  color: colors.black,
                  fontSize: getFontSize(18),
                  fontWeight: "600",
                  lineHeight: getFontSize(18) * 1.5,
                },
                p: {
                  fontFamily: "Pretendard-Regular",
                  color: colors.black,
                  fontSize: getFontSize(16),
                  lineHeight: getFontSize(16) * 1.5,
                  marginTop: 0,
                  marginBottom: 0,
                },
                li: {
                  fontFamily: "Pretendard-Regular",
                  color: colors.black,
                  fontSize: getFontSize(16),
                  lineHeight: getFontSize(16) * 1.5,
                },
              }}
            />
          </View>
        </ScrollView>
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveSize(20),
  },
  html: {
    marginTop: getResponsiveSize(20),
    paddingTop: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(40),
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
