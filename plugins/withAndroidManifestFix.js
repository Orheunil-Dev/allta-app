// plugins/withAndroidManifestFix.js (수정된 코드)

const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * AndroidManifest.xml의 <manifest> 태그에 tools 네임스페이스를,
 * <application> 태그에 tools:replace 속성을 추가합니다.
 * @param {import("@expo/config").ExpoConfig} config
 * @returns {import("@expo/config").ExpoConfig}
 */
function withAndroidManifestFix(config) {
  return withAndroidManifest(config, (config) => {
    // ⭐️ modResults.manifest 객체가 존재하는지 먼저 확인
    if (!config.modResults.manifest) {
      console.warn("Manifest object not found in modResults.");
      return config;
    }

    const manifestTag = config.modResults.manifest.manifest?.[0];

    // ⭐️ <manifest> 태그와 속성 객체가 존재하는지 확인
    if (manifestTag) {
      manifestTag.$ = {
        ...manifestTag.$,
        // <manifest> 태그에 xmlns:tools="http://schemas.android.com/tools" 추가
        "xmlns:tools": "http://schemas.android.com/tools",
      };
    } else {
      console.warn("Manifest tag not found in manifest object.");
    }

    const application = config.modResults.manifest.application?.[0];

    if (application) {
      // application.$ 객체가 없는 경우를 대비하여 초기화
      application.$ = application.$ || {};

      application.$.hasOwnProperty("tools:replace")
        ? // 이미 tools:replace 속성이 있다면 값 추가
          (application.$[
            "tools:replace"
          ] = `${application.$["tools:replace"]},android:fullBackupContent,android:dataExtractionRules`)
        : // 없다면 새로 추가
          (application.$["tools:replace"] =
            "android:fullBackupContent,android:dataExtractionRules");
    } else {
      console.warn("Application tag not found in manifest object.");
    }

    return config;
  });
}

module.exports = withAndroidManifestFix;
