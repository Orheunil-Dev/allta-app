import {
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import * as Location from "expo-location";
import { ContainerStackParamList, PassStackParamList } from "@/navigations";
import {
  usePassControllerDiscontinueSubscription,
  usePassControllerGetSubscriptionDetail,
} from "@/api/pass/pass";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import {
  formatEllipsis,
  formatPassType,
  formatServiceType,
  formatUsageLeft,
  getResponsiveSize,
} from "@/utils";
import {
  blackDownArrow,
  defaultStoreImage,
  locationIcon,
  termsArrow,
} from "@/assets/images";
import { colors } from "@/styles";
import { useDistanceCalculator } from "@/hooks";
import { useCallback, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/recoil";
import dayjs from "dayjs";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomModal } from "@/components/ui/CustomModal";

type PassListRouteProp = RouteProp<PassStackParamList, "PassDetail">;

export const PassDetail = () => {
  const router = useRoute<PassListRouteProp>();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const setErrorModal = useSetAtom(errorModalAtom);

  const [coordinate, setCoordinate] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 37.5759785,
    lng: 127.1935115,
  });
  const [passTermsOpen, setPassTermsOpen] = useState<boolean>(false);
  const [refundTermsOpen, setRefundTermsOpen] = useState<boolean>(false);
  const [showDiscontinueModal, setShowDicontinueModal] =
    useState<boolean>(false);

  // 구독권 상세 조회 API
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    isError: subscriptionError,
    refetch: subscriptionRefetch,
  } = usePassControllerGetSubscriptionDetail(router.params.id, {
    query: {
      enabled: !!router.params.id && router.params.type !== "TICKET",
      retry: false,
      gcTime: 0,
    },
  });

  // 구독권 갱신 해지 API
  const {
    mutate: discontinueSubscription,
    isPending: discontinueSubscriptionLoading,
    isError: discontinueSubscriptionError,
  } = usePassControllerDiscontinueSubscription();

  const { getDistance } = useDistanceCalculator();

  // 내 매장 상세 화면 이동
  const handleRouteMyStoreDetail = () => {
    const storeId = subscriptionData
      ? subscriptionData.data.store.id
      : undefined;
    const storeName = subscriptionData
      ? subscriptionData.data.store.name
      : undefined;

    if (!storeId || !storeName) {
      return setErrorModal({
        visible: true,
        message: "매장 정보를 찾을 수 없습니다.",
      });
    }

    return containerNavigation.navigate("MyStoreDetail", {
      storeId,
      storeName,
    });
  };

  // 구독권 갱신 해지
  const handleDiscontinue = () => {
    if (router.params.type === "TICKET") return;

    discontinueSubscription(
      {
        data: {
          id: router.params.id,
        },
      },
      {
        onSuccess: () => {
          subscriptionRefetch();
          setShowDicontinueModal(false);
        },
      }
    );
  };

  // getResponsive 함수 애니메이션 함수 안에 넣을 시 에러 발생
  const passTermsInitialHeight = getResponsiveSize(56);
  const passTermsHeight = getResponsiveSize(330);
  const refundTermsInitialHeight = getResponsiveSize(56);
  const refundTermsHeight = getResponsiveSize(330);

  // 이용권 유의사항 애니메이션
  const passTermsAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(
        passTermsOpen ? passTermsHeight : passTermsInitialHeight,
        {
          duration: 300,
        }
      ),
    };
  });
  const passTermsArrowAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(passTermsOpen ? "180deg" : "0deg", {
            duration: 300,
          }),
        },
      ],
    };
  });

  // 환불 유의사항 애니메이션
  const refundTermsAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(
        refundTermsOpen ? refundTermsHeight : refundTermsInitialHeight,
        {
          duration: 300,
        }
      ),
    };
  });
  const refundTermsArrowAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(refundTermsOpen ? "180deg" : "0deg", {
            duration: 300,
          }),
        },
      ],
    };
  });

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
      <CustomModal
        visible={showDiscontinueModal}
        onClose={() => setShowDicontinueModal(false)}
        closeButtonText="취소"
        onNext={handleDiscontinue}
        isNextButtonDisable={discontinueSubscriptionLoading}
        nextButtonText="해지하기"
      >
        <CustomText fontSize={18} fontWeight={"600"}>
          이용권 해지
        </CustomText>

        <CustomText marginTop={8} fontSize={16}>
          이용권 종료일까지
        </CustomText>

        <CustomText fontSize={16}>
          잔여 기간 환불 불가하며, 다음 결제일부터
        </CustomText>
        <CustomText fontSize={16}>자동으로 결제 중단됩니다.</CustomText>

        <CustomText marginTop={16} fontSize={16}>
          정말 해지하시겠습니까?
        </CustomText>
      </CustomModal>

      {subscriptionData?.data && (
        <ScrollView style={styles.container}>
          <CustomText fontSize={18} fontWeight={"600"}>
            매장 정보
          </CustomText>

          <Pressable
            onPress={handleRouteMyStoreDetail}
            style={styles.storeInfo}
          >
            <Image
              source={
                subscriptionData.data.store.mainImage
                  ? { uri: subscriptionData.data.store.mainImage }
                  : defaultStoreImage
              }
              style={styles.storeImage}
            />

            <View>
              <CustomText fontSize={18} fontWeight={"600"}>
                {subscriptionData.data.store.name}
              </CustomText>

              <View style={styles.address}>
                <Image
                  source={locationIcon}
                  style={{
                    width: getResponsiveSize(16),
                    height: getResponsiveSize(16),
                  }}
                />

                <CustomText marginLeft={2} color={colors.gray7} fontSize={14}>
                  {getDistance(
                    coordinate.lat,
                    coordinate.lng,
                    subscriptionData.data.store.lat,
                    subscriptionData.data.store.lng
                  )}
                  km
                </CustomText>

                <View style={styles.divider} />

                <CustomText marginLeft={2} color={colors.gray7} fontSize={14}>
                  {formatEllipsis(subscriptionData.data.store.address, 16)}
                </CustomText>
              </View>
            </View>
          </Pressable>

          <View style={styles.box}>
            <View style={styles.row}>
              <CustomText color={colors.gray5} fontSize={16}>
                세차 서비스
              </CustomText>
              <CustomText fontSize={16}>
                {formatServiceType(subscriptionData.data.serviceType)}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomText color={colors.gray5} fontSize={16}>
                이용권
              </CustomText>
              <CustomText fontSize={16}>
                {formatPassType(subscriptionData.data.type)}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomText color={colors.gray5} fontSize={16}>
                매장
              </CustomText>
              <CustomText fontSize={16}>
                {subscriptionData.data.store.name}
              </CustomText>
            </View>

            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <CustomText color={colors.gray5} fontSize={16}>
                차량번호
              </CustomText>
              <CustomText fontSize={16}>
                {subscriptionData.data.carNumber}
              </CustomText>
            </View>
          </View>

          <CustomText marginTop={40} fontSize={18} fontWeight={"600"}>
            이용권 상세 정보
          </CustomText>

          <View style={styles.box}>
            <View style={styles.row}>
              <CustomText color={colors.gray5} fontSize={16}>
                이용기간
              </CustomText>
              <CustomText fontSize={16}>
                {`${dayjs(subscriptionData.data.payedAt).format(
                  "YY.MM.DD"
                )}~${dayjs(subscriptionData.data.payedAt)
                  .add(1, "month")
                  .format("YY.MM.")}${subscriptionData.data.billingDate}`}
              </CustomText>
            </View>

            {subscriptionData.data.type === "STANDARD" && (
              <View style={styles.row}>
                <CustomText color={colors.gray5} fontSize={16}>
                  남은 횟수
                </CustomText>

                <View style={{ flexDirection: "row" }}>
                  <CustomText
                    color={
                      formatUsageLeft(
                        subscriptionData.data.subscriptionSnapshot.usage ?? 0,
                        subscriptionData.data.subscriptionSnapshot.maxUsage ?? 0
                      ) > 0
                        ? colors.point2
                        : colors.gray5
                    }
                    fontSize={15}
                    fontWeight={"500"}
                  >
                    {formatUsageLeft(
                      subscriptionData.data.subscriptionSnapshot.usage ?? 0,
                      subscriptionData.data.subscriptionSnapshot.maxUsage ?? 0
                    )}
                  </CustomText>
                  <CustomText fontSize={15} fontWeight={"500"}>
                    /{subscriptionData.data.subscriptionSnapshot.maxUsage} 회
                  </CustomText>
                </View>
              </View>
            )}

            <View style={styles.row}>
              <CustomText color={colors.gray5} fontSize={16}>
                다음 결제일
              </CustomText>
              <CustomText fontSize={16}>
                {dayjs(subscriptionData.data.payedAt)
                  .add(1, "month")
                  .format("YY.MM.") + subscriptionData.data.billingDate}
              </CustomText>
            </View>

            <View style={styles.row}>
              <CustomText color={colors.gray5} fontSize={16}>
                예상 결제 금액
              </CustomText>
              <CustomText fontSize={16}>
                {subscriptionData.data.amount.toLocaleString()}원
              </CustomText>
            </View>
          </View>

          <Animated.View style={[styles.terms, passTermsAnimatedStyle]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText fontSize={16} fontWeight={"600"}>
                이용권 유의사항
              </CustomText>

              <Pressable onPress={() => setPassTermsOpen(!passTermsOpen)}>
                <Animated.Image
                  source={termsArrow}
                  style={[styles.arrowIcon, passTermsArrowAnimatedStyle]}
                />
              </Pressable>
            </View>

            <View style={styles.rowDivider} />

            <CustomText fontSize={14}>결제 정보 유의사항</CustomText>
            <CustomText marginTop={4} color={colors.gray5} fontSize={14}>
              • 이용권 시작일 이전까지 전액 환불 가능
            </CustomText>
            <CustomText color={colors.gray5} fontSize={14}>
              • 이용 중 환불 시, 사용 일수 또는 횟수를 차감한 후 정산
            </CustomText>
            <CustomText color={colors.gray5} fontSize={14}>
              • 프리미엄 이용권은 멤버가 사용한 이력도 환불 금액에 포함됩니다.
            </CustomText>

            <CustomText marginTop={20} fontSize={14}>
              결제 정보 유의사항
            </CustomText>
            <CustomText marginTop={4} color={colors.gray5} fontSize={14}>
              • 이용권 시작일 이전까지 전액 환불 가능
            </CustomText>
            <CustomText color={colors.gray5} fontSize={14}>
              • 이용 중 환불 시, 사용 일수 또는 횟수를 차감한 후 정산
            </CustomText>
            <CustomText color={colors.gray5} fontSize={14}>
              • 프리미엄 이용권은 멤버가 사용한 이력도 환불 금액에 포함됩니다.
            </CustomText>
          </Animated.View>

          <CustomButton
            onPress={() => setShowDicontinueModal(true)}
            height={getResponsiveSize(50)}
            marginTop={20}
            borderWidth={1}
            borderColor={colors.gray2}
          >
            <CustomText fontSize={16} fontWeight={"600"}>
              이용권 해지하기
            </CustomText>
          </CustomButton>

          <Animated.View style={[styles.terms, refundTermsAnimatedStyle]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText fontSize={16} fontWeight={"600"}>
                환불 유의사항
              </CustomText>

              <Pressable onPress={() => setRefundTermsOpen(!refundTermsOpen)}>
                <Animated.Image
                  source={termsArrow}
                  style={[styles.arrowIcon, refundTermsArrowAnimatedStyle]}
                />
              </Pressable>
            </View>

            <View style={styles.rowDivider} />

            <CustomText fontSize={14}>결제 정보 유의사항</CustomText>
            <CustomText marginTop={4} color={colors.gray5} fontSize={14}>
              • 이용권 시작일 이전까지 전액 환불 가능
            </CustomText>
            <CustomText color={colors.gray5} fontSize={14}>
              • 이용 중 환불 시, 사용 일수 또는 횟수를 차감한 후 정산
            </CustomText>
            <CustomText color={colors.gray5} fontSize={14}>
              • 프리미엄 이용권은 멤버가 사용한 이력도 환불 금액에 포함됩니다.
            </CustomText>

            <CustomText marginTop={20} fontSize={14}>
              결제 정보 유의사항
            </CustomText>
            <CustomText marginTop={4} color={colors.gray5} fontSize={14}>
              • 이용권 시작일 이전까지 전액 환불 가능
            </CustomText>
            <CustomText color={colors.gray5} fontSize={14}>
              • 이용 중 환불 시, 사용 일수 또는 횟수를 차감한 후 정산
            </CustomText>
            <CustomText color={colors.gray5} fontSize={14}>
              • 프리미엄 이용권은 멤버가 사용한 이력도 환불 금액에 포함됩니다.
            </CustomText>
          </Animated.View>
        </ScrollView>
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(20),
  },
  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(12),
    padding: getResponsiveSize(12),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  storeImage: {
    width: getResponsiveSize(68),
    height: getResponsiveSize(68),
    marginRight: 12,
    borderRadius: 12,
  },
  address: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(4),
  },
  divider: {
    width: 1,
    height: getResponsiveSize(12),
    backgroundColor: colors.gray2,
    marginHorizontal: getResponsiveSize(6),
  },
  box: {
    marginTop: getResponsiveSize(20),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: getResponsiveSize(10),
    paddingHorizontal: getResponsiveSize(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  terms: {
    marginTop: getResponsiveSize(40),
    padding: getResponsiveSize(16),
    backgroundColor: colors.gray1,
    borderRadius: 8,
    overflow: "hidden",
  },
  arrowIcon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
  rowDivider: {
    width: "100%",
    height: 1,
    marginVertical: getResponsiveSize(16),
    backgroundColor: colors.gray2,
  },
});
