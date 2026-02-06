# 🛠️ 개발 로그 및 계획 (Dev Log & Plan)

## 📆 최신 업데이트 (2026-02-01) - 버그 수정 및 안정화

### 1. 🚨 치명적 오류 수정 (Critical Fixes)
*   **순환 참조(Circular Dependency) 해결**:
    *   `gameStore.ts`와 `eventLogic.ts`가 서로 `GameState` 타입을 참조하며 `undefined` 오류 발생.
    *   **조치**: `types/gameTypes.ts`를 신설하여 타입 정의를 분리함으로써 의존성 고리 끊음.
*   **초기화 충돌 방지**:
    *   `MainGameScreen` 및 `GameHUD` 진입 시 `store`가 로드되기 전에 접근하여 발생하던 'Cannot destructure property' 오류 수정.
    *   `useEffect` 내외에 null check 가드 코드 추가.
*   **UI 레이아웃 복구**:
    *   화면이 잘리거나 레이아웃이 깨지던 문제 수정 (`max-w-md` 모바일 프레임 복구).

### 2. 🎮 게임플레이 상호작용 개선 (UX Improvements)
*   **이벤트 팝업 먹통 수정**:
    *   `EventPopup` 컴포넌트에 `currentEvent` 데이터를 넘겨주지 않아 빈 껍데기만 출력되던 버그 수정.
    *   이제 튜토리얼 및 이벤트 팝업이 정상적으로 내용(텍스트, 버튼)을 표시함.
*   **일시정지(Pause) 로직 재정립**:
    *   기존: Pause 상태에서도 행동 가능 (버그성).
    *   **변경**: Pause 상태(`⏯️`)에서는 모든 행동(공부, 운동 등) 버튼이 비활성화되며 경고 메시지 출력.
*   **게임 속도 밸런싱**:
    *   기존 1초/1주 → **4초/1주**로 변경하여 게임의 호흡을 여유롭게 조정.

### 3. ⚖️ 밸런스 및 규칙 변경 (Mechanics Tuning)
*   **시작 시점 변경**: `2024년 3월` → **`1년 1월 1주차`**로 리셋. (초기 진입장벽 완화)
*   **휴식(Rest) 효율 상향**: 스트레스 감소량 **-5** → **-10**.
*   **친구 이벤트 조정**:
    *   주간 발생 확률: **5%** (검증 완료).
    *   **확정 이벤트 시점 이동**: `1월 2주` → **`3월 2주`** (초반 2달간의 적응기 부여).


### 4. 📉 배포 이슈 및 해결 (Deployment Issues)
*   **증상**: 로컬 환경(Localhost)에서는 정상이나, Vercel 배포 시 "NEW GAME" 등의 버튼이 작동하지 않거나 과거 버전 상태임.
*   **원인**: `gameTypes.ts` 등 신규 생성 파일 및 최신 수정 사항이 **Github에 Commit되지 않음**.
    *   (사용자의 `force_push.bat`에 `git add/commit` 과정이 누락되어 있었음)
*   **해결책**: `force_push.bat` 스크립트를 수정하여 `git add .` 및 `git commit` 프로세스 추가. (다음 세션에서 실행 예정)

---

## 🚦 프로젝트 현황 (Project Status) - 2026-02-06 기준
**현재 상태: 개발 진행 중 (Phase 5: 로컬라이징 및 디테일)**

### ✅ 완료된 주요 기능
- **핵심 게임 루프**: 시작 -> 활동 -> 턴 진행 -> 결과
- **이벤트 시스템**: 랜덤 이벤트 및 선택지 로직
- **UI/UX**: 메인 HUD, 팝업, 튜토리얼 (모바일 프레임)
- **버그 수정**: 순환 참조 및 초기화 충돌 해결

### ⚠️ 현재 이슈
- **배포 (Deployment)**: Vercel 배포 버전이 최신 코드를 반영하지 못하는 문제.
- **언어**: 한국어/영어 토글 기능 개발 필요.


---

## 🚀 향후 개발 계획 (To-Do List)

### 🚨 긴급 수정 (Next Priority)
- [x] **배포 정상화 (Deployment Fix)**: TypeScript 빌드 오류 전체 수정 완료 (`npm run build` 성공).
    *   `eventLogic.ts`의 타입 정의 오류 해결.
    *   이벤트 시스템의 확장성 확보 (Pink/Blue/Yellow 테마 적용).

---

## 📅 단기 개발 계획 (Short-Term Plan) - 2026-02-06 수립
**목표**: 배포 걱정 없이, 로컬 환경(Localhost)에서 게임의 재미와 완성도(Fun & Polish)를 끌어올리기.

### ✅ Completed
- **Phase 1: Localhost Activation**
  - [x] Fix TypeScript Build Errors (Clean `npm run build`)
  - [x] Enhance Character Creation (Dice Animation)
    - 4 Dice Layout (Int, Sta, Sen, Luck)
    - Comic Stat Descriptions added
    - "God's Dice" Visuals implemented
- **Phase 2: Core Gameplay Expansion**
  - [x] **Job System**: Implemented Age 20 Transition, Dynamic Action Bar.
  - [x] **Job Volatility**: Firing & Bonuses.
  - [x] **Event Expansion**: Dating (Pink UI), Random Events (Crypto, Boss).

### 🚧 In Progress / Next Up
- **Localization**: (Deferred)

### Step 2. UI/UX 및 연출 강화 (Polish) - "Wowed at first glance"
*   **목표**: '글로벌 룰'의 Design Aesthetics 준수.
*   **작업**:
    1. **언어 설정 (Localization)**: 메뉴 내 한국어/영어 토글 구현.
    2. **캐릭터 생성 연출**: 주사위 굴리기 시 픽셀 아트 애니메이션 및 사운드 효과(SFX) 추가.
    3. **메인 화면 연출**: 계절/시간 변화에 따른 배경 색감 미세 조정.

### Step 3. 컨텐츠 확장 (Phase 6: Jobs & Endings)
*   **목표**: 플레이 타임 확장 및 리플레이 가치 부여.
*   **작업**:
    1. **직업 시스템 (Job System)**: 
        - 현재: 학생(Student) 공부 위주.
        - 추가: 성인식(20세) 이후 **[대학] / [취업] / [알바]** 선택지 구현. (기획서 `02` 기반)
    2. **엔딩 다양화 (Endings)**:
        - 과로사(Bad): 스트레스 50 도달 시 컷신.
        - 부자(Good): 자산 목표 달성 시.

---

### Phase 5: 로컬라이징 및 디테일 (Unified with Short-Term Plan)
*(위의 Step 2로 통합됨)*


### Phase 6: 컨텐츠 확장 (확장 예정)
*기획서(`02`)와 구현(`03`) 비교를 통해 도출된 부족분:*
- [ ] **직업 시스템 고도화**: 현재 '학생' 외에 다양한 직업군 및 승진 로직 구현 필요.
- [ ] **엔딩 다양화**: 은퇴/파산 외에 '과로사', '결혼' 관련 엔딩/컷신 추가.
- [ ] **리얼타임 리더보드**: 단순 점수 기록을 넘어선 경쟁 요소(주간 랭킹 등) 도입 검토.

