import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import { useNoticeControllerGetNoticeList } from "@/api/notice/notice";
import { GetNoticeListResponse } from "@/api/models";
import { NoticeStackParamList } from "@/navigations/NoticeStack";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";

export const NoticeList = () => {
  const { t } = useTranslation("mypage");

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
                {t("notice.itemTitle", { title: item.title })}
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
            {t("notice.empty")}
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
