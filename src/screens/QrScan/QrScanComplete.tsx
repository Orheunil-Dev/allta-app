import { completeIcon } from "@/assets/images";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { ContainerStackParamList, QrScanStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, StyleSheet, View } from "react-native";
import dayjs from "dayjs";
import { usePassControllerGetAvailablePasses } from "@/api/pass/pass";
import { Car } from "@/types";
import { useState } from "react";
import { CarSelectButton } from "@/components/payment/CarSelectButton";
import { ScrollView } from "react-native-gesture-handler";

type QrScanRouteProps = RouteProp<QrScanStackParamList, "QrScanCompelete">;

export const QrScanComplete = () => {
  const router = useRoute<QrScanRouteProps>();

  const navigation = useNavigation();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const [car, setCar] = useState<Car | null>(null);

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

  console.log(passData);

  const handleRouteHome = () => {
    return containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "BottomTab",
            params: { screen: "Home" },
          },
        ],
      })
    );
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
            marginBottom={12}
            fontSize={18}
            fontWeight={"600"}
          >
            이용권 선택
          </CustomText>
        </View>
      </ScrollView>
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
});
