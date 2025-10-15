import { Image, Pressable, StyleSheet, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { deleteIcon } from "@/assets/images";
import { useCarControllerDeleteCar } from "@/api/car/car";
import { useToastMessage } from "@/hooks";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";
import { useQueryClient } from "@tanstack/react-query";
import { CustomModal } from "../ui/CustomModal";
import { useState } from "react";
import { useAddressControllerDeleteAddress } from "@/api/address/address";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  id?: string;
  onClose: () => void;
}

export const AddressOptionsBottomSheet = ({ ref, id, onClose }: Props) => {
  const queryClient = useQueryClient();

  const setErrorModal = useSetAtom(errorModalAtom);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const { SuccessToast, ErrorToast } = useToastMessage();

  // 주소 삭제 API
  const {
    mutate: deleteAddress,
    isPending: deleteAddressLoading,
    isError: deleteAddressError,
  } = useAddressControllerDeleteAddress();

  // 주소 삭제
  const handleDeleteAddress = () => {
    if (!id) return;

    deleteAddress(
      { data: { id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["addresses"] });
          setShowDeleteModal(false);
          onClose();
          SuccessToast("주소가 삭제되었습니다.");
        },
        onError: (error: any) => {
          setShowDeleteModal(false);
          onClose();
          setErrorModal({
            visible: true,
            message: error?.message ?? "주소 삭제 중 오류가 발생했습니다.",
          });
        },
      }
    );
  };

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(140)}
      onClose={onClose}
    >
      <CustomModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        closeButtonText="취소"
        onNext={handleDeleteAddress}
        nextButtonText="확인"
        isNextButtonDisable={deleteAddressLoading}
      >
        <CustomText marginTop={12} fontSize={18} fontWeight={"600"}>
          선택한 주소를 삭제하시겠습니까?
        </CustomText>
      </CustomModal>

      <View style={styles.container}>
        <Pressable
          onPress={() => setShowDeleteModal(true)}
          disabled={deleteAddressLoading}
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
