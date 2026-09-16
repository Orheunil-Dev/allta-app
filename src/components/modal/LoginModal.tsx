import { CustomModal } from "@/components/ui/CustomModal";
import { CustomText } from "@/components/ui/CustomText";
import { ContainerStackParamList } from "@/navigations";
import {
  CommonActions,
  NavigationContainerRefWithCurrent,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
}

export const LoginModal = ({ visible, setVisible, navigationRef }: Props) => {
  const { t } = useTranslation("auth");

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const goLogin = () => {
    setVisible(false);

    containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "LoginStack",
          },
        ],
      })
    );
  };

  const goHome = () => {
    setVisible(false);

    const currentRoute = navigationRef.getCurrentRoute();

    if (currentRoute?.name === "Home") {
      return;
    }

    containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "BottomTab",
            params: { screen: "Home" },
          },
        ],
      })
    );
  };

  return (
    <CustomModal
      visible={visible}
      onNext={goLogin}
      nextButtonText={t("common:auth.login")}
      onClose={goHome}
      closeButtonText={t("common:cancel")}
    >
      <CustomText marginTop={12} fontSize={18} fontWeight="600">
        {t("loginModal.title")}
      </CustomText>
      <CustomText marginTop={16} fontSize={16}>
        {t("loginModal.message")}
      </CustomText>
      <CustomText marginTop={2} fontSize={16}>
        {t("loginModal.question")}
      </CustomText>
    </CustomModal>
  );
};
