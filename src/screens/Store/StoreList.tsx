import { StoreStackParamList } from "@/navigations";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Linking, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { StoreFilter } from "@/components/store/StoreFilter";
import { ServiceType } from "@/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useStoreControllerGetStoreList } from "@/api/store/store";
import { GetStoreListResponse } from "@/api/models";
import { AddressSelectBottomSheet } from "@/components/bottom-sheet/AddressSelectBottomSheet";
import { StoreCard } from "@/components/ui/Card";

type StoreRouteProp = RouteProp<StoreStackParamList, "StoreList">;

export const StoreList = () => {
  const route = useRoute<StoreRouteProp>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [skip, setSkip] = useState<number>(0);
  const [serviceType, setServiceType] = useState<ServiceType>(
    route.params.serviceType
  );
  const [tags, setTags] = useState<string[]>([]);
  const [stores, setStores] = useState<GetStoreListResponse["data"]>([]);
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
  } = useStoreControllerGetStoreList(
    {
      take: 20,
      skip,
      serviceType,
      tags: tags.length > 0 ? tags.join(",") : undefined,
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

  const handleOpenAddressModal = () => {
    bottomSheetRef?.current?.present();
  };
  const handleCloseAddressModal = () => {
    bottomSheetRef?.current?.close();
  };

  // 필터 변경 시 데이터 리페칭
  useEffect(() => {
    setSkip(0);
    storesRefetch();
  }, [coordinate, tags]);

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

  // 현위치 가져오기
  useFocusEffect(
    useCallback(() => {
      let isFocused = true;

      const fetchLocation = async () => {
        let { status, canAskAgain } =
          await Location.requestForegroundPermissionsAsync();

        // 권한 설정 안되있을 경우
        if (status !== "granted") {
          if (canAskAgain) {
            const res = await Location.requestForegroundPermissionsAsync();

            status = res.status;
          }

          if (status !== "granted") {
            Alert.alert(
              "위치정보 접근 권한이 없습니다",
              "앱 설정에서 위치정보 접근 권한을 허용할 수 있습니다. 이동하시겠습니까?",
              [
                { text: "닫기", style: "cancel" },
                {
                  text: "설정",
                  onPress: () => Linking.openSettings(),
                },
              ]
            );
            return;
          }
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (isFocused) {
          setCoordinate({
            id: null,
            nickname: null,
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          });
        }
      };

      fetchLocation();

      return () => {
        isFocused = false;
      };
    }, [])
  );

  return (
    <CustomSafeAreaView backgroundColor={colors.bg} edges={["bottom"]}>
      <AddressSelectBottomSheet
        ref={bottomSheetRef}
        onClose={handleCloseAddressModal}
        coordinate={coordinate}
        setCoordinate={setCoordinate}
      />

      {/* 검색 필터 */}
      <StoreFilter
        serviceType={serviceType}
        setServiceType={setServiceType}
        tags={tags}
        setTags={setTags}
        coordinate={coordinate}
        handleOpenAddressModal={handleOpenAddressModal}
      />

      {stores.length ? (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          contentContainerStyle={styles.container}
          renderItem={({ item, index }) => (
            <StoreCard
              store={item}
              serviceType={serviceType}
              lat={coordinate.lat}
              lng={coordinate.lng}
            />
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
