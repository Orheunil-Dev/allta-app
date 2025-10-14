import { CustomText } from "@/components/ui/CustomText";
import { useAtom } from "jotai";
import { commonModalAtom } from "@/jotai";
import { getResponsiveSize } from "@/utils";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { colors } from "@/styles";
import { CustomButton } from "@/components/ui/CustomButton";

export const CommonModal = () => {
  const [modal, setModal] = useAtom(commonModalAtom);

  const handleClose = () => {
    setModal({
      visible: false,
      title: null,
      message: null,
    });
  };

  return (
    <Modal visible={modal.visible} transparent={true} statusBarTranslucent>
      <Pressable onPress={handleClose} style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modal}>
            <CustomText textAlign="center" fontSize={18} fontWeight={"600"}>
              {modal.title}
            </CustomText>

            <CustomText marginTop={8} fontSize={16} textAlign="center">
              {modal.message}
            </CustomText>

            <CustomButton
              width={"100%"}
              height={43}
              marginTop={24}
              borderWidth={1}
              borderColor={colors.gray2}
              onPress={handleClose}
            >
              <CustomText fontSize={15} fontWeight="500">
                확인
              </CustomText>
            </CustomButton>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  errorIcon: {
    width: getResponsiveSize(32),
    height: getResponsiveSize(32),
    marginVertical: getResponsiveSize(12),
  },
});
