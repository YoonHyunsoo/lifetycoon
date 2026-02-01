# 🎨 디자인 컴포넌트 & 파일 매핑 리스트

이 문서는 게임 개발에 필요한 모든 디자인 컴포넌트와 해당 컴포넌트가 구현될 파일명(경로)을 정의합니다.

## 🎮 1. 타이틀 및 메인 메뉴
| 컴포넌트 | 파일명 (제안) | 설명 |
|---|---|---|
| **타이틀 화면 (컨테이너)** | `/src/app/components/screens/1.1_TitleScreen.tsx` | 게임 진입 시 첫 화면 컨테이너 |
| **게임 로고/타이틀** | `/src/app/components/ui/1.2_GameLogo.tsx` | 픽셀 아트 스타일의 메인 타이틀 로고 |
| **메뉴 버튼 그룹** | `/src/app/components/ui/1.3_MenuButtons.tsx` | 새 게임, 이어하기 등을 포함하는 버튼 (재사용) |
| **레트로 배경** | `/src/app/components/ui/1.4_PixelBackground.tsx` | 8비트 스타일의 도시/건물 배경 및 오버레이 |

## 👤 2. 캐릭터 생성 화면
| 컴포넌트 | 파일명 (제안) | 설명 |
|---|---|---|
| **캐릭터 생성 화면 (컨테이너)** | `/src/app/components/screens/2.1_CharacterCreationScreen.tsx` | 이름, 성별, 스탯 설정을 모은 화면 |
| **입력 폼 (이름/성별)** | `/src/app/components/ui/2.2_PixelInput.tsx` | 레트로 스타일 텍스트 입력 필드 및 라디오 버튼 |
| **주사위 굴리기 (컨트롤러)** | `/src/app/components/character/2.3_DiceRoller.tsx` | 주사위 애니메이션 및 리롤 버튼 로직 |
| **스탯 결과 패널** | `/src/app/components/character/2.4_StatDistribution.tsx` | 4대 스탯(지능/체력/센스/운) 시각화 카드 |

## 🎯 3. 메인 게임 화면 (핵심)
| 컴포넌트 | 파일명 (제안) | 설명 |
|---|---|---|
| **메인 게임 레이아웃** | `/src/app/components/screens/3.1_MainGameScreen.tsx` | HUD, RoomView, ActionBar를 조합하는 메인 컨테이너 |
| **상단 HUD (헤드업 디스플레이)** | `/src/app/components/game/3.2_GameHUD.tsx` | 나이, 날짜, 재화, 각종 게이지 표시바 |
| **게이지 바 (파워/스트레스)** | `/src/app/components/ui/3.3_PixelGauge.tsx` | 값에 따라 색상이 변하는 진행 바 컴포넌트 |
| **중앙 캐릭터 영역 (Room)** | `/src/app/components/game/3.4_RoomView.tsx` | 배경과 캐릭터, 말풍선이 표시되는 중앙 화면 |
| **캐릭터 스프라이트** | `/src/app/components/game/3.5_CharacterSprite.tsx` | 상태/직업에 따라 변하는 픽셀 캐릭터 |
| **하단 액션 바 (EQ UI)** | `/src/app/components/game/3.6_ActionBar.tsx` | 이퀄라이저 스타일의 액션 조작 패널 |
| **액션 슬롯** | `/src/app/components/game/3.7_ActionSlot.tsx` | 개별 액션의 파워 투입량 조절 단위 컴포넌트 |
| **스탯 상세 패널** | `/src/app/components/game/3.8_StatusPanel.tsx` | 토글 시 나타나는 상세 능력치 정보창 |

## 📋 4. 이벤트 팝업 시스템
| 컴포넌트 | 파일명 (제안) | 설명 |
|---|---|---|
| **공통 모달 프레임** | `/src/app/components/ui/4.1_Modal.tsx` | 배경 딤 처리 및 픽셀 보더가 적용된 팝업 컨테이너 |
| **이벤트 팝업 (통합)** | `/src/app/components/events/4.2_EventPopup.tsx` | 텍스트, 이미지, 선택지가 있는 일반 이벤트 팝업 |
| **진로 선택 팝업** | `/src/app/components/events/4.3_CareerPathPopup.tsx` | 매년 1월 뜨는 취업/대학/자격증 선택 UI |
| **시험/승진 결과 팝업** | `/src/app/components/events/4.4_ResultPopup.tsx` | 성공/실패 연출 및 보상 획득 화면 |
| **주식 시장 팝업** | `/src/app/components/events/4.5_StockMarketPopup.tsx` | 4개 종목 차트 및 매매 인터페이스 |
| **주식 종목 카드** | `/src/app/components/events/4.6_StockCard.tsx` | 개별 주식의 등락률과 차트가 포함된 카드 |
| **부모님/결혼 퀘스트 팝업** | `/src/app/components/events/4.7_QuestPopup.tsx` | 조건 달성형 퀘스트 및 베팅 UI |

## 🏆 5. HALL OF WEALTH (리더보드)
| 컴포넌트 | 파일명 (제안) | 설명 |
|---|---|---|
| **리더보드 화면** | `/src/app/components/screens/5.1_LeaderboardScreen.tsx` | 전체 랭킹 리스트 화면 |
| **랭킹 테이블** | `/src/app/components/ui/5.2_PixelTable.tsx` | 순위, 이름, 자산 등을 나열하는 레트로 테이블 |

## 🎬 6. 엔딩 화면
| 컴포넌트 | 파일명 (제안) | 설명 |
|---|---|---|
| **엔딩 화면 (컨테이너)** | `/src/app/components/screens/6.1_EndingScreen.tsx` | 게임 종료 시 결과 정산 화면 |
| **결과 정산 패널** | `/src/app/components/ending/6.2_SummaryPanel.tsx` | 최종 자산, 칭호, 플레이 기록 요약 |

## ⚙️ 7. 설정 및 기타
| 컴포넌트 | 파일명 (제안) | 설명 |
|---|---|---|
| **설정 패널** | `/src/app/components/ui/7.1_SettingsPanel.tsx` | 사운드, 속도 조절 UI |
| **알림 토스트** | `/src/app/components/ui/7.2_Toast.tsx` | 화면 하단에 잠시 떴다 사라지는 알림 메시지 |
| **로딩 인디케이터** | `/src/app/components/ui/7.3_LoadingSpinner.tsx` | 화면 전환 시 표시될 8비트 로딩 아이콘 |

## 🎨 8. 공통 UI 요소 (기반 컴포넌트)
| 컴포넌트 | 파일명 (제안) | 설명 |
|---|---|---|
| **픽셀 카드 (컨테이너)** | `/src/app/components/ui/8.1_PixelCard.tsx` | 모든 윈도우/패널의 기본이 되는 테두리 박스 |
| **픽셀 버튼** | `/src/app/components/ui/8.2_PixelButton.tsx` | 크기/색상별 변형이 가능한 만능 버튼 |
| **픽셀 아이콘** | `/src/app/components/ui/8.3_PixelIcon.tsx` | Lucide 아이콘 혹은 SVG를 픽셀화하여 감싸는 래퍼 |

## 📊 9. 직업별 액션 아이콘 관리
*   **아이콘 매니저**: `/src/app/utils/9.1_ActionIcons.ts` (모든 액션 아이콘 매핑 관리)
