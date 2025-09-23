import { CustomHeader } from "@/components/layout/CustomHeader";
import { MyStoreList } from "@/screens/MyStore";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export const MyStoreStack = () => {
  return (
    <Stack.Navigator initialRouteName="MyStoreList">
      <Stack.Screen
        name="MyStoreList"
        component={MyStoreList}
        options={{
          header: () => <CustomHeader title="내 매장" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
