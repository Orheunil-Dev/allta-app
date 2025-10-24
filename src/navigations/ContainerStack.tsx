import {
  NavigationContainer,
  NavigatorScreenParams,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import { Notification } from "@/screens/Notification";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { CommonModal, ErrorModal, LoginModal } from "@/components/modal";
import { MyStoreDetail } from "@/screens/MyStore";
import { ServiceHistory } from "@/screens/ServiceHistory";
import { PurchaseStack, PurchaseStackParamList } from "./PurchaseStack";
import { Coupon } from "@/screens/Coupon";
import { Referral } from "@/screens/Referral";
import { NoticeStack, NoticeStackParamList } from "./NoticeStack";
import { EventStack, EventStackParamList } from "./EventStack";
import { Faq } from "@/screens/Faq";

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
};

const Stack = createNativeStackNavigator<ContainerStackParamList>();

interface Props {
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContainerStack = ({
  showLoginModal,
  setShowLoginModal,
}: Props) => {
  const navigationRef = useNavigationContainerRef();

  const isFirstLaunch = checkIsFirstLaunch();

  return (
    <NavigationContainer ref={navigationRef}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
