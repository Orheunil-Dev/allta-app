import { RefObject, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  TouchableWithoutFeedback,
} from "@gorhom/bottom-sheet";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { colors } from "@/styles";
import { CustomText } from "../CustomText";
import { getResponsiveSize } from "@/utils";
import { closeIcon } from "@/assets/images";

interface Props {
  bottomSheetRef: RefObject<BottomSheetModal | null>;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const CustomBottomSheet = ({
  bottomSheetRef,
  title,
  onClose,
  children,
}: Props) => {
  const snapPoints = useMemo(() => ["60%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      enableHandlePanningGesture={false}
      handleComponent={() => null}
      backdropComponent={renderBackdrop}
      backgroundComponent={() => <View />}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.empty} />

          <CustomText fontSize={18} fontWeight={"600"}>
            {title}
          </CustomText>
          <Pressable onPress={onClose}>
            <Image
              source={closeIcon}
              style={{
                width: getResponsiveSize(24),
                height: getResponsiveSize(24),
              }}
            />
          </Pressable>
        </View>

        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
    paddingHorizontal: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(40),
    backgroundColor: colors.white,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: getResponsiveSize(12),
    width: "100%",
  },
  empty: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
});
