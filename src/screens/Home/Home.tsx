import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as TrackingTransparency from "expo-tracking-transparency";
import * as Notifications from "expo-notifications";
import { Airbridge, AirbridgeCategory } from "airbridge-react-native-sdk";
import {
  useNotificationControllerGetUnreadNotificationsCount,
  useNotificationControllerUpdatePushToken,
} from "@/api/notification/notification";
import { useBannerControllerGetBannerList } from "@/api/banner/banner";
import { BottomTabParamList, ContainerStackParamList } from "@/navigations";
import mmkvStorage from "@/libs/mmkv-storage";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { Popup } from "@/components/home/Popup";
import { MainBanner, SubBanner } from "@/components/home/Banner";
import { HomeHeader } from "@/components/home/HomeHeader";
import { StoreRecommend } from "@/components/home/StoreRecommend";
import { CustomModal } from "@/components/ui/CustomModal";
import { WeatherCast } from "@/components/home/WeatherCast";
import { IS_COUPON_RECEIVED, IS_NOTIFICATION_GRANTED } from "@/constants";
import {
  autoWashIcon,
  handsWashIcon,
  homeFooterArrow,
  qrIcon,
  receiptIcon,
  welcomeCoupon,
} from "@/assets/images";
import { colors } from "@/styles";

interface Props {
  showSplash?: boolean;
  showUpdate?: boolean;
}

