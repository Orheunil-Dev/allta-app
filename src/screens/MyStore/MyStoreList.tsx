import { GetMyStoreListResponse } from "@/api/models";
import { useStoreControllerGetMyStoreList } from "@/api/store/store";
import { MyStoreFilter } from "@/components/store/StoreFilter";
import { MyStoreCard } from "@/components/ui/Card";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { PassType, ServiceType } from "@/types";
import { getResponsiveSize } from "@/utils";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export const MyStoreList = () => {
  const [skip, setSkip] = useState<number>(0);
  const [serviceType, setServiceType] = useState<ServiceType>("AUTO");
  const [passType, setPassType] = useState<PassType | null>(null);
  const [stores, setStores] = useState<GetMyStoreListResponse["data"]>([]);
  const [coordinate, setCoordinate] = useState<{
    id: string | null;
    nickname: string | null;
    lat: number;
    lng: number;
  }>({
    id: null,
    nickname: null,
    lat: 37.5759785,
    lng: 127.1935115,
  });

  const {
    data: storesData,
    isLoading: storesLoading,
    isError: storesError,
    refetch: storesRefetch,
  } = useStoreControllerGetMyStoreList(
    {
      take: 20,
      skip,
      serviceType,
      passType,
      ...(coordinate ? { lat: coordinate.lat, lng: coordinate.lng } : {}),
    },
    {
      query: {
        retry: false,
        gcTime: 0,
      },
    }
  );

  const handleLoadMore = () => {
    if (storesData?.meta?.hasNextPage) {
      setSkip(skip + 20);
    }
  };

  // 필터 변경 시 데이터 리페칭
  useEffect(() => {
    setSkip(0);
    storesRefetch();
  }, [passType]);

  // 무한 스크롤
  useEffect(() => {
    if (!storesData?.data) return;

    setStores((prev) => {
      if (skip === 0) {
        return storesData.data;
      }

      return [...prev, ...storesData.data];
    });
  }, [storesData]);

  return (
    <CustomSafeAreaView backgroundColor={colors.bg} edges={[]}>
      <MyStoreFilter
        serviceType={serviceType}
        setServiceType={setServiceType}
        passType={passType}
        setPassType={setPassType}
        coordinate={coordinate}
      />

      {stores.length ? (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          contentContainerStyle={styles.container}
          renderItem={({ item, index }) => (
            <MyStoreCard
              store={item}
              storeName={item.name}
              lat={coordinate.lat}
              lng={coordinate.lng}
            />
          )}
        />
      ) : (
        <View style={styles.emptyBox}>
          <CustomText color={colors.gray5} fontSize={20} fontWeight={"600"}>
            보유한 이용권이 없습니다.
          </CustomText>
        </View>
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(16),
    gap: getResponsiveSize(16),
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
