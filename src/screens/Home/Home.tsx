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
  homeMoreArrow,
  homeQrScan,
} from "@/assets/images";
import { useAlarmControllerGetUnreadAlarmCount } from "@/api/alarm/alarm";
import { bannerData, myStoreData } from "@/mock";
import { colors } from "@/styles";
import Carousel from "react-native-reanimated-carousel";
import { CustomText } from "@/components/ui/CustomText";
import { RecommendCard } from "@/components/ui/Card";

const { width: screenWidth } = Dimensions.get("window");

export const Home = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const homeNavigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const bottomTabNavigation =
    useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  const [currentSlide, setCurrentSlide] = useState(0);

  // 미확인 알림 조회
  const { data: alarmCount, refetch } = useAlarmControllerGetUnreadAlarmCount();

  // 내 매장 목록 조회

  // 추천 매장 목록 조회

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
              height={200}
              loop
              autoPlay
              scrollAnimationDuration={1000}
              autoPlayInterval={2500}
              onSnapToItem={(index) => setCurrentSlide(index)}
              renderItem={({ item, index }) => (
                <View key={index} style={styles.bannerCard}>
                  <Image src={item.image} style={styles.bannerImage} />
                </View>
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
              <CustomText color={colors.white} fontSize={22} fontWeight={"700"}>
                올타 플러스
              </CustomText>
              <CustomText color={colors.white} fontSize={16} marginTop={6}>
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
                  fontSize={22}
                  fontWeight={"700"}
                >
                  자동세차
                </CustomText>
                <CustomText color={colors.gray5} fontSize={16} marginTop={6}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  headerLogo: {
    width: 58,
    height: 28,
  },
  alarm: {
    width: 24,
    height: 24,
  },
  container: {
    height: "100%",
    alignItems: "center",
    paddingVertical: 5,
  },
  carouselContainer: { position: "relative", width: "100%", height: 200 },
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
    height: 200,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  indicator: {
    position: "absolute",
    flexDirection: "row",
    right: 30,
    bottom: 10,
    width: "auto",
    height: "auto",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
    backgroundColor: "rgba(38, 38, 39, 0.7)",
    borderRadius: 40,
  },
  mainContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  washRecommend: {
    width: "100%",
    marginTop: 32,
  },
  productRecommend: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 20,
    backgroundColor: colors.main,
    borderRadius: 12,
  },
  autoWash: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 88,
    marginTop: 16,
  },
  autoWashImage: {
    position: "absolute",
    width: 60,
    height: 46,
    bottom: 12,
    right: 12,
  },
  exploreStores: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 16,
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
    width: 72,
    height: "100%",
    backgroundColor: colors.white,
    borderRadius: 12,
    borderColor: colors.gray2,
    borderWidth: 1,
  },
  qrScanIcon: {
    width: 36,
    height: 36,
  },
  myStore: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    width: "100%",
    marginTop: 32,
    marginBottom: 8,
  },
  moreStore: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreIcon: {
    width: 20,
    height: 20,
  },
  myStoreList: {
    columnGap: 12,
  },
});
