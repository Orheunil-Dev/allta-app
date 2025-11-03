import { useCallback, useState } from "react";
import {
  Dimensions,
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
import RenderHTML from "react-native-render-html";
import * as Location from "expo-location";
import { GetStoreGroupListResponse } from "@/api/models";
import { useStoreControllerGetStoreDetail } from "@/api/store/store";
import { MyStoreStackParamList } from "@/navigations";
import { useDistanceCalculator, useToastMessage } from "@/hooks";
import { getFontSize, getResponsiveSize, getStoreBusinessHours } from "@/utils";
import { DayKey, PassType } from "@/types";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { KakaoMap } from "@/components/store/KakaoMap";
import { dayLabel, dayOrder } from "@/constants";
import {
  clockIcon,
  defaultStoreImage,
  grayDownArrow,
  locationIcon,
  naviIcon,
  phoneIcon,
  storeNoticeIcon,
} from "@/assets/images";
import { colors } from "@/styles";

type StoreDetailRouteProp = RouteProp<MyStoreStackParamList, "MyStoreDetail">;

type BusinessHours = Partial<Record<DayKey, { open: string; close: string }>>;

const { width: screenWidth } = Dimensions.get("window");

const accordianHeight = getResponsiveSize(190);

export const MyStoreDetail = () => {
  const router = useRoute<StoreDetailRouteProp>();

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

  const { ErrorToast } = useToastMessage();
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

  // 영업 시간 터치
  const handleToggleBusinessHours = () => {
    setShowBusinessHours(!showBusinessHours);
  };

  // TMAP 네비게이션 열기
  const handleOpenNavigation = async () => {
    const destination = encodeURIComponent(storeData?.store.name ?? "");
    const tmapScheme = `tmap://?rGoName=${destination}&rGoX=${storeData?.store.lng}&rGoY=${storeData?.store.lat}`;

    const isCanOpen = await Linking.canOpenURL(tmapScheme);

    if (!isCanOpen) {
      return ErrorToast("티맵이 설치되어 있지 않습니다.");
    }

    return Linking.openURL(tmapScheme);
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
    }, [])
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
                storeData?.store?.lng as number
              )}
              km
            </CustomText>

            <View style={styles.divider} />

            <CustomText color={colors.gray7} fontSize={15} fontWeight={"500"}>
              {storeData?.store?.address}
            </CustomText>
          </View>

          {/* 전화번호 */}
          <View style={styles.phone}>
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

        <View style={styles.infoArea}>
          <CustomText fontSize={18} fontWeight={"600"}>
            위치
          </CustomText>

          <View style={styles.map}>
            <KakaoMap
              lat={storeData?.store.lat}
              lng={storeData?.store.lng}
              height={getResponsiveSize(168)}
            />
          </View>

          <CustomButton
            onPress={handleOpenNavigation}
            height={getResponsiveSize(34)}
            marginTop={8}
            borderWidth={1}
            borderColor={colors.gray2}
          >
            <Image source={naviIcon} style={styles.naviIcon} />
            <CustomText fontSize={13} fontWeight={"500"}>
              길찾기
            </CustomText>
          </CustomButton>

          {storeData?.store.description?.trim() && (
            <View>
              <CustomText
                marginTop={40}
                marginBottom={12}
                fontSize={18}
                fontWeight={"600"}
              >
                매장 소개
              </CustomText>

              <RenderHTML
                source={{ html: storeData?.store.description }}
                contentWidth={screenWidth - getResponsiveSize(40)}
                tagsStyles={{
                  p: {
                    fontFamily: "Pretendard-Regular",
                    color: colors.black,
                    fontSize: getFontSize(16),
                    lineHeight: getFontSize(16) * 1.5,
                  },
                }}
              />
            </View>
          )}

          {storeData?.store.policy?.trim() && (
            <View>
              <CustomText
                marginTop={40}
                marginBottom={12}
                fontSize={18}
                fontWeight={"600"}
              >
                매장 유의사항
              </CustomText>

              <RenderHTML
                source={{ html: storeData.store.policy }}
                contentWidth={screenWidth - getResponsiveSize(40)}
                tagsStyles={{
                  p: {
                    fontFamily: "Pretendard-Regular",
                    color: colors.black,
                    fontSize: getFontSize(16),
                    lineHeight: getFontSize(16) * 1.5,
                  },
                }}
              />
            </View>
          )}
        </View>
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
  infoArea: {
    paddingVertical: getResponsiveSize(24),
    paddingHorizontal: getResponsiveSize(20),
    borderTopWidth: getResponsiveSize(6),
    borderTopColor: colors.gray1,
  },
  map: {
    marginTop: getResponsiveSize(12),
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
    overflow: "hidden",
  },
  naviIcon: {
    width: getResponsiveSize(16),
    height: getResponsiveSize(16),
    marginRight: getResponsiveSize(4),
  },
});
