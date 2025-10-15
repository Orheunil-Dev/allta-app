import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { GetSerivceHistoryListResponse } from "@/api/models";
import { getResponsiveSize } from "@/utils";
import { useServiceHistoryControllerGetServiceHistoryList } from "@/api/service-history/service-history";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";

export const ServiceHistory = () => {
  const [skip, setSkip] = useState<number>(0);
  const [serviceHsitories, setServiceHistories] = useState<
    GetSerivceHistoryListResponse["data"]
  >([]);

  // 이용 내역 목록 조회
  const { data: serviceHistoryData, refetch: serviceHistoryRefetch } =
    useServiceHistoryControllerGetServiceHistoryList(
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
    if (serviceHistoryData?.meta?.hasNextPage) {
      setSkip(skip + 20);
    }
  };

  // 무한 스크롤
  useEffect(() => {
    if (serviceHistoryData?.data) {
      setServiceHistories((prev) => [...prev, ...serviceHistoryData.data]);
    }
  }, [serviceHistoryData]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      {serviceHsitories.length ? (
        <FlatList
          data={serviceHsitories}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          renderItem={({ item, index }) => (
            <View>
              <CustomText fontSize={18} fontWeight={"600"}>
                {item.createdAt}
              </CustomText>
              <CustomText marginTop={4} fontSize={16}>
                {item.store.name}
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
            이용 내역이 없습니다.
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
    marginBottom: getResponsiveSize(20),
  },
});
