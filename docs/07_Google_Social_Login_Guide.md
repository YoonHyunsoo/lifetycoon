# 🔐 구글 소셜 로그인 설정 가이드 (Google Social Login Setup)

Mudspoon Tycoon의 구글 로그인을 활성화하기 위한 **Google Cloud Platform (GCP)**과 **Supabase** 설정 방법입니다.
차근차근 따라와 주세요!

---

## 1단계: Supabase에서 Redirect URL 확인하기
가장 먼저, 구글에게 "로그인 끝나면 여기로 돌려보내줘"라고 말할 주소(URL)를 알아야 합니다.

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인합니다.
2. 프로젝트를 선택하고, 왼쪽 메뉴에서 **Authentication** 아이콘(사람 모양)을 클릭합니다.
3. **Providers** 메뉴를 클릭합니다.
4. **Google**을 찾아 클릭(전개)합니다.
5. 맨 위에 있는 **`Callback URL (for OAuth)`** 주소를 **복사**해둡니다.
   - 예시: `https://ggrwhlautxsrglzyeyyo.supabase.co/auth/v1/callback`

---

## 2단계: Google Cloud Platform (GCP) 설정하기
구글에게 "내 앱이 소셜 로그인을 쓸 거야"라고 신고하고, 비밀번호(Client ID)를 받는 과정입니다.

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
2. 왼쪽 상단 로고 옆의 **프로젝트 선택**을 누르고 **[새 프로젝트]**를 클릭합니다.
   - 프로젝트 이름: `Mudspoon Tycoon` (원하는 대로)
   - [만들기] 클릭 후, 잠시 기다렸다가 해당 프로젝트를 선택합니다.

### 2-1. OAuth 동의 화면 만들기 (OAuth Consent Screen)
1. 왼쪽 메뉴(햄버거 버튼)에서 **API 및 서비스 > OAuth 동의 화면**을 클릭합니다.
2. **User Type**을 **[외부 (External)]**로 선택하고 [만들기]를 누릅니다. (내부 테스트용이 아니므로)
3. **앱 정보 입력**:
   - **앱 이름**: `Mudspoon Tycoon`
   - **사용자 지원 이메일**: 본인 이메일 선택
   - **개발자 연락처 정보**: 본인 이메일 입력
   - 나머지는 비워도 됩니다. -> **[저장 후 계속]**
4. **범위(Scopes)**:
   - 건드릴 필요 없습니다. -> **[저장 후 계속]**
5. **테스트 사용자**:
   - 지금은 건너뛰어도 됩니다. -> **[저장 후 계속]** -> **[대시보드로 돌아가기]**

### 2-2. 사용자 인증 정보 만들기 (Create Credentials)
1. 왼쪽 메뉴에서 **[사용자 인증 정보 (Credentials)]**를 클릭합니다.
2. 상단의 **[+ 사용자 인증 정보 만들기]** -> **[OAuth 클라이언트 ID]**를 선택합니다.
3. **애플리케이션 유형**: **`웹 애플리케이션`** 선택.
4. **이름**: `Mudspoon Web Client` (아무거나 상관없음).
5. **승인된 리디렉션 URI (Authorized redirect URIs)**:
   - **[+ URI 추가]**를 누르고, **1단계에서 복사한 Supabase Callback URL**을 붙여넣습니다.
   - 예: `https://ggrwhlautxsrglzyeyyo.supabase.co/auth/v1/callback`
6. **[만들기]** 버튼 클릭.
7. 팝업이 뜨면서 **`클라이언트 ID`**와 **`클라이언트 보안 비밀(Secret)`**이 나옵니다.
   - 이 두 값을 메모장에 복사해두세요! (절대 남에게 보여주면 안 됩니다 🤫)

---

## 3단계: Supabase에 키 입력하기
이제 구글에서 받은 비밀번호를 Supabase에 알려줄 차례입니다.

1. 다시 [Supabase Dashboard](https://supabase.com/dashboard) > Authentication > Providers > **Google**로 돌아옵니다.
2. 아까 복사해둔 값을 입력합니다:
   - **Client ID** -> `Client ID` 칸에 붙여넣기
   - **Client Secret** -> `Client Secret` 칸에 붙여넣기
3. **Enable Sign in with Google** 토글을 켜서 활성화합니다.
4. **[Save]** 버튼을 누릅니다.

---

## 🎉 설정 완료!
이제 로컬(`localhost:5173`) 또는 배포된 사이트(`mudspoon.app`)에서 **"LOGIN WITH GOOGLE"** 버튼을 누르면:
1. 구글 로그인 창이 뜨고,
2. 계정을 선택하면,
3. 다시 게임으로 돌아와서 "✅ Logged In" 상태가 될 것입니다.

해보시고 안 되면 말씀해주세요! 🚀
