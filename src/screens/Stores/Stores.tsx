import { GetStoresResponse } from "@/api/models";
import { useStoreControllerGetStores } from "@/api/store/store";
import { StoreStackParamList } from "@/navigations";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import * as Location from "expo-location";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { formatEllipsis, formatPassType, getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { useDistanceCalculator } from "@/hooks";
import { defaultStoreImage, locationIcon } from "@/assets/images";
import { StoreFilter } from "@/components/store/StoreFilter";
import { PassType, ServiceType } from "@/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AddressSelectBottomSheet } from "@/components/store/AddressSelectBottomSheet";

type StoreRouteProp = RouteProp<StoreStackParamList, "Stores">;

type PassPrice = {
  TICKET?: Record<string, number>;
  STANDARD?: Record<string, number>;
  PREMIUM?: Record<string, number>;
};

type StoreServiceType = {
  AUTO?: PassPrice;
  HANDS?: PassPrice;
};

export const Stores = () => {
  const route = useRoute<StoreRouteProp>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [skip, setSkip] = useState<number>(0);
  const [serviceType, setServiceType] = useState<ServiceType>(
    route.params.serviceType
  );
  const [passType, setPassType] = useState<PassType | undefined>(undefined);
  const [stores, setStores] = useState<GetStoresResponse["data"]>([]);
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
  } = useStoreControllerGetStores(
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

  const { getDistance } = useDistanceCalculator();

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

  const getPassTypes = (priceObject: StoreServiceType): string[] => {
    const passSet = new Set<string>();

    Object.values(priceObject).forEach((passType) => {
      if ("TICKET" in passType) passSet.add("일회권");
      if ("STANDARD" in passType) passSet.add("스탠다드");
      if ("PREMIUM" in passType) passSet.add("프리미엄");
    });

    return Array.from(passSet);
  };

  const getLowestPrice = (priceObject: StoreServiceType): number | null => {
    const service = priceObject[serviceType];
    if (!service) return null;

    let minPrice: number | null = null;

    // passType이 있으면 해당 타입만, 없으면 모든 타입
    const passesToCheck = passType
      ? [service[passType]]
      : Object.values(service);

    passesToCheck.forEach((vehiclePrices) => {
      if (!vehiclePrices) return;

      Object.values(vehiclePrices).forEach((price) => {
        if (minPrice === null || price < minPrice) {
          minPrice = price;
        }
      });
    });

    return minPrice;
  };

  // 필터 변경 시 데이터 리페칭
  useEffect(() => {
    setSkip(0);
    storesRefetch();
  }, [coordinate, passType]);

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
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") return;

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
        passType={passType}
        setPassType={setPassType}
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
            <View style={styles.card}>
              <View style={styles.top}>
                <ImageBackground
                  source={
                    item?.mainImage
                      ? { uri: item.mainImage }
                      : defaultStoreImage
                  }
                  style={styles.storeImage}
                ></ImageBackground>

                <View>
                  <CustomText fontSize={18} fontWeight={"600"}>
                    {formatEllipsis(item.name, 14)}
                  </CustomText>

                  <View style={styles.address}>
                    <Image
                      source={locationIcon}
                      style={{
                        width: getResponsiveSize(16),
                        height: getResponsiveSize(16),
                        marginRight: getResponsiveSize(2),
                      }}
                    />

                    <CustomText color={colors.gray7} fontSize={14}>
                      {getDistance(
                        coordinate?.lat,
                        coordinate?.lng,
                        item.lat,
                        item.lng
                      )}
                      km
                    </CustomText>
                  </View>

                  <View style={styles.passArea}>
                    {item.passPrice &&
                      getPassTypes(item.passPrice as StoreServiceType).map(
                        (value, index) => (
                          <View style={styles.pass} key={index}>
                            <CustomText color={colors.back1} fontSize={12}>
                              {value}
                            </CustomText>
                          </View>
                        )
                      )}
                  </View>
                </View>
              </View>

              <View style={styles.bottom}>
                <View>
                  {(item.groupStoresCount ?? 0) > 1 && (
                    <View style={styles.groupCount}>
                      <CustomText
                        color={colors.gray7}
                        fontSize={12}
                        fontWeight={"500"}
                      >
                        매장 {item.groupStoresCount! - 1}곳 포함
                      </CustomText>
                    </View>
                  )}
                </View>

                {item.passPrice && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <CustomText color={colors.gray7} fontSize={14}>
                      {passType ? formatPassType(passType) : "이용권 최저가"}
                    </CustomText>

                    <CustomText marginLeft={8} fontSize={18} fontWeight={"600"}>
                      {getLowestPrice(item.passPrice)?.toLocaleString()}원{" "}
                      {!!passType && "~"}
                    </CustomText>
                  </View>
                )}
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
  card: {
    padding: getResponsiveSize(16),
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: getResponsiveSize(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  storeImage: {
    width: getResponsiveSize(96),
    height: getResponsiveSize(96),
    marginRight: getResponsiveSize(12),
    borderRadius: 12,
    overflow: "hidden",
  },
  address: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(8),
  },
  passArea: {
    flexDirection: "row",
    marginTop: getResponsiveSize(12),
    gap: getResponsiveSize(6),
  },
  pass: {
    paddingVertical: getResponsiveSize(3),
    paddingHorizontal: getResponsiveSize(6),
    backgroundColor: colors.back4,
    borderRadius: 20,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: getResponsiveSize(12),
  },
  groupCount: {
    justifyContent: "center",
    paddingVertical: getResponsiveSize(6),
    paddingHorizontal: getResponsiveSize(10),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
