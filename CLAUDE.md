# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

올타(allta) 사용자용 세차 이용권 앱. Expo SDK 54 / React Native 0.81 / React 19, New Architecture 활성화, `expo-dev-client` 기반.
README는 `create-expo-app` 템플릿 그대로라 "file-based routing" 설명이 실제와 다르다. 실제 진입점은 `App.tsx`이고 라우팅은 React Navigation이다.

## 자주 쓰는 명령

```bash
npm install
npm start              # Metro (expo start)
npm run ios            # expo run:ios (네이티브 빌드 + 실행)
npm run android        # expo run:android
npm run lint           # expo lint (eslint-config-expo flat config)
npx tsc --noEmit       # 타입체크 (strict)
npx eslint <file>      # 단일 파일 lint
npm run prebuild       # expo prebuild --clean → ios/, android/ 재생성
npx orval              # API 클라이언트 재생성 (아래 참고)
```

테스트 스위트는 없다. 검증은 `tsc` + `eslint`로 한다.

### 네이티브 폴더는 생성물이다

`ios/`, `android/`는 gitignore 되어 있다(CNG 방식). 네이티브 설정은 `app.config.ts`와 `plugins/withAndroidManifestFix.js`에서만 바꾸고 `npm run prebuild`로 반영한다. `ios/`, `android/`를 직접 수정하지 않는다.

### iOS 시뮬레이터 실행이 서명 오류로 막힐 때

`app.entitlements`에 Apple 로그인·Associated Domains가 있어서 Expo CLI는 시뮬레이터 빌드에도 코드사이닝 인증서를 요구한다. 키체인에 개발용 인증서가 없는 Mac에서는 `expo run:ios`가 `No code signing certificates are available` 으로 실패한다. 이때는 서명 없이 xcodebuild로 빌드한 뒤 `--binary`로 설치한다.

```bash
# xcode-select가 CommandLineTools를 가리키면 필요
export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer

cd ios && xcodebuild -workspace app.xcworkspace -scheme app -configuration Debug \
  -destination "id=<시뮬레이터 UDID>" -derivedDataPath build \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY="" build
cd .. && npx expo run:ios --binary ios/build/Build/Products/Debug-iphonesimulator/app.app
```

`--device <UDID>`는 넘기지 않는다. Xcode 26에서 Expo가 devicectl 출력을 잘못 읽어 실기기로 취급한다.

### 환경 변수

- `EXPO_PUBLIC_*` 변수만 사용하며 `.env`(gitignore)에서 읽는다. `app.config.ts`가 `dotenv/config`로 로드한다.
- `.env.dev`, `.env.prod`는 커밋된 환경별 원본이다. 전환은 원하는 파일을 `.env`로 복사한다. `.env.example`에 키 목록이 있다.
- EAS 빌드 프로필(`eas.json`)은 development / preview / production 세 개이며 `credentialsSource: remote`다.

## 아키텍처

### 네비게이션 (`src/navigations/`)

- `ContainerStack`이 루트 native stack이다. `BottomTab`(홈 / 내 매장 / QR 스캔 / 내 정보)과 기능별 스택(`StoreStack`, `PaymentStack`, `QrScanStack` 등)을 모두 여기에 등록한다.
- 각 스택 파일이 자신의 `XxxStackParamList`를 export하고 `@/navigations` 배럴로 모은다. 화면 간 이동은 `useNavigation<NativeStackNavigationProp<ContainerStackParamList>>()`로 상위 스택을 잡은 뒤 `navigate("StoreStack", { screen, params })` 형태로 한다.
- 최초 진입 화면은 MMKV의 `IS_GET_PERMISSION` 플래그로 결정한다. 없으면 `IntroStack`(권한 온보딩), 있으면 `BottomTab`.
- 딥링크 스킴은 `allta-user://`, 경로 매핑은 `ContainerStack`의 `linking` 객체에 있다. 푸시 알림의 `data.url`도 같은 경로로 열린다.
- 전역 모달(`LoginModal`, `CommonModal`, `ErrorModal`)은 `ContainerStack`에 한 번만 마운트되어 있고 jotai atom으로 연다.

### API 계층 (`src/api/`, `src/libs/custom-instance.ts`)

- `src/api/**`는 orval이 백엔드 Swagger(`http://localhost:3000/api-json`)에서 생성한 코드다. **직접 수정하지 않는다.** 스키마가 바뀌면 백엔드를 띄운 상태에서 `npx orval`을 실행한다(`clean: true`라 폴더가 통째로 재생성된다).
- 생성된 훅은 `use<Controller><Method>` 이름의 React Query 훅이며(예: `useStoreControllerGetMyStoreList`), 모델 타입은 `src/api/models`에 있다.
- 모든 요청은 `customInstance`(axios)를 거친다. 여기서 하는 일:
  - 요청마다 SecureStore의 accessToken / refreshToken을 쿠키로 동기화한다(서버는 쿠키 인증).
  - 401이면 `auth/token/refresh`를 한 번 호출해 토큰을 갱신하고 원 요청을 재시도한다.
  - 실패는 `CustomError { message, status, code }`로 정규화해 throw한다. 서버 메시지가 `message`에 담기므로 화면에서는 `error.message`를 그대로 보여준다.
  - 갱신 실패 시 `code: "TOKEN_REFRESH_FAILED"`가 올라오고, `App.tsx`의 `QueryCache.onError`가 토큰 삭제 + `Airbridge.clearUser()` + 로그인 모달 표시를 처리한다.

