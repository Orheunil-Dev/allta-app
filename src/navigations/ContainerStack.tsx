import { useEffect, useRef } from "react";
import {
  NavigationContainer,
  NavigatorScreenParams,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import analytics from "@react-native-firebase/analytics";
import * as Linking from "expo-linking";
import { BottomTab, BottomTabParamList } from "./BottomTab";
import { LoginStack, LoginStackParamList } from "./LoginStack";
import { checkIsFirstLaunch, formatEllipsis } from "@/utils";
import { IntroStack, IntroStackParamList } from "./IntroStack";
import { StoreStack, StoreStackParamList } from "./StoreStack";
import { AddressStack, AddressStackParamList } from "./AddressStack";
import { PaymentStack, PaymentStackParamList } from "./PaymentStack";
import { CarStack, CarStackParamList } from "./CarStack";
import { CardStack, CardStackParamList } from "./CardStack";
import {
  ReceiptScanStack,
  ReceiptScanStackParamList,
} from "./ReceiptScanStack";
import { QrScanStack, QrScanStackParamList } from "./QrScanStack";
import { SettingStack, SettingStackParamList } from "./SettingStack";
import { PassStack, PassStackParamList } from "./PassStack";
import { PurchaseStack, PurchaseStackParamList } from "./PurchaseStack";
import { NoticeStack, NoticeStackParamList } from "./NoticeStack";
import { EventStack, EventStackParamList } from "./EventStack";
import { Notification } from "@/screens/Notification";
import { MyStoreDetail } from "@/screens/MyStore";
import { ServiceHistory } from "@/screens/ServiceHistory";
import { Coupon } from "@/screens/Coupon";
import { Referral } from "@/screens/Referral";
import { Faq } from "@/screens/Faq";
import { Profile } from "@/screens/Profile";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { CommonModal, ErrorModal, LoginModal } from "@/components/modal";

export type ContainerStackParamList = {
  BottomTab: NavigatorScreenParams<BottomTabParamList>;
  IntroStack: NavigatorScreenParams<IntroStackParamList>;
  StoreStack: NavigatorScreenParams<StoreStackParamList>;
  LoginStack: NavigatorScreenParams<LoginStackParamList>;
  AddressStack: NavigatorScreenParams<AddressStackParamList>;
  PaymentStack: NavigatorScreenParams<PaymentStackParamList>;
  PurchaseStack: NavigatorScreenParams<PurchaseStackParamList>;
  CarStack: NavigatorScreenParams<CarStackParamList>;
  CardStack: NavigatorScreenParams<CardStackParamList>;
  PassStack: NavigatorScreenParams<PassStackParamList>;
  ReceiptScanStack: NavigatorScreenParams<ReceiptScanStackParamList>;
  QrScanStack: NavigatorScreenParams<QrScanStackParamList>;
  SettingStack: NavigatorScreenParams<SettingStackParamList>;
  Notification: undefined;
  MyStoreDetail: {
    storeId: string;
    storeName: string;
  };
  ServiceHistory: undefined;
  Coupon: undefined;
  Referral: undefined;
  EventStack: NavigatorScreenParams<EventStackParamList>;
  NoticeStack: NavigatorScreenParams<NoticeStackParamList>;
  Faq: undefined;
  Profile: {
    name: string;
    email: string | null;
    loginKind: string;
    phoneNumber: string;
  };
};

interface Props {
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Stack = createNativeStackNavigator<ContainerStackParamList>();

const linking = {
  prefixes: [Linking.createURL("/"), "allta-user://"],
  config: {
    screens: {
      Coupon: "coupon",
      EventStack: {
        path: "event",
        screens: {
          EventList: "",
          EventDetail: ":id",
        },
      },
    },
  },
};

export const ContainerStack = ({
  showLoginModal,
  setShowLoginModal,
}: Props) => {
  const navigationRef = useNavigationContainerRef();

  const routeNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentRoute = navigationRef.getCurrentRoute();

      if (currentRoute) {
        routeNameRef.current = currentRoute.name;
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const isFirstLaunch = checkIsFirstLaunch();

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={async () => {
        // 앱 시작 시 첫 화면 추적
        const currentRoute = navigationRef.getCurrentRoute();

        if (currentRoute) {
          routeNameRef.current = currentRoute.name;

          await analytics().logEvent("screen_view", {
            screen_name: currentRoute.name,
          });
        }
      }}
      onStateChange={async () => {
        // 화면 전환 감지
        const previousRouteName = routeNameRef.current;
        const currentRoute = navigationRef.getCurrentRoute();

        if (currentRoute && previousRouteName !== currentRoute.name) {
          // GA4 화면 뷰 이벤트 전송
          await analytics().logEvent("screen_view", {
            screen_name: currentRoute.name,
          });
        }

        // 현재 화면 이름 저장
        routeNameRef.current = currentRoute?.name;
      }}
    >
      <LoginModal
        navigationRef={navigationRef}
        visible={showLoginModal}
        setVisible={setShowLoginModal}
      />
      <CommonModal />
      <ErrorModal />

      <Stack.Navigator
        initialRouteName={isFirstLaunch ? `IntroStack` : `BottomTab`}
      >
        <Stack.Screen
          name="IntroStack"
          component={IntroStack}
          options={{
            headerShown: false,
            presentation: "transparentModal",
          }}
        />
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{
            header: () => <CustomHeader title="알림" showBackButton />,
          }}
        />
        <Stack.Screen
          name="StoreStack"
          component={StoreStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LoginStack"
          component={LoginStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddressStack"
          component={AddressStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PaymentStack"
          component={PaymentStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PurchaseStack"
          component={PurchaseStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CarStack"
          component={CarStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CardStack"
          component={CardStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PassStack"
          component={PassStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReceiptScanStack"
          component={ReceiptScanStack}
          options={{
            headerShown: false,
            presentation: "transparentModal",
          }}
        />
        <Stack.Screen
          name="QrScanStack"
          component={QrScanStack}
          options={{
            headerShown: false,
            presentation: "transparentModal",
          }}
        />
        <Stack.Screen
          name="SettingStack"
          component={SettingStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyStoreDetail"
          component={MyStoreDetail}
          options={({ route }) => ({
            header: () => (
              <CustomHeader
                title={formatEllipsis(route.params.storeName, 12)}
                showBackButton
              />
            ),
          })}
        />
        <Stack.Screen
          name="ServiceHistory"
          component={ServiceHistory}
          options={{
            header: () => <CustomHeader title="이용 내역" showBackButton />,
          }}
        />
        <Stack.Screen
          name="Coupon"
          component={Coupon}
          options={{
            header: () => <CustomHeader title="쿠폰" showBackButton />,
          }}
        />
        <Stack.Screen
          name="EventStack"
          component={EventStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Referral"
          component={Referral}
          options={{
            header: () => (
              <CustomHeader title="친구 초대 / 등록" showBackButton />
            ),
          }}
        />
        <Stack.Screen
          name="NoticeStack"
          component={NoticeStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Faq"
          component={Faq}
          options={{
            header: () => <CustomHeader title="고객센터" showBackButton />,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            header: () => <CustomHeader title="내 정보" showBackButton />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
