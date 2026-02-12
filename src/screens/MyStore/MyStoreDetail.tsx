import { useCallback, useState } from "react";
import {
  Image,
  ImageBackground,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Location from "expo-location";
import { useStoreControllerGetStoreDetail } from "@/api/store/store";
import { MyStoreStackParamList } from "@/navigations";
import { useDistanceCalculator } from "@/hooks";
import { getResponsiveSize, getStoreBusinessHours } from "@/utils";
import { DayKey } from "@/types";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { MyStoreInfo, MyStorePassInfo } from "@/components/store/Info";
import { dayLabel, dayOrder } from "@/constants";
import {
  clockIcon,
  defaultStoreImage,
  grayDownArrow,
  locationIcon,
  phoneIcon,
  storeNoticeIcon,
} from "@/assets/images";
import { colors } from "@/styles";

type StoreDetailRouteProp = RouteProp<MyStoreStackParamList, "MyStoreDetail">;

type BusinessHours = Partial<Record<DayKey, { open: string; close: string }>>;

const accordianHeight = getResponsiveSize(190);

export const MyStoreDetail = () => {
  const route = useRoute<StoreDetailRouteProp>();

  const [coordinate, setCoordinate] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 37.5759785,
    lng: 127.1935115,
  });
  const [showBusinessHours, setShowBusinessHours] = useState<boolean>(false);
  const [tab, setTab] = useState<"PASS" | "INFO">("INFO");

  // 매장 상세 조회 API
  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
  } = useStoreControllerGetStoreDetail(route.params.storeId, {
    query: { enabled: !!route.params.storeId },
  });

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

  // 전화번호 터치
  const handlePressPhoneNumber = () => {
    const phoneNumber = storeData?.store.phoneNumber;

    if (!phoneNumber) return;

    return Linking.openURL(`tel:${phoneNumber}`);
  };

  // 영업 시간 터치
  const handleToggleBusinessHours = () => {
    setShowBusinessHours(!showBusinessHours);
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

  // 현위치 가져오기
  useFocusEffect(
    useCallback(() => {
      let isFocused = true;

      const fetchLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
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
    }, []),
  );

  return (
    <CustomSafeAreaView edges={[]}>
      <ScrollView style={styles.container}>
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
                storeData?.store?.lng as number,
              )}
              km
            </CustomText>

            <View style={styles.divider} />

            <CustomText color={colors.gray7} fontSize={15} fontWeight={"500"}>
              {storeData?.store?.address}
            </CustomText>
          </View>

          {/* 전화번호 */}
          <Pressable onPress={handlePressPhoneNumber} style={styles.phone}>
            <Image
              source={phoneIcon}
              style={{
                width: getResponsiveSize(16),
                height: getResponsiveSize(16),
                marginRight: getResponsiveSize(4),
              }}
            />
            <CustomText color={colors.gray7} fontSize={15} fontWeight={"500"}>
              {storeData?.store.phoneNumber ?? ""}
            </CustomText>
          </Pressable>

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
                      storeData.store.holidays,
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
                          storeData.store.holidays,
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

        <View style={styles.tabArea}>
          <Pressable
            onPress={() => setTab("INFO")}
            style={[
              styles.tab,
              tab === "INFO"
                ? { borderBottomWidth: 2, borderBottomColor: colors.black }
                : { borderBottomWidth: 1, borderBottomColor: colors.line },
            ]}
          >
            <CustomText
              color={tab === "INFO" ? colors.black : colors.gray5}
              fontSize={16}
              fontWeight={tab === "INFO" ? "600" : "400"}
            >
              매장 정보
            </CustomText>
          </Pressable>

          <Pressable
            onPress={() => setTab("PASS")}
            style={[
              styles.tab,
              tab === "PASS"
                ? { borderBottomWidth: 2, borderBottomColor: colors.black }
                : { borderBottomWidth: 1, borderBottomColor: colors.line },
            ]}
          >
            <CustomText
              color={tab === "PASS" ? colors.black : colors.gray5}
              fontSize={16}
              fontWeight={tab === "PASS" ? "600" : "400"}
            >
              내 이용권
            </CustomText>
          </Pressable>
        </View>

        {tab === "INFO" && <MyStoreInfo storeData={storeData} />}
        {tab === "PASS" && <MyStorePassInfo storeId={route.params.storeId} />}
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getResponsiveSize(12),
  },
  top: {
    paddingHorizontal: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(20),
    borderBottomWidth: getResponsiveSize(6),
    borderBottomColor: colors.gray1,
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
  phone: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(4),
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
    width: getResponsiveSize(20),
    height: getResponsiveSize(20),
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
  tabArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: getResponsiveSize(52),
  },
});
