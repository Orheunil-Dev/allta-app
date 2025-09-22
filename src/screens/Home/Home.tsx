import { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import {
  autoWashIcon,
  handsWashIcon,
  homeFooterArrow,
  qrIcon,
  receiptIcon,
} from "@/assets/images";
import { colors } from "@/styles";
import { Popup } from "@/components/home/Popup";
import { MainBanner, SubBanner } from "@/components/home/Banner";
import { HomeHeader } from "@/components/home/HomeHeader";
import { useNotificationControllerGetUnreadNotificationsCount } from "@/api/notification/notification";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoreRecommend } from "@/components/home/StoreRecommend";

export const Home = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const [footerOpen, setFooterOpen] = useState<boolean>(false);

  // 미확인 알림 조회
  const { data: unreadNotificationsData, refetch: unreadNotificationsRefetch } =
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
        duration: 300,
      }),
      marginTop: withTiming(footerOpen ? footerMarginTop : 0, {
        duration: 300,
      }),
      opacity: withTiming(footerOpen ? 1 : 0, { duration: 300 }),
    };
  });

  const rotateAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(footerOpen ? "0deg" : "180deg", {
            duration: 300,
          }),
        },
      ],
    };
  });

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        unreadNotificationsRefetch();
      }, 500);

      return () => clearTimeout(timer);
    }, [])
  );

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      {/* 헤더 */}
      <HomeHeader
        unreadCount={unreadNotificationsData?.count}
        onPressAlarm={handlePressAlarm}
      />

      {/* 팝업 바텀시트 */}
      <Popup />

      <ScrollView>
        <View style={styles.container}>
          <MainBanner />

          <View style={styles.mainContainer}>
            {/* 세차 추천 */}
            {/* <View style={styles.washRecommend}>
              <CustomText color={colors.black} fontSize={16}>
                오늘 미세먼지 '나쁨'
              </CustomText>
              <CustomText color={colors.black} fontSize={22} fontWeight={"600"}>
                세차하기 좋은 날이에요
              </CustomText>
            </View> */}

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
                  containerNavigation.navigate("ReceiptStack", {
                    screen: "ReceiptScanner",
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
                  containerNavigation.navigate("StoreStack", {
                    screen: "StoreList",
                    params: { serviceType: "AUTO" },
                  })
                }
                style={styles.qrScan}
              >
                <CustomText
                  color={colors.white}
                  fontSize={18}
                  fontWeight={"600"}
                >
                  QR 스캔
                </CustomText>
                <CustomText
                  color={colors.white}
                  fontSize={13}
                  fontWeight={"500"}
                >
                  스캔 후 세차하기
                </CustomText>

                <Image source={qrIcon} style={styles.buttonIcon} />
              </Pressable>
            </View>

            <StoreRecommend />
          </View>

          <SubBanner />

          {/* 푸터 */}
          <View style={styles.footer}>
            <View style={styles.footerTop}>
              <Pressable
                onPress={() => setFooterOpen(!footerOpen)}
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

              <CustomText color={colors.gray5} fontSize={14}>
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
                주소 : 경기도 하남시 미사강변한강로 155, 1031호
              </CustomText>
              <CustomText color={colors.gray5} fontSize={14}>
                대표전화 : 1688-1620
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
  washRecommend: {
    width: "100%",
    marginTop: getResponsiveSize(32),
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
