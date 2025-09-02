import { Dimensions, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { getResponsiveSize } from "@/utils";

interface Props {
  lat: number;
  lng: number;
}

const { width: screenWidth } = Dimensions.get("window");

export const KakaoMap = ({ lat, lng }: Props) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY}&libraries=services"></script>
        <style>
          body { margin: 0; padding: 0; height: 100%; }
          html { height: 100%; }
          #map { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          window.onload = function() {
            if (typeof kakao !== 'undefined' && kakao.maps) {
              const mapContainer = document.getElementById('map');

              const mapOption = {
                center: new kakao.maps.LatLng(${lat}, ${lng}),
                level: 3
              };

              const map = new kakao.maps.Map(mapContainer, mapOption);

              // 마커 추가 (선택 사항)
              const markerPosition = new kakao.maps.LatLng(${lat}, ${lng});

              const marker = new kakao.maps.Marker({
                position: markerPosition
              });

              marker.setMap(map);
            };
          };
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth - getResponsiveSize(40),
    height: screenWidth - getResponsiveSize(40),
  },
  webview: {
    flex: 1,
  },
});
