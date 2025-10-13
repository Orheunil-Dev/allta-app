import { GetNotificationsResponse } from "@/api/models";
import {
  useNotificationControllerGetNotifications,
  useNotificationControllerReadNotifications,
} from "@/api/notification/notification";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { formatNotificationTime, getResponsiveSize } from "@/utils";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export const Notification = () => {
  const [skip, setSkip] = useState<number>(0);
  const [notifications, setNotifications] = useState<
    GetNotificationsResponse["data"]
  >([]);

  // 알림 목록 조회
  const { data: notificationsData, refetch: notificationsRefetch } =
    useNotificationControllerGetNotifications(
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

  // 알림 읽음 처리
  const {
    mutate: readNotifications,
    isPending: readNotificationLoading,
    isError: readNotification,
  } = useNotificationControllerReadNotifications();

  // 페이지네이션
  const handleLoadMore = () => {
    if (notificationsData?.meta?.hasNextPage) {
      setSkip(skip + 20);
    }
  };

  // 무한 스크롤
  useEffect(() => {
    if (notificationsData?.data) {
      setNotifications((prev) => [...prev, ...notificationsData.data]);
    }
  }, [notificationsData]);

  // 화면을 벗어나기 전에 읽음 처리
  useFocusEffect(
    useCallback(() => {
      return () => {
        readNotifications();
      };
    }, [])
  );

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      {notifications.length ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          renderItem={({ item, index }) => (
            <View
              style={{
                padding: getResponsiveSize(20),
                backgroundColor: item.isRead ? "#FFFFFF" : "#F2F2FD",
              }}
            >
              <View style={styles.itemTop}>
                <CustomText color={colors.gray7} fontSize={13}>
                  {item.tag ?? ""}
                </CustomText>
                <CustomText color={colors.gray5} fontSize={13}>
                  {formatNotificationTime(item.createdAt)}
                </CustomText>
              </View>

              <CustomText fontSize={18} fontWeight={"600"}>
                {item.title}
              </CustomText>
              <CustomText marginTop={4} fontSize={16}>
                {item.content}
              </CustomText>
            </View>
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
            아직 새로운 알림이 없습니다.
          </CustomText>
          <CustomText marginBottom={40} color={colors.gray5} fontSize={16}>
            새로운 소식이 있으면 알려드릴게요!
          </CustomText>
        </View>
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemBox: {
    padding: getResponsiveSize(20),
  },
  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: getResponsiveSize(4),
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
