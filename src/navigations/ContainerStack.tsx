import { useEffect, useRef } from "react";
import {
  NavigationContainer,
  NavigatorScreenParams,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import { Airbridge } from "airbridge-react-native-sdk";
import { BottomTab, BottomTabParamList } from "./BottomTab";
import { LoginStack, LoginStackParamList } from "./LoginStack";
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
import { Guide } from "@/screens/Guide";
import mmkvStorage from "@/libs/mmkv-storage";
import { formatEllipsis } from "@/utils";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { CommonModal, ErrorModal, LoginModal } from "@/components/modal";
import { IS_GET_PERMISSION } from "@/constants";
import { InquiryStack, InquiryStackParamList } from "./InquiryStack";

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
  InquiryStack: NavigatorScreenParams<InquiryStackParamList>;
  Faq: undefined;
  Profile: {
    name: string;
    email: string | null;
    loginKind: string;
    phoneNumber: string;
  };
  Guide: undefined;
};

interface Props {
  showSplash: boolean;
  showUpdate: boolean;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Stack = createNativeStackNavigator<ContainerStackParamList>();

const linking = {
  prefixes: [
    Linking.createURL("/"),
    "allta-user://",
    "https://allta.airbridge.io",
    "https://allta.abr.ge",
    "https://app.allta.io",
  ],
  config: {
    screens: {
      Guide: "guide",
      PassStack: {
        path: "pass",
        screens: {
          PassList: "",
        },
      },
      ServiceHistory: "service-history",
      Coupon: "coupon",
      EventStack: {
        path: "event",
        screens: {
          EventList: "",
          EventDetail: ":id",
        },
      },
      Referral: "referral",
      InquiryStack: {
        path: "inquiry",
        screens: {
          InquiryList: "",
          InquiryDetail: ":id",
        },
      },
      NoticeStack: {
        path: "notice",
        screens: {
          NoticeList: "",
          NoticeDetail: ":id",
        },
      },
    },
  },
};

export const ContainerStack = ({
  showSplash,
  showUpdate,
  showLoginModal,
  setShowLoginModal,
}: Props) => {
  const navigationRef = useNavigationContainerRef<ContainerStackParamList>();
  const routeNameRef = useRef<string | undefined>(undefined);

  const isGetPermission = mmkvStorage.getBoolean(IS_GET_PERMISSION);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentRoute = navigationRef.getCurrentRoute();

      if (currentRoute) {
        routeNameRef.current = currentRoute.name;
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  // 딥링크 처리
  useEffect(() => {
    Airbridge.setOnDeeplinkReceived((url) => {
      if (!navigationRef.isReady()) return;

      const { hostname, path } = Linking.parse(url);

      switch (hostname) {
        // 가이드
        case "guide": {
          return navigationRef.navigate("Guide");
        }

        // 이용권
        case "pass": {
          return navigationRef.navigate("PassStack", {
            screen: "PassList",
            params: {},
          });
        }

        // 이용 내역
        case "service-history": {
          return navigationRef.navigate("ServiceHistory");
        }

        // 쿠폰
        case "coupon": {
          return navigationRef.navigate("Coupon");
        }

        // 이벤트
        case "event": {
          if (path) {
            return navigationRef.navigate("EventStack", {
              screen: "EventDetail",
              params: { id: path },
            });
          } else {
            return navigationRef.navigate("EventStack", {
              screen: "EventList",
            });
          }
        }

        // 친구추천
        case "referral": {
          return navigationRef.navigate("Referral");
        }

        // 문의
        case "inquiry": {
          if (path) {
            return navigationRef.navigate("InquiryStack", {
              screen: "InquiryDetail",
              params: { id: path },
            });
          } else {
            return navigationRef.navigate("InquiryStack", {
              screen: "InquiryList",
            });
          }
        }

        // 공지사항
        case "notice": {
          if (path) {
            return navigationRef.navigate("NoticeStack", {
              screen: "NoticeDetail",
              params: { id: path },
            });
          } else {
            return navigationRef.navigate("NoticeStack", {
              screen: "NoticeList",
            });
          }
        }
      }
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <LoginModal
        navigationRef={navigationRef}
        visible={showLoginModal}
        setVisible={setShowLoginModal}
      />
      <CommonModal />
      <ErrorModal />

      <Stack.Navigator
        initialRouteName={isGetPermission ? `BottomTab` : `IntroStack`}
      >
        <Stack.Screen
          name="IntroStack"
          component={IntroStack}
          options={{
            headerShown: false,
            presentation: "transparentModal",
          }}
        />
        <Stack.Screen name="BottomTab" options={{ headerShown: false }}>
          {(props) => (
            <BottomTab
              {...props}
              showSplash={showSplash}
              showUpdate={showUpdate}
            />
          )}
        </Stack.Screen>
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
            header: () => <CustomHeader title="FAQ" showBackButton />,
          }}
        />
        <Stack.Screen
          name="InquiryStack"
          component={InquiryStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            header: () => <CustomHeader title="내 정보" showBackButton />,
          }}
        />
        <Stack.Screen
          name="Guide"
          component={Guide}
          options={{
            header: () => (
              <CustomHeader title="올타 이용 가이드" showBackButton />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