### 상태와 저장소

- 서버 상태: React Query (전역 `retry: 0`).
- 전역 UI 상태: `src/jotai/atoms.ts`의 소수 atom만 사용한다(`errorModalAtom`, `commonModalAtom`, `popupAtom`).
- 영속 플래그: MMKV (`src/libs/mmkv-storage.ts`), 키는 `src/constants/key.ts`에 상수로 둔다.
- 토큰: `expo-secure-store`의 `accessToken`, `refreshToken`.

### 앱 부팅 흐름 (`App.tsx`)

스플래시(최소 1.5초) → 스토어 버전 확인(`react-native-store-version`) → 새 버전이면 업데이트 안내, 아니면 `expo-updates`로 OTA 확인·적용 후 reload. 이 흐름을 건드리면 `Splash` 화면의 `showUpdate` / `isVersionUpdate` / `isUpdateFinished` 상태도 함께 본다. OTA는 `runtimeVersion.policy: appVersion`이라 네이티브 변경 시 앱 버전을 올려야 한다.

### 다국어 (`src/i18n/`)

- i18next + react-i18next + expo-localization. 기본 언어는 대만 번체(`zh-TW`), 기기 언어가 한국어일 때만 `ko`. `App.tsx` 첫 줄의 `import "@/i18n"`이 초기화하고 dayjs 로케일도 함께 맞춘다.
- 리소스는 `src/i18n/locales/{ko,zh-TW}/<namespace>.json`. 네임스페이스는 도메인 단위(common, nav, home, auth, address, store, pass, format, payment, benefit, scan, car, mypage)이며 두 언어의 키 트리는 항상 동일해야 한다. 새 네임스페이스를 추가하면 양쪽 `locales/*/index.ts`에 등록한다.
- 컴포넌트에서는 `const { t } = useTranslation("<ns>")`, 다른 네임스페이스는 `t("common:confirm")`. 컴포넌트 밖(utils, constants, axios 인터셉터)에서는 `import i18n from "@/i18n"; i18n.t("<ns>:key")`. 모듈 최상위에서 `t()`를 호출한 상수를 만들지 않는다(초기화 전 실행). 함수로 감싸거나 렌더 시점에 번역한다.
- 사용자에게 보이는 문자열을 코드에 하드코딩하지 않는다. 서버 응답과 비교하는 문자열(OCR 키워드, 날씨 텍스트, enum 값)은 번역 대상이 아니다.
- 약관·FAQ 같은 긴 콘텐츠는 JSON이 아니라 언어별 TS 모듈로 둔다: `src/constants/terms/{ko,zh-TW}/`, `src/constants/faq/{ko,zh-TW}.ts`. 화면에서는 `getTerms()`, `getPaymentTerms()`, `getFaqs()`로 현재 언어의 것을 가져온다. 두 언어의 항목 수·순서·HTML 구조를 항상 동일하게 유지한다(약관 상세는 index로 조회).
- 서버가 내려주는 오류 메시지는 `src/libs/server-message.ts`의 매핑으로 앱 언어로 치환된다. 서버에 새 메시지가 생기면 여기와 `server.json`에 함께 추가한다. 요청에는 `Accept-Language` 헤더가 실리므로 서버 측 로컬라이즈가 준비되면 매핑을 걷어낼 수 있다.
- 번역 용어는 기존 JSON의 표기를 따른다(自動洗車, 使用券, 門市, 優惠券, 登入, 設定 등). 브랜드명 "올타"는 중국어 문장에서 "Allta"로 쓴다.

### UI 컨벤션

- 텍스트는 `CustomText`를 쓴다. `style` 대신 `fontSize`, `fontWeight`, `color`, `marginTop` 같은 prop을 받고, 내부에서 Pretendard 폰트 매핑과 반응형 크기를 적용한다.
- 모든 px 값은 375px 디자인 기준의 `getResponsiveSize(px)`로 감싼다. 폰트는 `getFontSize`. 색상은 `@/styles`의 `colors`.
- 스택 헤더는 `CustomHeader`, 화면 루트는 `CustomSafeAreaView`.
- 폴더 구조: `screens/<기능>/<화면>.tsx` + `index.ts` 배럴, `components/<도메인>/`. 경로 별칭 `@/` → `src/`.
- 스타일은 파일 하단 `StyleSheet.create`. 코드 주석은 한국어, UI 문구는 i18n 키.

### 외부 SDK

- 로그인: Kakao(`@react-native-kakao/*`), Apple(`expo-apple-authentication`), Google(`expo-auth-session`).
- 분석/어트리뷰션: Airbridge. 로그인·회원가입 시 `setUserID` 등으로 식별하고 로그아웃·토큰 만료 시 반드시 `Airbridge.clearUser()`를 호출한다.
- 푸시: `expo-notifications`. 시뮬레이터에서는 토큰 발급이 안 된다.
- `cert/`에는 Firebase 설정 파일과 Play 서비스 계정 키가 있다.

## Git

- Conventional Commits, 제목은 한국어 (`feat: 로그인 이벤트 트래킹 설정`).
- 작업은 `develop`(또는 기능 브랜치)에서 하고 PR로 `master`에 머지한다. `master`에 직접 커밋하지 않는다.
