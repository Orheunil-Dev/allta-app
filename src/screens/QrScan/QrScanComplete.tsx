import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { QrScanStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import {
  usePassControllerGetAvailablePasses,
  usePassControllerUseSubscription,
  usePassControllerUseTicket,
} from "@/api/pass/pass";
import { Car } from "@/types";
import { useState } from "react";
import { CarSelectButton } from "@/components/payment/CarSelectButton";
import { ScrollView } from "react-native-gesture-handler";
import { PassSelectCard } from "@/components/ui/Card/PassSelectCard";
import dayjs from "dayjs";
import { BottomButtonArea } from "@/components/layout/BottomButtonArea";
import { CustomButton } from "@/components/ui/CustomButton";
import { Spinner } from "@/components/ui/Spinner";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";

type Pass =
  | "autoTicket"
  | "handsTicket"
  | "autoStandard"
  | "handsStandard"
  | "autoPremium"
  | "handsPremium";

type SubscriptionSnapshot = {
  id: string;
  usage: number;
  maxUsage: number;
  createdAt: string;
};

type QrScanRouteProps = RouteProp<QrScanStackParamList, "QrScanCompelete">;

export const QrScanComplete = () => {
  const router = useRoute<QrScanRouteProps>();

  const qrScanStackNavigation =
    useNavigation<NativeStackNavigationProp<QrScanStackParamList>>();

  const setErrorModal = useSetAtom(errorModalAtom);

  const [car, setCar] = useState<Car | null>(null);
  const [pass, setPass] = useState<Pass | null>(null);

  // 보유 이용권 목록 조회 API
  const {
    data: passData,
    isLoading: passLoading,
    isError: passError,
  } = usePassControllerGetAvailablePasses(
    {
      storeId: router.params.storeId,
      carNumber: car?.number ?? "",
    },
    {
      query: {
        queryKey: [car],
        enabled: !!car?.number,
        gcTime: 0,
      },
    }
  );

  // 일회권 사용 API
  const {
    mutate: useTicket,
    isPending: useTicketLoading,
    isError: useTicketError,
  } = usePassControllerUseTicket();

  // 구독권 사용 API
  const {
    mutate: useSubscription,
    isPending: useSubscriptionLoading,
    isError: useSubscriptionError,
  } = usePassControllerUseSubscription();

  const handleSelectPass = (value: Pass) => () => {
    if (pass === value) {
      return setPass(null);
    }

    return setPass(value);
  };

  // 이용권 사용
  const handleUsePass = () => {
    if (!pass || !passData) return;

    if (useTicketLoading || useSubscriptionLoading) return;

    let passId: string | undefined;

    switch (pass) {
      case "autoTicket":
      case "handsTicket":
        passId = (passData[pass] as { id: string })?.id;

        if (passId) {
          return useTicket(
            {
              data: { ticketId: passId, storeId: router.params.storeId },
            },
            {
              onSuccess: (res) => {
                return qrScanStackNavigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: "UsePassCompelete",
                        params: {
                          passType: "TICKET",
                          serviceType: res.data.serviceType,
                          createdAt: res.data.createdAt,
                          storeName: res.data.storeName,
                          carBrand: res.data.carBrand,
                          carType: res.data.carType,
                          carModel: res.data.carModel,
                          carNumber: res.data.carNumber,
                        },
                      },
                    ],
                  })
                );
              },
              onError: (error: any) => {
                setErrorModal({
                  visible: true,
                  message:
                    error?.message ??
                    "이용권 사용 요청 중 오류가 발생했습니다.",
                });
              },
            }
          );
        } else {
          return setErrorModal({
            visible: true,
            message: "잘못된 이용권 정보입니다.",
          });
        }

      case "autoStandard":
      case "handsStandard":
        passId = (passData[pass] as { id: string })?.id;

        if (passId) {
          return useSubscription(
            {
              data: { subscriptionId: passId, storeId: router.params.storeId },
            },
            {
              onSuccess: (res) => {
                return qrScanStackNavigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: "UsePassCompelete",
                        params: {
                          passType: "STANDARD",
                          serviceType: res.data.serviceType,
                          approvedAt: res.data.createdAt,
                          storeName: res.data.storeName,
                          carBrand: res.data.carBrand,
                          carType: res.data.carType,
                          carModel: res.data.carModel,
                          carNumber: res.data.carNumber,
                        },
                      },
                    ],
                  })
                );
              },
              onError: (error: any) => {
                setErrorModal({
                  visible: true,
                  message:
                    error?.message ??
                    "이용권 사용 요청 중 오류가 발생했습니다.",
                });
              },
            }
          );
        } else {
          return setErrorModal({
            visible: true,
            message: "잘못된 이용권 정보입니다.",
          });
        }

      case "autoPremium":
      case "handsPremium":
        passId = (passData[pass] as { id: string })?.id;

        if (passId) {
          return useSubscription(
            {
              data: { subscriptionId: passId, storeId: router.params.storeId },
            },
            {
              onSuccess: (res) => {
                return qrScanStackNavigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: "UsePassCompelete",
                        params: {
                          passType: "PREMIUM",
                          serviceType: res.data.serviceType,
                          approvedAt: res.data.createdAt,
                          storeName: res.data.storeName,
                          carBrand: res.data.carBrand,
                          carType: res.data.carType,
                          carModel: res.data.carModel,
                          carNumber: res.data.carNumber,
                        },
                      },
                    ],
                  })
                );
              },
              onError: (error: any) => {
                setErrorModal({
                  visible: true,
                  message:
                    error?.message ??
                    "이용권 사용 요청 중 오류가 발생했습니다.",
                });
              },
            }
          );
        } else {
          return setErrorModal({
            visible: true,
            message: "잘못된 이용권 정보입니다.",
          });
        }

      default:
        return setErrorModal({
          visible: true,
          message: "이용권 선택 중 오류가 발생했습니다.",
        });
    }
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <ScrollView style={styles.container}>
        <View style={styles.top}>
          <CustomText fontSize={22} fontWeight={"600"}>
            QR 스캔 완료!
          </CustomText>
          <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
            이용할 차량과 이용권을 선택해주세요.
          </CustomText>
          <CustomText color={colors.gray7} fontSize={16}>
            선택 후 이용권 변경이 어렵습니다.
          </CustomText>
        </View>

        <View style={styles.bottom}>
          <CustomText marginBottom={12} fontSize={18} fontWeight={"600"}>
            차량 선택
          </CustomText>

          <CarSelectButton car={car} setCar={setCar} />

          <CustomText
            marginTop={40}
            marginBottom={4}
            fontSize={18}
            fontWeight={"600"}
          >
            이용권 선택
          </CustomText>

          <CustomText
            marginBottom={12}
            color={colors.gray5}
            fontSize={12}
            fontWeight={"500"}
          >
            * 각 이용권 종류별로 만료일이 임박한 이용권이 우선 노출됩니다.
          </CustomText>

          {passLoading && (
            <View style={styles.emptyBox}>
              <Spinner color={colors.gray2} />
            </View>
          )}

          {passData?.ok && (
            <View style={styles.cardList}>
              {passData.autoTicket && (
                <PassSelectCard
                  type="TICKET"
                  name="자동세차 일회권"
                  availablePeriod={`~ ${dayjs(
                    passData.autoTicket.expiredAt as Date
                  ).format("YYYY.MM.DD")} `}
                  onPress={handleSelectPass("autoTicket")}
                  isSelected={pass === "autoTicket"}
                />
              )}

              {passData.autoStandard && (
                <PassSelectCard
                  type="STANDARD"
                  name="자동세차 스탠다드"
                  usage={
                    (
                      passData?.autoStandard.subscriptionSnapshot as
                        | SubscriptionSnapshot
                        | undefined
                    )?.usage ?? 0
                  }
                  maxUsage={
                    (
                      passData.autoStandard.subscriptionSnapshot as
                        | SubscriptionSnapshot
                        | undefined
                    )?.maxUsage ?? 0
                  }
                  availablePeriod={`~ ${dayjs(
                    passData.autoStandard.paidAt as Date
                  )
                    .add(1, "month")
                    .format("YYYY.MM")}.${passData.autoStandard.billingDate}`}
                  onPress={handleSelectPass("autoStandard")}
                  isSelected={pass === "autoStandard"}
                  isAvailable={passData.autoStandard.isAvailable as boolean}
                />
              )}

              {passData.autoPremium && (
                <PassSelectCard
                  type="PREMIUM"
                  name="자동세차 프리미엄"
                  availablePeriod={`~ ${dayjs(
                    passData.autoPremium.paidAt as Date
                  )
                    .add(1, "month")
                    .format("YYYY.MM")}.${passData.autoPremium.billingDate}`}
                  onPress={handleSelectPass("autoPremium")}
                  isSelected={pass === "autoPremium"}
                  isAvailable={passData.autoPremium.isAvailable as boolean}
                />
              )}

              {passData.handsTicket && (
                <PassSelectCard
                  type="TICKET"
                  name="핸즈클리닝 일회권"
                  availablePeriod={`~ ${dayjs(
                    passData.handsTicket.expiredAt as Date
                  ).format("YYYY.MM.DD")} `}
                  onPress={handleSelectPass("handsTicket")}
                  isSelected={pass === "handsTicket"}
                />
              )}

              {passData.handsStandard && (
                <PassSelectCard
                  type="STANDARD"
                  name="핸즈클리닝 스탠다드"
                  usage={
                    (
                      passData?.handsStandard.subscriptionSnapshot as
                        | SubscriptionSnapshot
                        | undefined
                    )?.usage ?? 0
                  }
                  maxUsage={
                    (
                      passData.handsStandard.subscriptionSnapshot as
                        | SubscriptionSnapshot
                        | undefined
                    )?.maxUsage ?? 0
                  }
                  availablePeriod={`~ ${dayjs(
                    passData.handsStandard.paidAt as Date
                  )
                    .add(1, "month")
                    .format("YYYY.MM")}.${passData.handsStandard.billingDate}`}
                  onPress={handleSelectPass("handsStandard")}
                  isSelected={pass === "handsStandard"}
                  isAvailable={passData.handsStandard.isAvailable as boolean}
                />
              )}

              {passData.handsPremium && (
                <PassSelectCard
                  type="PREMIUM"
                  name="핸즈클리닝 프리미엄"
                  availablePeriod={`~ ${dayjs(
                    passData.handsPremium.paidAt as Date
                  )
                    .add(1, "month")
                    .format("YYYY.MM")}.${passData.handsPremium.billingDate}`}
                  onPress={handleSelectPass("handsPremium")}
                  isSelected={pass === "handsPremium"}
                  isAvailable={passData.handsPremium.isAvailable as boolean}
                />
              )}
            </View>
          )}

          {(!passLoading && !passData) ||
            (!passData?.hasAvailablePass && (
              <View style={styles.emptyBox}>
                <CustomText
                  color={colors.gray5}
                  fontSize={20}
                  fontWeight={"600"}
                >
                  사용 가능한 이용권이 없습니다.
                </CustomText>
              </View>
            ))}
        </View>
      </ScrollView>

      <BottomButtonArea>
        <CustomButton
          isDisabled={!pass || useTicketLoading || useSubscriptionLoading}
          onPress={handleUsePass}
          width={"100%"}
          height={getResponsiveSize(53)}
          backgroundColor={pass ? colors.point2 : colors.gray2}
        >
          {useTicketLoading || useSubscriptionLoading ? (
            <Spinner />
          ) : (
            <CustomText
              color={pass ? colors.white : colors.gray5}
              fontSize={18}
              fontWeight={"600"}
            >
              확인
            </CustomText>
          )}
        </CustomButton>
      </BottomButtonArea>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  top: {
    width: "100%",
    alignItems: "center",
    paddingVertical: getResponsiveSize(40),
    paddingHorizontal: getResponsiveSize(20),
    borderBottomWidth: 6,
    borderBottomColor: colors.gray1,
  },
  bottom: {
    width: "100%",
    paddingVertical: getResponsiveSize(40),
    paddingHorizontal: getResponsiveSize(20),
  },
  cardList: {
    gap: getResponsiveSize(20),
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: getResponsiveSize(60),
  },
});
