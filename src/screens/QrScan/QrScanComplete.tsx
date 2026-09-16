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
import { useTranslation } from "react-i18next";
import { CarSelectButton } from "@/components/payment/CarSelectButton";
import { ScrollView } from "react-native-gesture-handler";
import { PassSelectCard } from "@/components/ui/Card/PassSelectCard";
import dayjs from "dayjs";
import { BottomButtonArea } from "@/components/layout/BottomButtonArea";
import { CustomButton } from "@/components/ui/CustomButton";
import { Spinner } from "@/components/ui/Spinner";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";

type Pass = "autoTicket" | "autoStandard" | "autoPremium";

type SubscriptionSnapshot = {
  id: string;
  usage: number;
  maxUsage: number;
  createdAt: string;
};

type QrScanRouteProps = RouteProp<QrScanStackParamList, "QrScanCompelete">;

export const QrScanComplete = () => {
  const { t } = useTranslation("scan");

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
                    error?.message ?? t("qrScanComplete.error.useRequest"),
                });
              },
            }
          );
        } else {
          return setErrorModal({
            visible: true,
            message: t("qrScanComplete.error.invalidPass"),
          });
        }

      case "autoStandard":
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
                    error?.message ?? t("qrScanComplete.error.useRequest"),
                });
              },
            }
          );
        } else {
          return setErrorModal({
            visible: true,
            message: t("qrScanComplete.error.invalidPass"),
          });
        }

      case "autoPremium":
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
                    error?.message ?? t("qrScanComplete.error.useRequest"),
                });
              },
            }
          );
        } else {
          return setErrorModal({
            visible: true,
            message: t("qrScanComplete.error.invalidPass"),
          });
        }

      default:
        return setErrorModal({
          visible: true,
          message: t("qrScanComplete.error.selectPass"),
        });
    }
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <ScrollView style={styles.container}>
        <View style={styles.top}>
          <CustomText fontSize={22} fontWeight={"600"}>
            {t("qrScanComplete.title")}
          </CustomText>
          <CustomText
            marginTop={8}
            textAlign="center"
            color={colors.gray7}
            fontSize={16}
          >
            {t("qrScanComplete.description")}
          </CustomText>
        </View>

        <View style={styles.bottom}>
          <CustomText marginBottom={12} fontSize={18} fontWeight={"600"}>
            {t("qrScanComplete.selectCar")}
          </CustomText>

          <CarSelectButton car={car} setCar={setCar} />

          <CustomText
            marginTop={40}
            marginBottom={4}
            fontSize={18}
            fontWeight={"600"}
          >
            {t("qrScanComplete.selectPass")}
          </CustomText>

          <CustomText
            marginBottom={12}
            color={colors.gray5}
            fontSize={12}
            fontWeight={"500"}
          >
            {t("qrScanComplete.passOrderNotice")}
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
                  name={t("qrScanComplete.pass.ticket")}
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
                  name={t("qrScanComplete.pass.standard")}
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
                  name={t("qrScanComplete.pass.premium")}
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
                  {t("qrScanComplete.noAvailablePass")}
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
              {t("common:confirm")}
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
