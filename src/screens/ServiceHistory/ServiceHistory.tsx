import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import { useServiceHistoryControllerGetServiceHistoryList } from "@/api/service-history/service-history";
import { GetSerivceHistoryListResponse } from "@/api/models";
import { ContainerStackParamList } from "@/navigations";
import { formatPassType, formatServiceType, getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { defaultStoreImage } from "@/assets/images";
import { colors } from "@/styles";

export const ServiceHistory = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

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
      },
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
      <View style={styles.container}>
        {serviceHsitories.length ? (
          <FlatList
            data={serviceHsitories}
            keyExtractor={(item) => item.id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.7}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <View style={{ flexDirection: "row" }}>
                  <CustomText
                    color={colors.gray7}
                    fontSize={13}
                    fontWeight={"500"}
                  >
                    {dayjs(item.createdAt).format("YYYY.MM.DD HH:mm")}
                  </CustomText>
                  <CustomText
                    marginLeft={6}
                    color={colors.gray7}
                    fontSize={13}
                    fontWeight={"500"}
                  >
                    {formatServiceType(item.serviceType)}
                  </CustomText>
                </View>

                <View style={styles.serviceHistory}>
                  <ImageBackground
                    source={
                      item.store.mainImage
                        ? { uri: item.store.mainImage }
                        : defaultStoreImage
                    }
                    style={styles.storeImage}
                  ></ImageBackground>

                  <View style={{ flex: 1 }}>
                    <CustomText fontSize={18} fontWeight={"600"}>
                      {item.store.name}
                    </CustomText>

                    <CustomText
                      marginTop={4}
                      color={colors.gray5}
                      fontSize={14}
                    >
                      {formatPassType(item.passType)} • {item.carNumber}
                    </CustomText>
                  </View>
                </View>
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
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: getResponsiveSize(20),
    gap: getResponsiveSize(16),
  },
  card: {
    padding: getResponsiveSize(16),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  serviceHistory: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(12),
  },
  storeImage: {
    width: getResponsiveSize(65),
    height: getResponsiveSize(65),
    marginRight: getResponsiveSize(12),
    borderRadius: 12,
    overflow: "hidden",
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: getResponsiveSize(20),
  },
});
