import { getResponsiveSize } from "@/utils";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

interface Props {
  uri: string;
  width: number;
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
}

export const CustomImage = ({
  uri,
  width,
  marginTop = 0,
  marginBottom = 0,
  marginRight = 0,
  marginLeft = 0,
}: Props) => {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (!uri) return;

    Image.getSize(uri, (originalWidth, originalHeight) => {
      const ratio = originalHeight / originalWidth;
      setHeight(width * ratio);
    });
  }, [uri, width]);

  if (!height) return <View style={{ width, aspectRatio: 1 }} />;

  return (
    <Image
      source={{ uri }}
      style={{
        width,
        height,
        marginTop: getResponsiveSize(marginTop),
        marginBottom: getResponsiveSize(marginBottom),
        marginRight: getResponsiveSize(marginRight),
        marginLeft: getResponsiveSize(marginLeft),
      }}
      resizeMode="cover"
    />
  );
};
