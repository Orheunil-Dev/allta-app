import { CustomHeader } from "@/components/layout/CustomHeader";
import {
  QrScan,
  QrScanComplete,
  QrScanError,
  UsePassComplete,
} from "@/screens/QrScan";
import { formatEllipsis } from "@/utils";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type QrScanStackParamList = {
  QrScan: undefined;
  QrScanError: {
    storeId: string;
    code: string;
  };
  QrScanCompelete: {
    storeId: string;
    storeName: string;
  };
  UsePassCompelete: {
    passType: string;
    serviceType: string;
    approvedAt: string;
    storeName: string;
    carNumber: string;
  };
};

const Stack = createNativeStackNavigator<QrScanStackParamList>();

export const QrScanStack = () => {
  return (
    <Stack.Navigator initialRouteName="QrScan">
      <Stack.Screen
        name="QrScan"
        component={QrScan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="QrScanError"
        component={QrScanError}
        options={{
          header: () => <CustomHeader title="이용권 확인" showCloseButton />,
        }}
      />
      <Stack.Screen
        name="QrScanCompelete"
        component={QrScanComplete}
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
        name="UsePassCompelete"
        component={UsePassComplete}
        options={{
          header: () => <CustomHeader title="" showCloseButton />,
        }}
      />
    </Stack.Navigator>
  );
};
