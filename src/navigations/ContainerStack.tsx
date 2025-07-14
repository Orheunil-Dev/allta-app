import { Home } from "@/screens/Home/Home";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTab, MyStoreStack, ProfileStack, QrStack } from ".";

const Stack = createNativeStackNavigator();

export default function ContainerStack() {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="BottomTab">
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="QrStack" component={QrStack} />
        <Stack.Screen name="MyStoreStack" component={MyStoreStack} />
        <Stack.Screen name="ProfileStack" component={ProfileStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
