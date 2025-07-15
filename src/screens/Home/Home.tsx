import { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  BottomTabParamList,
  ContainerStackParamList,
  HomeStackParamList,
} from "@/navigations";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  alarmEmpty,
  alarmUnread,
  alltaHeaderLogo,
  autoWashImage,
  homeFooterArrow,
  homeMoreArrow,
  homeQrScan,
} from "@/assets/images";
import { useAlarmControllerGetUnreadAlarmCount } from "@/api/alarm/alarm";
import { bannerData, myStoreData } from "@/mock";
import { colors } from "@/styles";
import Carousel from "react-native-reanimated-carousel";
import { CustomText } from "@/components/ui/CustomText";
import { RecommendCard } from "@/components/ui/Card";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { getFontSize, getResponsiveSize } from "@/utils";

const { width: screenWidth } = Dimensions.get("window");

export const Home = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const homeNavigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const bottomTabNavigation =
    useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [footerOpen, setFooterOpen] = useState<boolean>(false);

  // 미확인 알림 조회
  const { data: alarmCount, refetch } = useAlarmControllerGetUnreadAlarmCount();

  // 내 매장 목록 조회

  // 추천 매장 목록 조회

  // 푸터 애니메이션
  const footerHeight = getResponsiveSize(100);
  const footerMarginTop = getResponsiveSize(12);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image source={alltaHeaderLogo} style={styles.headerLogo} />

        <Pressable onPress={() => containerNavigation.navigate("Alarm")}>
          {alarmCount ? (
            <Image source={alarmUnread} style={styles.alarm} />
          ) : (
            <Image source={alarmEmpty} style={styles.alarm} />
          )}
        </Pressable>
      </View>

      <ScrollView>
        <View style={styles.container}>
          {/* 배너 슬라이더 */}
          <View style={styles.carouselContainer}>
            <Carousel
              data={bannerData}
              width={screenWidth}
              height={getResponsiveSize(200)}
              loop
              autoPlay
              scrollAnimationDuration={1000}
              autoPlayInterval={2500}
              onSnapToItem={(index) => setCurrentSlide(index)}
              renderItem={({ item, index }) => (
                <Pressable key={index} style={styles.bannerCard}>
                  <Image src={item.image} style={styles.bannerImage} />
                </Pressable>
              )}
            />

            <View style={styles.indicator}>
              <CustomText color={colors.white} fontSize={12} fontWeight={"700"}>
                {currentSlide + 1}
              </CustomText>

              <CustomText color="rgba(255, 255, 255, 0.7)" fontSize={12}>
                {" "}
                / {bannerData.length}
              </CustomText>
            </View>
          </View>
          <View style={styles.mainContainer}>
            {/* 세차 추천 */}
            <View style={styles.washRecommend}>
              <CustomText color={colors.black} fontSize={16}>
                오늘 미세먼지 '나쁨'
              </CustomText>
              <CustomText
                color={colors.black}
                fontSize={22}
                fontWeight={"600"}
                marginTop={5}
              >
                세차하기 좋은 날이에요
              </CustomText>
            </View>

            {/* 상품 추천 */}
            <Pressable
              style={styles.productRecommend}
              onPress={() => homeNavigation.navigate("ExploreStores")}
            >
              <CustomText color={colors.white} fontSize={18} fontWeight={"700"}>
                올타 플러스
              </CustomText>
              <CustomText color={colors.white} fontSize={13} marginTop={6}>
                여럿이 함께, 더 알뜰하게
              </CustomText>
            </Pressable>

            <View style={styles.autoWash}>
              {/* 자동세차 */}
              <Pressable
                onPress={() => homeNavigation.navigate("ExploreStores")}
                style={styles.exploreStores}
              >
                <CustomText
                  color={colors.main}
                  fontSize={18}
                  fontWeight={"700"}
                >
                  자동세차
                </CustomText>
                <CustomText color={colors.gray5} fontSize={13} marginTop={6}>
                  최신 세차 기계로 간단하게!
                </CustomText>

                <Image source={autoWashImage} style={styles.autoWashImage} />
              </Pressable>

              {/* QR 스캔 */}
              <Pressable
                onPress={() => bottomTabNavigation.navigate("QrStack")}
                style={styles.qrScan}
              >
                <Image source={homeQrScan} style={styles.qrScanIcon} />

                <CustomText
                  color={colors.black}
                  fontSize={16}
                  fontWeight={"500"}
                  marginTop={5}
                >
                  QR 스캔
                </CustomText>
              </Pressable>
            </View>

            {/* 추천 매장 */}
            <View>
              <View style={styles.myStore}>
                <CustomText
                  color={colors.black}
                  fontSize={18}
                  fontWeight={"600"}
                >
                  내 이용 매장
                </CustomText>

                <Pressable
                  onPress={() => bottomTabNavigation.navigate("MyStoreStack")}
                  style={styles.moreStore}
                >
                  <CustomText
                    color={colors.gray5}
                    fontSize={12}
                    fontWeight={"600"}
                  >
                    더보기
                  </CustomText>

                  <Image source={homeMoreArrow} style={styles.moreIcon} />
                </Pressable>
              </View>

              <View style={styles.myStoreList}>
                {myStoreData.map((value, index) => (
                  <RecommendCard
                    key={index}
                    name={value.name}
                    address={value.address}
                    image={value.image}
                    distance={5.2}
                  />
                ))}
              </View>
            </View>
          </View>

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
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: getResponsiveSize(60),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
    zIndex: 1,
  },
  headerLogo: {
    width: getResponsiveSize(58),
    height: getResponsiveSize(28),
  },
  alarm: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
  container: {
    height: "100%",
    alignItems: "center",
  },
  carouselContainer: {
    position: "relative",
    width: "100%",
    height: getResponsiveSize(200),
  },
  bannerCarousel: {
    width: "100%",
    height: "100%",
  },
  bannerCard: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  bannerImage: {
    width: "100%",
    height: getResponsiveSize(200),
    paddingHorizontal: getResponsiveSize(20),
    borderRadius: 10,
  },
  indicator: {
    position: "absolute",
    flexDirection: "row",
    right: getResponsiveSize(30),
    bottom: getResponsiveSize(10),
    width: "auto",
    height: "auto",
    paddingVertical: getResponsiveSize(4),
    paddingHorizontal: getResponsiveSize(8),
    fontSize: getFontSize(12),
    backgroundColor: "rgba(38, 38, 39, 0.7)",
    borderRadius: 40,
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
  autoWash: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: getResponsiveSize(88),
    marginTop: getResponsiveSize(16),
  },
  autoWashImage: {
    position: "absolute",
    width: getResponsiveSize(60),
    height: getResponsiveSize(46),
    bottom: getResponsiveSize(12),
    right: getResponsiveSize(12),
  },
  exploreStores: {
    flex: 1,
    height: "100%",
    paddingHorizontal: getResponsiveSize(12),
    paddingVertical: getResponsiveSize(12),
    marginRight: getResponsiveSize(16),
    backgroundColor: colors.white,
    borderRadius: 12,
    borderColor: colors.gray2,
    borderWidth: 1,
    // shadowColor: colors.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 6,
    // shadowOpacity: 0.1,
    // elevation: 5,
  },
  qrScan: {
    justifyContent: "center",
    alignItems: "center",
    width: getResponsiveSize(72),
    height: "100%",
    backgroundColor: colors.white,
    borderRadius: 12,
    borderColor: colors.gray2,
    borderWidth: 1,
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
    marginBottom: getResponsiveSize(8),
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
    paddingHorizontal: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(16),
    backgroundColor: colors.gray1,
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
