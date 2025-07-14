import { CustomHeader } from "@/components/common/layout/CustomHeader";
import { ExploreStores } from "@/screens/ExploreStores";
import { Home } from "@/screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type HomeStackParamList = {
  Home: undefined;
  ExploreStores: undefined;
};

const Stack = createNativeStackNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: "홈",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ExploreStores"
        component={ExploreStores}
        options={{
          header: () => <CustomHeader title="매장 둘러보기" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
