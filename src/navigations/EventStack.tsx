import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { EventDetail, EventList } from "@/screens/Event";

export type EventStackParamList = {
  EventList: undefined;
  EventDetail: {
    id: string;
  };
};

const Stack = createNativeStackNavigator();

export const EventStack = () => {
  return (
    <Stack.Navigator initialRouteName="EventList">
      <Stack.Screen
        name="EventList"
        component={EventList}
        options={{
          header: () => <CustomHeader title="이벤트" showBackButton />,
        }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
