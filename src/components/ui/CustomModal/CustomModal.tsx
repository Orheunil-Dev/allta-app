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

interface CustomModalProps {
  visible: boolean;
  onNext?: () => void;
  nextButtonText?: string;
  onClose: () => void;
  closeButtonText?: string;
  children: React.ReactNode;
}

export const CustomModal = ({
  visible,
  onNext,
  nextButtonText,
  onClose,
  closeButtonText,
  children,
}: CustomModalProps) => {
  return (
    <Modal transparent={true} visible={visible} statusBarTranslucent>
      <Pressable onPress={onClose} style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modalContainer}>
            {children}

            <View style={styles.buttonBox}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <CustomText fontSize={15} fontWeight="500" color={colors.black}>
                  {closeButtonText ?? "확인"}
                </CustomText>
              </Pressable>

              {onNext && (
                <Pressable onPress={onNext} style={styles.nextButton}>
                  <CustomText fontSize={15} fontWeight="500" color="#fff">
                    {nextButtonText ?? "확인"}
                  </CustomText>
                </Pressable>
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
  buttonBox: {
    flexDirection: "row",
    marginTop: getResponsiveSize(32),
  },
  nextButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: getResponsiveSize(15),
    marginLeft: getResponsiveSize(16),
    backgroundColor: colors.main,
    borderRadius: 8,
  },
  closeButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: getResponsiveSize(15),
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
  },
});
