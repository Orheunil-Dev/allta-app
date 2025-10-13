import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { PassDetail, PassList } from "@/screens/Pass";
import { PassType } from "@/types";

export type PassStackParamList = {
  PassList: {
    passType?: PassType;
  };
  PassDetail: {
    id: string;
    type: PassType;
  };
};

const Stack = createNativeStackNavigator();

export const PassStack = () => {
  return (
    <Stack.Navigator initialRouteName="PassList">
      <Stack.Screen
        name="PassList"
        component={PassList}
        options={{
          header: () => <CustomHeader title="보유 이용권" showBackButton />,
        }}
      />
      <Stack.Screen
        name="PassDetail"
        component={PassDetail}
        options={{
          header: () => <CustomHeader title="이용권 상세" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
