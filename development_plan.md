# [개발 계획서] 취업 타이쿤: 인생은 확률이다 Web App

## 1. 개요 (Overview)
*   **프로젝트**: 취업 타이쿤 (인생 경영 시뮬레이션)
*   **개발 방식**: AI Agent (Antigravity) 전담 개발 (No-Code Experience for User)
*   **디자인**: Figma Make 활용 (유저 제공) -> AI가 코드화
*   **핵심 도구**:
    *   **Frontend**: React (Vite), Tailwind CSS
    *   **Backend/DB**: Supabase (Database, Auth)
    *   **Deploy**: Vercel (추천 - Supabase와 연동 용이)

---

## 2. 기술 스택 (Tech Stack)
*   **Framework**: React 18+ (Vite)
    *   빠르고 가벼운 웹 앱 구축을 위해 선택.
*   **Language**: JavaScript / TypeScript (안정성을 위해 TS 권장하지만, 빠른 속도를 위해 JS로 진행 가능. AI는 TS도 능숙함)
*   **Styling**: Tailwind CSS
    *   Figma 디자인을 빠르게 CSS로 변환하기 좋음.
    *   Pixel Art 느낌을 내기 위한 커스텀 폰트 및 설정 용이.
*   **State Management**: Zustand
    *   게임 내 수많은 변수(체력, 스트레스, 자산 등)를 전역에서 관리하기 가장 심플하고 강력함.
*   **Database**: Supabase (PostgreSQL)
    *   유저 데이터(자산, 랭킹, 세이브 파일) 저장.
    *   실시간 리더보드 구현에 유리 (Realtime Subscription).

---

## 3. 단계별 개발 로드맵 (Development Roadmap)

### Phase 1: 프로젝트 세팅 및 기반 마련 (Setup)
**목표**: 개발 환경 구축 및 데이터베이스 연결
1.  **초기 세팅**:
    *   Vite 프로젝트 생성 (React).
    *   Tailwind CSS 설치 및 초기 설정.
    *   필요한 라이브러리 설치 (`zustand`, `supabase-js`, `react-router-dom` 등).
2.  **Supabase 연동**:
    *   Supabase 프로젝트 생성 (유저가 생성 후 Key 제공).
    *   Antigravity가 환경변수(`.env`) 설정.
    *   Client 초기화 코드 작성.

### Phase 2: 데이터베이스 설계 (Database Schema)
**목표**: 게임 데이터를 저장할 구조 설계
1.  **Tables 설계**:
    *   `users`: 유저 정보, 아이디, 최고 기록 등.
    *   `game_saves`: 현재 진행 중인 게임 상태 (나이, 스탯, 자산 등) JSON 형태로 저장.
    *   `hall_of_wealth`: 랭킹 보드용 테이블.
2.  **Table 생성**: AI가 SQL 쿼리 작성 -> Supabase SQL Editor에서 실행.

### Phase 3: 핵심 게임 로직 구현 (Core Logic)
**목표**: 디자인 없이 기능(숫자, 로직)만 먼저 동작하게 만들기
1.  **상태 관리 (Store)**:
    *   플레이어 스탯(지능, 체력 등) 및 자원(파워, 돈) 구조 정의.
    *   시간 시스템(주/월 흐름) 로직 구현.
2.  **액션 함수 구현**:
    *   `doAction('study')` -> 지능 상승, 파워 감소, 스트레스 증가 로직.
    *   확률 계산 함수 (`Math.random()` 기반 성공/실패 판정).

### Phase 4: UI 디자인 적용 (Design Implementation)
**목표**: Figma Make 결과물을 코드로 변환하여 게임의 모습을 갖추기
1.  **디자인 시스템 구축**:
    *   Color Palette, Fonts(레트로 픽셀 폰트) 설정.
    *   공통 컴포넌트 개발 (Button, ProgressBar, Card).
2.  **화면 구성**:
    *   **메인 화면**: 상단 정보바, 중앙 캐릭터, 하단 액션 패널.
    *   **이벤트 팝업**: 텍스트 및 선택지 UI.
    *   **주식 시장**: 그래프 및 매수/매도 UI.
3.  **애니메이션**:
    *   CSS Keyframes를 활용한 도트 움직임, 간단한 이펙트 추가.

### Phase 5: 컨텐츠 확장 및 연동 (Expansion)
1.  **직업 및 승진 시스템**:
    *   직업별 연봉 테이블 적용.
    *   승진/이직 확률 로직 연동.
2.  **이벤트 시스템**:
    *   랜덤 이벤트 DB화 또는 코드 하드코딩.
    *   조건부 트리거(나이, 스탯) 구현.
3.  **저장 및 불러오기**:
    *   게임 종료/중단 시 Supabase에 상태 저장.
    *   접속 시 불러오기.

### Phase 6: 마무리 및 배포 (Polish & Deploy)
1.  **밸런싱 테스트**: AI와 함께 시뮬레이션 돌려보며 수치 조정.
2.  **버그 수정**: 엣지 케이스(파산 등) 처리.
3.  **배포**: Vercel을 통해 웹에 공개.

---

## 4. 협업 프로세스 (Collaboration Workflow)
유저(PM/Designer)와 AI(Developer)의 소통 방식

1.  **유저**: Figma에서 디자인한 화면 캡처 또는 설명 제공.
    *   *"메인 화면 하단에 4개의 버튼이 있고, 누르면 이런 팝업이 떠야 해."*
2.  **AI**: 기능을 구현하고 코드를 작성.
    *   *"버튼 컴포넌트를 만들었고, 클릭 이벤트를 연결했습니다. 현재는 디자인이 입혀지지 않은 상태입니다."*
3.  **유저**: 피드백 및 수정 요청.
    *   *"버튼 색상을 Figma에 있는 #FF0000으로 바꿔줘."*
4.  **AI**: 수정 사항 반영 및 배포.

---

## 5. 지금 바로 시작해야 할 일 (Next Steps)
1.  **프로젝트 생성**: `npm create vite@latest` 명령어로 프로젝트 폴더 생성.
2.  **Supabase 가입**: 유저가 Supabase 가입 후 Project 생성, `SUPABASE_URL`과 `SUPABASE_ANON_KEY` 발급 필요.
