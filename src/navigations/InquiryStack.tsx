import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { InquiryDetail, InquiryList, InquiryRegister } from "@/screens/Inquiry";

export type InquiryStackParamList = {
  InquiryList: undefined;
  InquiryRegister: undefined;
  InquiryDetail: {
    id: string;
  };
};

const Stack = createNativeStackNavigator();

export const InquiryStack = () => {
  const { t } = useTranslation("nav");

  return (
    <Stack.Navigator initialRouteName="InquiryList">
      <Stack.Screen
        name="InquiryList"
        component={InquiryList}
        options={{
          header: () => <CustomHeader title={t("inquiry.title")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="InquiryDetail"
        component={InquiryDetail}
        options={{
          header: () => <CustomHeader title={t("inquiry.title")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="InquiryRegister"
        component={InquiryRegister}
        options={{
          header: () => <CustomHeader title={t("inquiry.title")} showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
