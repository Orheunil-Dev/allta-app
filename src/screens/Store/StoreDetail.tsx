import { useStoreControllerGetStoreDetail } from "@/api/store/store";
import {
  clockIcon,
  defaultStoreImage,
  grayDownArrow,
  locationIcon,
  storeNoticeIcon,
} from "@/assets/images";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { StoreStackParamList } from "@/navigations";
import { getResponsiveSize, getStoreBusinessHours } from "@/utils";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import * as Location from "expo-location";
import { useDistanceCalculator } from "@/hooks";
import { colors } from "@/styles";
import { PassInfo } from "@/components/store/PassInfo";
import { ScrollView } from "react-native-gesture-handler";
import { CustomButton } from "@/components/ui/CustomButton";

type StoreDetailRouteProp = RouteProp<StoreStackParamList, "StoreDetail">;

export const StoreDetail = () => {
  const router = useRoute<StoreDetailRouteProp>();

  const [coordinate, setCoordinate] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 37.5759785,
    lng: 127.1935115,
  });
  const [showBusinessHours, setShowBusinessHours] = useState<boolean>(false);
  const [tab, setTab] = useState<"PASS" | "STORE" | "INFO">("PASS");

  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
  } = useStoreControllerGetStoreDetail(router.params.storeId, {
    query: { enabled: !!router.params.storeId },
  });

  const { getDistance } = useDistanceCalculator();

  const handleToggleBusinessHours = () => {
    setShowBusinessHours(!showBusinessHours);
  };

  const renderInfo = () => {
    if (!storeData?.store) return null;

    switch (tab) {
      case "PASS":
        return (
          <PassInfo
            serviceType={router.params.serviceType}
            standardMaxUsage={storeData.store.standardMaxUsage as number}
            passPrice={storeData.store.passPrice}
          />
        );

      case "STORE":
        return <View></View>;

      case "INFO":
        return <View></View>;

      default:
        return (
          <PassInfo
            serviceType={router.params.serviceType}
            passPrice={storeData.store.passPrice}
          />
        );
    }
  };

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
      <ScrollView>
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
            <View style={styles.businessHours}>
              <Image
                source={clockIcon}
                style={{
                  width: getResponsiveSize(16),
                  height: getResponsiveSize(16),
                  marginRight: getResponsiveSize(4),
                }}
              />

              <CustomText color={colors.gray7} fontSize={15} fontWeight={"500"}>
                {
                  getStoreBusinessHours(
                    storeData.store.businessHours as Record<
                      string,
                      { open: string; close: string }
                    >,
                    storeData.store.breakTime,
                    storeData.store.holidays
                  ).status
                }
              </CustomText>

              <View style={styles.divider} />

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
                      storeData.store.businessHours as Record<
                        string,
                        { open: string; close: string }
                      >,
                      storeData.store.breakTime,
                      storeData.store.holidays
                    ).hours
                  }
                </CustomText>

                <Image
                  source={grayDownArrow}
                  style={{
                    width: getResponsiveSize(8),
                    height: getResponsiveSize(4),
                  }}
                />
              </Pressable>
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

          {router.params.hasGroup && (
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

      <View style={styles.bottom}>
        <CustomButton
          height={getResponsiveSize(53)}
          marginTop={12}
          backgroundColor={colors.point2}
        >
          <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
            이용권 구매하기
          </CustomText>
        </CustomButton>
      </View>
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
  bottom: {
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 5,
  },
});
