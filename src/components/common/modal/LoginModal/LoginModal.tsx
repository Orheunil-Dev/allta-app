import { CustomModal } from "@/components/ui/CustomModal";
import { CustomText } from "@/components/ui/CustomText";
import { ContainerStackParamList } from "@/navigations";
import {
  CommonActions,
  NavigationContainerRefWithCurrent,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
}

export const LoginModal = ({ visible, setVisible, navigationRef }: Props) => {
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
      nextButtonText="로그인"
      onClose={goHome}
      closeButtonText="취소"
    >
      <CustomText marginTop={12} fontSize={18} fontWeight="600">
        알림
      </CustomText>
      <CustomText marginTop={16} fontSize={16}>
        로그인이 필요한 서비스입니다.
      </CustomText>
      <CustomText marginTop={2} fontSize={16}>
        로그인하시겠습니까?
      </CustomText>
    </CustomModal>
  );
};
