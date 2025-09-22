import { GetMyStoreListResponse } from "@/api/models";
import { useStoreControllerGetMyStoreList } from "@/api/store/store";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { PassType, ServiceType } from "@/types";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export const MyStore = () => {
  const [skip, setSkip] = useState<number>(0);
  const [serviceType, setServiceType] = useState<ServiceType>("AUTO");
  const [passType, setPassType] = useState<PassType>("STANDARD");
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

  console.log(stores.length);

  return (
    <View style={styles.container}>
      {stores.length ? (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          // onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          contentContainerStyle={styles.container}
          renderItem={({ item, index }) => (
            <View>
              <CustomText>{item.name}</CustomText>
              <CustomText>{item.passTypes}</CustomText>
            </View>
            // <StoreCard
            //   store={item}
            //   serviceType={serviceType}
            //   lat={coordinate.lat}
            //   lng={coordinate.lng}
            // />
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
            근처에 올타 제휴점이 없습니다.
          </CustomText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
