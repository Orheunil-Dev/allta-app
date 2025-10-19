import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { NoticeDetail, NoticeList } from "@/screens/Notice";

export type NoticeStackParamList = {
  NoticeList: undefined;
  NoticeDetail: {
    id: string;
  };
};

const Stack = createNativeStackNavigator();

export const NoticeStack = () => {
  return (
    <Stack.Navigator initialRouteName="NoticeList">
      <Stack.Screen
        name="NoticeList"
        component={NoticeList}
        options={{
          header: () => <CustomHeader title="공지사항" showBackButton />,
        }}
      />
      <Stack.Screen
        name="NoticeDetail"
        component={NoticeDetail}
        options={{
          header: () => <CustomHeader title="공지사항" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
