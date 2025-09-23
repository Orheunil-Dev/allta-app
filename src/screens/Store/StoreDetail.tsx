import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Location from "expo-location";
import { GetStoreGroupListResponse } from "@/api/models";
import {
  useStoreControllerGetStoreDetail,
  useStoreControllerGetStoreGroupList,
} from "@/api/store/store";
import { ContainerStackParamList, StoreStackParamList } from "@/navigations";
import { useDistanceCalculator } from "@/hooks";
import { getResponsiveSize, getStoreBusinessHours } from "@/utils";
import { CarType, DayKey, PassType, StoreDetailItemPassPrice } from "@/types";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { GroupInfo, PassInfo, StoreInfo } from "@/components/store/Info";
import { BottomButtonArea } from "@/components/layout/BottomButtonArea";
import { dayLabel, dayOrder } from "@/constants";
import {
  clockIcon,
  defaultStoreImage,
  grayDownArrow,
  locationIcon,
  storeNoticeIcon,
} from "@/assets/images";
import { colors } from "@/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type StoreDetailRouteProp = RouteProp<StoreStackParamList, "StoreDetail">;

type BusinessHours = Partial<Record<DayKey, { open: string; close: string }>>;

const accordianHeight = getResponsiveSize(190);

export const StoreDetail = () => {
  const router = useRoute<StoreDetailRouteProp>();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const [pass, setPass] = useState<PassType | undefined>(undefined);
  const [coordinate, setCoordinate] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 37.5759785,
    lng: 127.1935115,
  });
  const [showBusinessHours, setShowBusinessHours] = useState<boolean>(false);
  const [group, setGroup] = useState<GetStoreGroupListResponse["data"]>([]);
  const [tab, setTab] = useState<"PASS" | "STORE" | "INFO">("PASS");
  const [skip, setSkip] = useState(0);

  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
  } = useStoreControllerGetStoreDetail(router.params.storeId, {
    query: { enabled: !!router.params.storeId },
  });

  const {
    data: groupData,
    isLoading: groupLoading,
    isError: groupError,
  } = useStoreControllerGetStoreGroupList(
    {
      storeGroupId: router.params.storeGroupId!,
      skip,
      take: 20,
    },
    {
      query: {
        enabled: !!router.params.storeGroupId,
        gcTime: 0,
      },
    }
  );

  const { getDistance } = useDistanceCalculator();

  const rotateAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(showBusinessHours ? "180deg" : "0deg", {
            duration: 300,
          }),
        },
      ],
    };
  });

  const accordianAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(showBusinessHours ? accordianHeight : 0, {
        duration: 300,
      }),
    };
  });

  // 이용권 선택
  const handlePressPass = (passType: PassType) => () => {
    if (pass === passType) {
      return setPass(undefined);
    }

    return setPass(passType);
  };

  // 영업 시간 터치
  const handleToggleBusinessHours = () => {
    setShowBusinessHours(!showBusinessHours);
  };

  // 직영 매장 목록 무한스크롤
  const handleLoadMore = () => {
    if (groupData?.meta?.hasNextPage) {
      setSkip(skip + 20);
    }
  };

  // 스크롤 감지
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      handleLoadMore();
    }
  };

  // 결제 화면으로 이동
  const handleRoutePayment = () => {
    if (!storeData?.store || !storeData?.store?.passPrice || !pass) return;

    const price = (storeData?.store?.passPrice as any)[
      router.params.serviceType
    ][pass] as Record<CarType, number>;

    return containerNavigation.navigate("PaymentStack", {
      screen: "Payment",
      params: {
        storeId: router.params.storeId,
        storeName: storeData?.store?.name,
        serviceType: router.params.serviceType,
        passType: pass,
        price,
        ...(storeData?.store?.mainImage
          ? { storeImage: storeData.store.mainImage }
          : {}),
      },
    });
  };

  const renderInfo = () => {
    if (!storeData?.store) return null;

    switch (tab) {
      case "PASS":
        return (
          <PassInfo
            serviceType={router.params.serviceType}
            pass={pass}
            onPressPass={handlePressPass}
            standardMaxUsage={
              storeData.store.standardMaxUsage
                ? (storeData.store.standardMaxUsage as number)
                : undefined
            }
            passPrice={storeData.store.passPrice as StoreDetailItemPassPrice}
          />
        );

      case "STORE":
        return (
          <GroupInfo
            group={group}
            coordinate={coordinate}
            getDistance={getDistance}
          />
        );

      case "INFO":
        return (
          <StoreInfo
            storeName={storeData.store.name}
            lat={storeData.store.lat}
            lng={storeData.store.lng}
            description={storeData.store.descrption}
            policy={storeData.store.policy}
          />
        );

      default:
        return (
          <PassInfo
            serviceType={router.params.serviceType}
            pass={pass}
            onPressPass={handlePressPass}
            standardMaxUsage={
              storeData.store.standardMaxUsage
                ? (storeData.store.standardMaxUsage as number)
                : undefined
            }
            passPrice={storeData.store.passPrice as StoreDetailItemPassPrice}
          />
        );
    }
  };

  const renderBusinessHours = () => {
    return (
      <Animated.View style={[styles.schedules, accordianAnimatedStyle]}>
        {dayOrder.map((day) => {
          const businessHours = storeData?.store
            ?.businessHours as BusinessHours;

          if (!businessHours[day]) {
            return null;
          }

          const open = businessHours[day]?.open;
          const close = businessHours[day]?.close;

          if (!open || !close) return null;

          return (
            <CustomText
              key={day}
              color={colors.gray7}
              fontSize={15}
              fontWeight={"500"}
            >
              {dayLabel[day]} {open} ~ {close}
            </CustomText>
          );
        })}

        {storeData?.store?.breakTime && (
          <CustomText
            marginTop={6}
            color={colors.gray7}
            fontSize={15}
            fontWeight={"500"}
          >
            브레이크 타임 {storeData?.store?.breakTime}
          </CustomText>
        )}
      </Animated.View>
    );
  };

  // 무한 스크롤
  useEffect(() => {
    if (!groupData?.data) return;

    setGroup((prev) => {
      if (skip === 0) {
        return groupData.data;
      }

      return [...prev, ...groupData.data];
    });
  }, [groupData]);

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
    <CustomSafeAreaView edges={["bottom"]}>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={20}>
        <View style={styles.top}>
          <ImageBackground
            source={
              storeData?.store?.mainImage
                ? { uri: storeData?.store?.mainImage }
                : defaultStoreImage
            }
            style={styles.storeImage}
          ></ImageBackground>

          <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
            {storeData?.store?.name}
          </CustomText>

          <View style={styles.address}>
            <Image
              source={locationIcon}
              style={{
                width: getResponsiveSize(16),
                height: getResponsiveSize(16),
                marginRight: getResponsiveSize(4),
              }}
            />
            <CustomText color={colors.gray7} fontSize={15} fontWeight={"500"}>
              {getDistance(
                coordinate?.lat,
                coordinate?.lng,
                storeData?.store?.lat as number,
                storeData?.store?.lng as number
              )}
              km
            </CustomText>

            <View style={styles.divider} />

            <CustomText color={colors.gray7} fontSize={15} fontWeight={"500"}>
              {storeData?.store?.address}
            </CustomText>
          </View>

          {/* 영업 시간 */}
          {storeData?.store?.businessHours && (
            <View>
              <View style={styles.businessHours}>
                <Image
                  source={clockIcon}
                  style={{
                    width: getResponsiveSize(16),
                    height: getResponsiveSize(16),
                    marginRight: getResponsiveSize(4),
                  }}
                />

                <CustomText
                  color={colors.gray7}
                  fontSize={15}
                  fontWeight={"500"}
                >
                  {
                    getStoreBusinessHours(
                      storeData.store.businessHours as unknown as Record<
                        string,
                        { open: string; close: string }
                      >,
                      storeData.store.breakTime,
                      storeData.store.holidays
                    ).status
                  }
                </CustomText>

                <View style={styles.divider} />

                <View>
                  <Pressable
                    style={styles.businessHoursButton}
                    onPress={handleToggleBusinessHours}
                  >
                    <CustomText
                      marginRight={getResponsiveSize(6)}
                      color={colors.gray7}
                      fontSize={15}
                      fontWeight={"500"}
                    >
                      {
                        getStoreBusinessHours(
                          storeData.store.businessHours as unknown as Record<
                            string,
                            { open: string; close: string }
                          >,
                          storeData.store.breakTime,
                          storeData.store.holidays
                        ).hours
                      }
                    </CustomText>

                    <Animated.Image
                      source={grayDownArrow}
                      style={[styles.arrow, rotateAnimatedStyle]}
                    />
                  </Pressable>
                </View>
              </View>

              {renderBusinessHours()}
            </View>
          )}

          {/* 매장 공지 */}
          {storeData?.store?.notice && (
            <View style={styles.notice}>
              <Image source={storeNoticeIcon} style={styles.noticeIcon} />
              <View style={{ flex: 1 }}>
                <CustomText fontSize={14}>{storeData.store.notice}</CustomText>
              </View>
            </View>
          )}
        </View>

        <View style={styles.tabArae}>
          <Pressable
            onPress={() => setTab("PASS")}
            style={[
              styles.tabButton,
              tab === "PASS" && {
                borderBottomWidth: 2,
                borderBottomColor: colors.black,
              },
            ]}
          >
            <CustomText
              color={tab === "PASS" ? colors.black : colors.gray5}
              fontSize={16}
              fontWeight={tab === "PASS" ? "600" : "400"}
            >
              이용권
            </CustomText>
          </Pressable>

          {router.params.storeGroupId && (
            <Pressable
              onPress={() => setTab("STORE")}
              style={[
                styles.tabButton,
                tab === "STORE" && {
                  borderBottomWidth: 2,
                  borderBottomColor: colors.black,
                },
              ]}
            >
              <CustomText
                color={tab === "STORE" ? colors.black : colors.gray5}
                fontSize={16}
                fontWeight={tab === "STORE" ? "600" : "400"}
              >
                이용 가능 매장
              </CustomText>
            </Pressable>
          )}

          <Pressable
            onPress={() => setTab("INFO")}
            style={[
              styles.tabButton,
              tab === "INFO" && {
                borderBottomWidth: 2,
                borderBottomColor: colors.black,
              },
            ]}
          >
            <CustomText
              color={tab === "INFO" ? colors.black : colors.gray5}
              fontSize={16}
              fontWeight={tab === "INFO" ? "600" : "400"}
            >
              정보
            </CustomText>
          </Pressable>
        </View>

        {renderInfo()}
      </ScrollView>

      <BottomButtonArea>
        <CustomButton
          onPress={handleRoutePayment}
          isDisabled={!pass}
          width={"100%"}
          height={getResponsiveSize(53)}
          backgroundColor={pass ? colors.point2 : colors.gray2}
        >
          <CustomText
            color={pass ? colors.white : colors.gray5}
            fontSize={18}
            fontWeight={"600"}
          >
            이용권 구매하기
          </CustomText>
        </CustomButton>
      </BottomButtonArea>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  top: {
    paddingHorizontal: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(20),
  },
  storeImage: {
    width: "100%",
    height: getResponsiveSize(175),
    borderRadius: 12,
    overflow: "hidden",
  },
  address: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(8),
  },
  businessHours: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(4),
  },
  schedules: {
    marginLeft: getResponsiveSize(80),
    overflow: "hidden",
  },
  businessHoursButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: getResponsiveSize(12),
    marginHorizontal: getResponsiveSize(8),
    backgroundColor: colors.gray2,
  },
  arrow: {
    width: getResponsiveSize(8),
    height: getResponsiveSize(4),
  },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: getResponsiveSize(20),
    padding: getResponsiveSize(8),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
  },
  noticeIcon: {
    width: getResponsiveSize(16),
    height: getResponsiveSize(16),
    marginTop: getResponsiveSize(2),
    marginRight: getResponsiveSize(4),
    marginLeft: getResponsiveSize(2),
  },
  tabArae: {
    flexDirection: "row",
    borderTopWidth: getResponsiveSize(6),
    borderTopColor: colors.gray1,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: getResponsiveSize(14),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
});
