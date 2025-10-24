import { useCallback, useState } from "react";
import { Alert, Linking } from "react-native";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { useSetAtom } from "jotai";
import {
  usePassControllerGetSubscriptionDetail,
  usePassControllerGetTicketDetail,
} from "@/api/pass/pass";
import { errorModalAtom } from "@/jotai";
import { ContainerStackParamList, PassStackParamList } from "@/navigations";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { SubscriptionDetail, TicketDetail } from "@/components/pass";

type PassDetailRouteProp = RouteProp<PassStackParamList, "PassDetail">;

export const PassDetail = () => {
  const router = useRoute<PassDetailRouteProp>();

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

  // 일회권 상세 조회 API
  const {
    data: ticketData,
    isLoading: ticketLoading,
    isError: ticketError,
    refetch: ticketRefetch,
  } = usePassControllerGetTicketDetail(router.params.id, {
    query: {
      enabled: !!router.params.id && router.params.type === "TICKET",
      retry: false,
      gcTime: 0,
    },
  });

  // 내 매장 상세 화면 이동
  const handleRouteMyStoreDetail = () => {
    const storeId = subscriptionData
      ? subscriptionData.data.store.id
      : ticketData
      ? ticketData.data.store.id
      : undefined;

    const storeName = subscriptionData
      ? subscriptionData.data.store.name
      : ticketData
      ? ticketData.data.store.name
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
          accuracy: Location.Accuracy.Low,
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
      {subscriptionData?.data && (
        <SubscriptionDetail
          data={subscriptionData.data}
          refetch={subscriptionRefetch}
          router={router}
          coordinate={coordinate}
          handleRouteMyStoreDetail={handleRouteMyStoreDetail}
        />
      )}

      {ticketData?.data && (
        <TicketDetail
          data={ticketData.data}
          coordinate={coordinate}
          handleRouteMyStoreDetail={handleRouteMyStoreDetail}
        />
      )}
    </CustomSafeAreaView>
  );
};
