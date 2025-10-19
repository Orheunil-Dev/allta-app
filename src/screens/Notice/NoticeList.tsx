import { GetNoticeListResponse } from "@/api/models";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NoticeStackParamList } from "@/navigations/NoticeStack";
import { useNoticeControllerGetNoticeList } from "@/api/notice/notice";

export const NoticeList = () => {
  const noticeStack =
    useNavigation<NativeStackNavigationProp<NoticeStackParamList>>();

  const [skip, setSkip] = useState<number>(0);
  const [notices, setNotices] = useState<GetNoticeListResponse["data"]>([]);

  // 공지사항 목록 조회 API
  const { data: noticeData, refetch: noticeRefetch } =
    useNoticeControllerGetNoticeList(
      {
        take: 20,
        skip,
      },
      {
        query: {
          retry: false,
          gcTime: 0,
        },
      }
    );

  // 페이지네이션
  const handleLoadMore = () => {
    if (noticeData?.meta?.hasNextPage) {
      setSkip(skip + 20);
    }
  };

  // 무한 스크롤
  useEffect(() => {
    if (noticeData?.data) {
      setNotices((prev) => [...prev, ...noticeData.data]);
    }
  }, [noticeData]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      {notices.length ? (
        <FlatList
          data={notices}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() =>
                noticeStack.navigate("NoticeDetail", {
                  id: item.id,
                })
              }
              style={styles.card}
            >
              <CustomText fontSize={18} fontWeight={"600"}>
                [공지] {item.title}
              </CustomText>
              <CustomText marginTop={4} color={colors.gray5} fontSize={14}>
                {dayjs(item.createdAt).format("YYYY.MM.DD")}
              </CustomText>
            </Pressable>
          )}
        />
      ) : (
        <View style={styles.emptyBox}>
          <CustomText
            marginBottom={4}
            color={colors.gray5}
            fontSize={20}
            fontWeight={"600"}
          >
            등록된 공지사항이 없습니다
          </CustomText>
        </View>
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: getResponsiveSize(24),
    paddingHorizontal: getResponsiveSize(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: getResponsiveSize(40),
  },
});
