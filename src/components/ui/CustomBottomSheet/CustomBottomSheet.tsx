import { RefObject, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { colors } from "@/styles";
import { CustomText } from "../CustomText";
import { getResponsiveSize } from "@/utils";
import { closeIcon } from "@/assets/images";

interface Props {
  ref: RefObject<BottomSheetModal | null>;
  height?: string | number;
  title?: string;
  hasCloseButton?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const CustomBottomSheet = ({
  ref,
  height = "60%",
  title,
  hasCloseButton,
  onClose,
  children,
}: Props) => {
  const snapPoints = useMemo(() => [height], [height]);

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
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      enableHandlePanningGesture={false}
      handleComponent={() => null}
      backdropComponent={renderBackdrop}
      backgroundComponent={() => <View />}
    >
      <BottomSheetView style={styles.container}>
        {hasCloseButton ? (
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
        ) : (
          <View style={styles.header}>
            <CustomText fontSize={18} fontWeight={"600"}>
              {title}
            </CustomText>

            <View style={styles.empty} />
          </View>
        )}

        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
    paddingTop: getResponsiveSize(10),
    paddingBottom: getResponsiveSize(40),
    paddingHorizontal: getResponsiveSize(20),
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