export const Home = ({ showSplash, showUpdate }: Props) => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const bottomTabNavigation =
    useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  const scrollRef = useRef<ScrollView>(null);

  const [showCouponModal, setShowCouponModal] = useState<boolean>(false);
  const [footerOpen, setFooterOpen] = useState<boolean>(false);

  // 배너 목록 조회 API
  const {
    data: bannerData,
    isPending: bannerLoading,
    isError: bannerError,
  } = useBannerControllerGetBannerList();

  // 푸시토큰 업데이트 API
  const {
    mutate: updatePushToken,
    isPending: updatePushTokenLoading,
    isError: updatePushTokenError,
  } = useNotificationControllerUpdatePushToken();

  // 미확인 알림 조회 API
  const { data: unreadNotificationData, refetch: unreadNotificationsRefetch } =
    useNotificationControllerGetUnreadNotificationsCount({
      query: {
        retry: false,
        gcTime: 0,
      },
    });

  // 알림 버튼 터치
  const handlePressAlarm = () => {
    return containerNavigation.navigate("Notification");
  };

  // getResponsive 함수 애니메이션 함수 안에 넣을 시 에러 발생
  const footerHeight = getResponsiveSize(100);
  const footerMarginTop = getResponsiveSize(12);

  // 푸터 애니메이션
  const openAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(footerOpen ? footerHeight : 0, {
        duration: 250,
      }),
      marginTop: withTiming(footerOpen ? footerMarginTop : 0, {
        duration: 250,
      }),
      opacity: withTiming(footerOpen ? 1 : 0, { duration: 250 }),
    };
  });

  const rotateAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(footerOpen ? "0deg" : "180deg", {
            duration: 250,
          }),
        },
      ],
    };
  });

  // 푸터 버튼 이벤트
  const handleFooterPress = () => {
    setFooterOpen(!footerOpen);

    if (!footerOpen) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({
          animated: true,
        });
      }, 250);
    }
  };

  // 푸시토큰 업데이트
  useEffect(() => {
    const checkNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "granted") {
        mmkvStorage.setBoolean(IS_NOTIFICATION_GRANTED, true);

        const pushToken = await Notifications.getExpoPushTokenAsync({
          projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
        });

        updatePushToken({
          data: {
            pushToken: pushToken.data,
          },
        });
      } else {
        mmkvStorage.setBoolean(IS_NOTIFICATION_GRANTED, false);
      }
    };

    checkNotificationPermission();
  }, []);

  // 미확인 알림 조회
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        unreadNotificationsRefetch();
      }, 500);

      return () => clearTimeout(timer);
    }, []),
  );

  // 웰컴쿠폰 모달
  useEffect(() => {
    if (mmkvStorage.getBoolean(IS_COUPON_RECEIVED)) {
      setShowCouponModal(true);
    }
  }, []);

  // ATT 권한 요청
  useEffect(() => {
    const requestTrakingPermission = async () => {
      await TrackingTransparency.requestTrackingPermissionsAsync();
    };

    requestTrakingPermission();
  }, []);

  // 홈 화면 진입 이벤트 수집
  useEffect(() => {
    Airbridge.trackEvent(AirbridgeCategory.HOME_VIEWED);
  }, []);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      {/* 헤더 */}
      <HomeHeader
        unreadCount={unreadNotificationData?.count}
        onPressAlarm={handlePressAlarm}
      />

      {/* 팝업 바텀시트 */}
      {!showSplash && !showUpdate && <Popup data={bannerData?.data} />}

      {/* 웰컴쿠폰 모달 */}
      <CustomModal
        visible={showCouponModal}
        onClose={() => {
          mmkvStorage.removeItem(IS_COUPON_RECEIVED);
          setShowCouponModal(false);
        }}
        closeButtonText="닫기"
        onNext={() => {
          mmkvStorage.removeItem(IS_COUPON_RECEIVED);
          setShowCouponModal(false);
          containerNavigation.navigate("Coupon");
        }}
        nextButtonText="확인하기"
        backgroundColor={colors.white}
      >
        <Image
          source={welcomeCoupon}
          style={{
            width: getResponsiveSize(124),
            height: getResponsiveSize(115),
            marginTop: getResponsiveSize(12),
          }}
        />
        <CustomText fontSize={18} fontWeight={"600"}>
          웰컴쿠폰이 도착했습니다!
        </CustomText>
        <CustomText marginTop={8} fontSize={16}>
          가입을 축하드립니다.
        </CustomText>
        <CustomText fontSize={16}>쿠폰함에서 바로 확인해보세요.</CustomText>
      </CustomModal>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <MainBanner data={bannerData?.data} />

          <View style={styles.mainContainer}>
            <WeatherCast />

            <View style={styles.mainArea}>
              {/* 자동세차 */}
              <Pressable
                onPress={() =>
                  containerNavigation.navigate("StoreStack", {
                    screen: "StoreList",
                    params: { serviceType: "AUTO" },
                  })
                }
                style={styles.stores}
              >
                <CustomText
                  color={colors.main}
                  fontSize={18}
                  fontWeight={"600"}
                >
                  자동세차
                </CustomText>
                <CustomText
                  color={colors.gray5}
                  fontSize={13}
                  fontWeight={"500"}
                >
                  최신 기계로 간단하게!
                </CustomText>

                <Image source={autoWashIcon} style={styles.buttonIcon} />
              </Pressable>

              <Pressable
                onPress={() =>
                  containerNavigation.navigate("StoreStack", {
                    screen: "StoreList",
                    params: { serviceType: "HANDS" },
                  })
                }
                style={styles.stores}
              >
                <CustomText
                  color={colors.main}
                  fontSize={18}
                  fontWeight={"600"}
                >
                  핸즈클리닝
                </CustomText>
                <CustomText
                  color={colors.gray5}
                  fontSize={13}
                  fontWeight={"500"}
                >
                  손 세차로 구석구석!
                </CustomText>

                <Image source={handsWashIcon} style={styles.buttonIcon} />
              </Pressable>
            </View>

            <View style={styles.mainArea}>
              <Pressable
                onPress={() =>
                  containerNavigation.navigate("ReceiptScanStack", {
                    screen: "ReceiptScan",
                  })
                }
                style={styles.stores}
              >
                <CustomText
                  color={colors.main}
                  fontSize={18}
                  fontWeight={"600"}
                >
                  세차 할인
                </CustomText>
                <CustomText
                  color={colors.gray5}
                  fontSize={13}
                  fontWeight={"500"}
                >
                  제휴매장 쿠폰 받기
                </CustomText>

                <Image source={receiptIcon} style={styles.buttonIcon} />
              </Pressable>

              <Pressable
                onPress={() =>
                  bottomTabNavigation.navigate("QrScanStack", {
                    screen: "QrScan",
                  })
                }
                style={styles.qrScan}
              >
                <CustomText
                  color={colors.white}
                  fontSize={18}
                  fontWeight={"600"}
                >
                  세차권 사용
                </CustomText>
                <CustomText
                  color={colors.white}
                  fontSize={13}
                  fontWeight={"500"}
                >
                  QR 스캔
                </CustomText>

                <Image source={qrIcon} style={styles.buttonIcon} />
              </Pressable>
            </View>

            <StoreRecommend />
          </View>

          <SubBanner data={bannerData?.data} />

          {/* 푸터 */}
          <View style={styles.footer}>
            <View style={styles.footerTop}>
              <Pressable
                onPress={handleFooterPress}
                style={styles.footerButton}
              >
                <CustomText color={colors.gray7} fontSize={14}>
                  (주)옳은일
                </CustomText>

                <Animated.View
                  style={[styles.footerArrow, rotateAnimatedStyle]}
                >
                  <Image source={homeFooterArrow} style={styles.footerArrow} />
                </Animated.View>
              </Pressable>

              <CustomText color={colors.gray5} fontSize={14} numberOfLines={1}>
                고객센터 운영시간(월~금 : 10-18시)
              </CustomText>
            </View>

            <Animated.View style={[styles.footerBottom, openAnimatedStyle]}>
              <CustomText color={colors.gray5} fontSize={14}>
                대표이사 : 이승열
              </CustomText>
              <CustomText color={colors.gray5} fontSize={14}>
                사업자등록번호 : 850-81-02703
              </CustomText>
              <CustomText color={colors.gray5} fontSize={14}>
                통신판매번호 : 2024-경기하남-2769
              </CustomText>
              <CustomText color={colors.gray5} fontSize={14}>
                주소 : 경기도 하남시 미사강변한강로 155
              </CustomText>
              <CustomText color={colors.gray5} fontSize={14}>
                대표전화 : 1668-1620
              </CustomText>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  mainContainer: {
    width: "100%",
    paddingHorizontal: getResponsiveSize(20),
  },
  productRecommend: {
    width: "100%",
    paddingHorizontal: getResponsiveSize(12),
    paddingVertical: getResponsiveSize(12),
    marginTop: getResponsiveSize(20),
    backgroundColor: colors.main,
    borderRadius: 12,
  },
  mainArea: {
    position: "relative",
    flexDirection: "row",
    width: "100%",
    marginTop: getResponsiveSize(16),
    gap: getResponsiveSize(16),
  },
  buttonIcon: {
    position: "absolute",
    width: getResponsiveSize(68),
    height: getResponsiveSize(68),
    bottom: 0,
    right: 0,
  },
  stores: {
    flex: 1,
    height: getResponsiveSize(112),
    paddingVertical: getResponsiveSize(8),
    paddingHorizontal: getResponsiveSize(12),
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  qrScan: {
    flex: 1,
    height: getResponsiveSize(112),
    paddingVertical: getResponsiveSize(8),
    paddingHorizontal: getResponsiveSize(12),
    backgroundColor: colors.point1,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  qrScanIcon: {
    width: getResponsiveSize(36),
    height: getResponsiveSize(36),
  },
  myStore: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    width: "100%",
    marginTop: getResponsiveSize(40),
    marginBottom: getResponsiveSize(12),
  },
  moreStore: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreIcon: {
    width: getResponsiveSize(20),
    height: getResponsiveSize(20),
  },
  myStoreList: {
    marginBottom: getResponsiveSize(40),
  },
  footer: {
    width: "100%",
    marginTop: getResponsiveSize(40),
    paddingHorizontal: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(16),
    backgroundColor: colors.bg,
  },
  footerTop: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerArrow: {
    width: getResponsiveSize(20),
    height: getResponsiveSize(20),
  },
  footerBottom: {
    justifyContent: "center",
    overflow: "hidden",
  },
});
