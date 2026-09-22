import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("nav");

  return (
    <Stack.Navigator initialRouteName="EventList">
      <Stack.Screen
        name="EventList"
        component={EventList}
        options={{
          header: () => <CustomHeader title={t("event.list")} showBackButton />,
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
