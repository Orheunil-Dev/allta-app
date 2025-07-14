import { useColorScheme } from "@/hooks/useColorScheme.web";
import ContainerStack from "@/navigations/ContainerStack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function App() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("./src/assets/fonts/SpaceMono-Regular.ttf"),
  });

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ContainerStack />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
