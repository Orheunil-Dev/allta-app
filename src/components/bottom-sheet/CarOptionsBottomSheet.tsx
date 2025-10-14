import { Image, Pressable, StyleSheet, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { carIcon, deleteIcon, editIcon } from "@/assets/images";
import { useCarControllerDeleteCar } from "@/api/car/car";
import { useToastMessage } from "@/hooks";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";
import { useQueryClient } from "@tanstack/react-query";
import { CustomModal } from "../ui/CustomModal";
import { useState } from "react";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  id?: string;
  onClose: () => void;
}

export const CarOptionsBottomSheet = ({ ref, id, onClose }: Props) => {
  const queryClient = useQueryClient();

  const setErrorModal = useSetAtom(errorModalAtom);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const { SuccessToast } = useToastMessage();

  // 차량 삭제 API
  const {
    mutate: deleteCar,
    isPending: deleteCarLoading,
    isError: deleteCarError,
  } = useCarControllerDeleteCar();

  const handleDeleteCar = () => {
    if (!id) return;

    deleteCar(
      { data: { id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cars"] });
          setShowDeleteModal(false);
          onClose();
          SuccessToast("차량이 삭제되었습니다.");
        },
        onError: (error: any) => {
          setShowDeleteModal(false);
          onClose();
          setErrorModal({
            visible: true,
            message: error?.message ?? "차량 삭제 중 오류가 발생했습니다.",
          });
        },
      }
    );
  };

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(240)}
      onClose={onClose}
    >
      <CustomModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        closeButtonText="취소"
        onNext={handleDeleteCar}
        nextButtonText="확인"
        isNextButtonDisable={deleteCarLoading}
      >
        <CustomText marginTop={12} fontSize={18} fontWeight={"600"}>
          선택한 차량을 삭제하시겠습니까?
        </CustomText>
      </CustomModal>

      <View style={styles.container}>
        <Pressable style={styles.button}>
          <Image source={carIcon} style={styles.icon} />
          <CustomText marginLeft={12} fontSize={18}>
            대표 차량으로 설정하기
          </CustomText>
        </Pressable>

        <Pressable style={styles.button}>
          <Image source={editIcon} style={styles.icon} />
          <CustomText marginLeft={12} fontSize={18}>
            수정하기
          </CustomText>
        </Pressable>

        <Pressable
          onPress={() => setShowDeleteModal(true)}
          disabled={deleteCarLoading}
          style={styles.button}
        >
          <Image source={deleteIcon} style={styles.icon} />
          <CustomText marginLeft={12} fontSize={18}>
            삭제하기
          </CustomText>
        </Pressable>
      </View>
    </CustomBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: getResponsiveSize(12),
  },
  button: {
    flexDirection: "row",
    paddingVertical: getResponsiveSize(16),
  },
  icon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
});
