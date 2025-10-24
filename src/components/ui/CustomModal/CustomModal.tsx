import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { CustomText } from "../CustomText";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { CustomButton } from "../CustomButton";

interface CustomModalProps {
  visible: boolean;
  onNext?: () => void;
  nextButtonText?: string;
  isNextButtonDisable?: boolean;
  onClose?: () => void;
  closeButtonText?: string;
  isCloseButtonDisable?: boolean;
  backgroundColor?: string;
  children: React.ReactNode;
}

export const CustomModal = ({
  visible,
  onNext,
  nextButtonText,
  isNextButtonDisable,
  onClose,
  closeButtonText,
  isCloseButtonDisable,
  backgroundColor = colors.white,
  children,
}: CustomModalProps) => {
  return (
    <Modal transparent={true} visible={visible} statusBarTranslucent>
      <Pressable onPress={onClose} style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={[{ backgroundColor }, styles.modalContainer]}>
            {children}

            <View style={styles.buttonBox}>
              {onClose && (
                <CustomButton
                  onPress={onClose}
                  isDisabled={isCloseButtonDisable}
                  flex={1}
                  borderWidth={1}
                  borderColor={colors.gray2}
                >
                  <CustomText
                    fontSize={15}
                    fontWeight="500"
                    color={colors.black}
                  >
                    {closeButtonText ?? "확인"}
                  </CustomText>
                </CustomButton>
              )}

              {onNext && (
                <CustomButton
                  onPress={onNext}
                  isDisabled={isNextButtonDisable}
                  flex={1}
                  backgroundColor={colors.point2}
                >
                  <CustomText fontSize={15} fontWeight="500" color="#fff">
                    {nextButtonText ?? "확인"}
                  </CustomText>
                </CustomButton>
              )}
            </View>
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
  modalContainer: {
    width: getResponsiveSize(312),
    borderRadius: 12,
    paddingVertical: getResponsiveSize(24),
    paddingHorizontal: getResponsiveSize(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonBox: {
    flexDirection: "row",
    marginTop: getResponsiveSize(24),
    gap: getResponsiveSize(16),
  },
});
