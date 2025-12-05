import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useInquiryControllerGetInquiryList } from "@/api/inquiry/inquiry";
import { GetInquiryListResponse } from "@/api/models";
import { InquiryStackParamList } from "@/navigations";
import { useToastMessage } from "@/hooks";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { BottomButtonArea } from "@/components/layout/BottomButtonArea";
import { CustomButton } from "@/components/ui/CustomButton";
import { colors } from "@/styles";

export const InquiryList = () => {
  const inquiryStackNavigation =
    useNavigation<NativeStackNavigationProp<InquiryStackParamList>>();

  const { ErrorToast } = useToastMessage();

  const [skip, setSkip] = useState<number>(0);
  const [inquiries, setInquiries] = useState<GetInquiryListResponse["data"]>(
    []
  );

  // 문의내역 목록 조회 API
  const { data: inquiryData, refetch: inquiryRefetch } =
    useInquiryControllerGetInquiryList(
      {
        take: 20,
        skip,
      },
      {
        query: {
          queryKey: ["inquiries"],
          retry: false,
          gcTime: 0,
        },
      }
    );

  // 페이지네이션
  const handleLoadMore = () => {
    if (inquiryData?.meta?.hasNextPage) {
      setSkip(skip + 20);
    }
  };

  // 문의등록 화면으로 이동
  const handleRouteRegister = () => {
    const unansweredCount =
      inquiryData?.data?.filter((item) => !item.isAnswered).length || 0;

    if (unansweredCount >= 3) {
      return ErrorToast("문의는 최대 3개까지 등록 가능합니다.");
    }

    return inquiryStackNavigation.push("InquiryRegister");
  };

  useEffect(() => {
    if (inquiryData?.data) {
      setInquiries((prev) => {
        if (skip === 0) {
          return inquiryData.data;
        }

        const newItems = inquiryData.data.filter(
          (item) => !prev.some((p) => p.id === item.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [inquiryData]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      {inquiries.length ? (
        <FlatList
          data={inquiries}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() =>
                inquiryStackNavigation.navigate("InquiryDetail", {
                  id: item.id,
                })
              }
              style={styles.card}
            >
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
                  fontSize={16}
                  color={item.isAnswered ? colors.point2 : colors.gray5}
                  fontWeight={"500"}
                >
                  {item.isAnswered ? "답변 완료" : "답변 대기"}
                </CustomText>
              </View>

              <CustomText marginTop={12} fontSize={16} numberOfLines={1}>
                {item.content}
              </CustomText>

              <CustomText
                marginTop={4}
                fontSize={13}
                color={colors.gray5}
                fontWeight={"500"}
              >
                {dayjs(item.createdAt).format("YYYY.MM.DD")}
              </CustomText>
            </Pressable>
          )}
        />
      ) : (
        <View style={styles.emptyBox}>
          <CustomText color={colors.gray5} fontSize={20} fontWeight={"600"}>
            문의 내역이 없습니다.
          </CustomText>
        </View>
      )}

      <BottomButtonArea>
        <CustomButton
          onPress={handleRouteRegister}
          width={"100%"}
          height={getResponsiveSize(53)}
          backgroundColor={colors.point2}
        >
          <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
            문의하기
          </CustomText>
        </CustomButton>
      </BottomButtonArea>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: getResponsiveSize(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
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
