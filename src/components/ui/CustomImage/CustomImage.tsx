import { useEffect, useState } from "react";
import { Image, ImageSourcePropType, View } from "react-native";
import { getResponsiveSize } from "@/utils";

interface Props {
  uri?: string;
  source?: ImageSourcePropType;
  width: number;
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
}

export const CustomImage = ({
  uri,
  source,
  width,
  marginTop = 0,
  marginBottom = 0,
  marginRight = 0,
  marginLeft = 0,
}: Props) => {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (uri) {
      Image.getSize(uri, (originalWidth, originalHeight) => {
        const ratio = originalHeight / originalWidth;
        setHeight(width * ratio);
      });
    } else if (source) {
      let resolvedSource: { width: number; height: number } | null = null;

      if (typeof source === "number") {
        resolvedSource = Image.resolveAssetSource(source);
      } else if ("uri" in source && source.uri) {
        resolvedSource = { width: 1, height: 1 };
      }

      if (resolvedSource) {
        const ratio = resolvedSource.height / resolvedSource.width;
        setHeight(width * ratio);
      } else {
        setHeight(width);
      }
    } else {
      setHeight(width);
    }
  }, [uri, source, width]);

  if (!height) return <View style={{ width, aspectRatio: 1 }} />;

  return (
    <Image
      source={uri ? { uri } : source!}
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
