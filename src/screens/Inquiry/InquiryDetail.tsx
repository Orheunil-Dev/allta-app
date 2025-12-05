import { StyleSheet, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import dayjs from "dayjs";
import { useInquiryControllerGetInquiryDetail } from "@/api/inquiry/inquiry";
import { InquiryStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";

type InquiryDetailRouteProp = RouteProp<InquiryStackParamList, "InquiryDetail">;

export const InquiryDetail = () => {
  const router = useRoute<InquiryDetailRouteProp>();

  // 문의 상세 조회 API
  const { data: inquiryData } = useInquiryControllerGetInquiryDetail(
    router.params.id,
    {
      query: {
        enabled: !!router.params.id,
      },
    }
  );

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      {inquiryData ? (
        <ScrollView style={styles.container}>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.mark}>
                <CustomText
                  fontSize={15}
                  color={colors.white}
                  fontWeight={"500"}
                >
                  Q
                </CustomText>
              </View>

              <CustomText
                fontSize={15}
                color={
                  inquiryData.data.isAnswered ? colors.point2 : colors.gray5
                }
                fontWeight={"500"}
              >
                {inquiryData.data.isAnswered ? "답변 완료" : "답변 대기"}
              </CustomText>
            </View>

            <CustomText marginTop={12} fontSize={14}>
              {inquiryData.data.content}
            </CustomText>

            <CustomText
              marginTop={4}
              fontSize={13}
              color={colors.gray5}
              fontWeight={"500"}
            >
              {dayjs(inquiryData.data.createdAt).format("YYYY.MM.DD")}
            </CustomText>
          </View>

          {inquiryData.data.answer && (
            <View style={styles.answer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.mark}>
                  <CustomText
                    fontSize={15}
                    color={colors.white}
                    fontWeight={"500"}
                  >
                    A
                  </CustomText>
                </View>

                <CustomText
                  fontSize={15}
                  color={colors.point2}
                  fontWeight={"500"}
                >
                  답변 완료
                </CustomText>
              </View>

              <CustomText marginTop={12} fontSize={14}>
                {inquiryData.data.answer}
              </CustomText>

              <CustomText
                marginTop={4}
                fontSize={13}
                color={colors.gray5}
                fontWeight={"500"}
              >
                {dayjs(inquiryData.data.answeredAt).format("YYYY.MM.DD")}
              </CustomText>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyBox}>
          <CustomText color={colors.gray5} fontSize={20} fontWeight={"600"}>
            문의 내역이 없습니다.
          </CustomText>
        </View>
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveSize(20),
  },
  answer: {
    marginTop: getResponsiveSize(16),
    paddingVertical: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(16),
    backgroundColor: colors.bg,
    borderRadius: 8,
  },
  mark: {
    justifyContent: "center",
    alignItems: "center",
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    marginRight: getResponsiveSize(8),
    backgroundColor: colors.point1,
    borderRadius: 40,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
