import { BottomButtonArea } from "@/components/layout/BottomButtonArea";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { PaymentStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export const Payment = () => {
  const paymentNavigation =
    useNavigation<NativeStackNavigationProp<PaymentStackParamList>>();

  const handlePayment = () => {
    return paymentNavigation.navigate("PaymentComplete");
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <ScrollView style={styles.container}>
        <CustomText>결제화면</CustomText>
      </ScrollView>

      <BottomButtonArea>
        <CustomButton
          onPress={handlePayment}
          width={"100%"}
          height={getResponsiveSize(53)}
          backgroundColor={colors.point2}
        >
          <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
            결제하기
          </CustomText>
        </CustomButton>
      </BottomButtonArea>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: getResponsiveSize(20),
  },
});
