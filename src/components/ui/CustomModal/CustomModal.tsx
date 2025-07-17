import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { CustomText } from "../CustomText";

interface CustomModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export const CustomModal = ({
  visible,
  onClose,
  message,
}: CustomModalProps) => {
  return (
    <Modal transparent={true} visible={visible}>
      <Pressable onPress={onClose} style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modalContainer}>
            <CustomText fontSize={18} fontWeight="600">
              {message}
            </CustomText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <CustomText fontSize={16} fontWeight="500" color="#fff">
                확인
              </CustomText>
            </Pressable>
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
    width: 280,
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
  closeButton: {
    marginTop: 24,
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
