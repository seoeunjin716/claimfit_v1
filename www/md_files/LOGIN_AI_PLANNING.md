# 사정의 고수 - 모바일 프론트엔드 스펙 & 와이어프레임 (Mobile First, 로그인 우선 업데이트)

**프로젝트명** : 사정의 고수  
**타겟** : 손해사정사 (주 사용자) + 의뢰인 (보조)  
**우선 개발 대상** : Mobile (iOS / Android WebView 또는 React Native / Flutter 등 하이브리드)  
**디자인 원칙**  
- Mobile First : 375px × 812px (iPhone 13/14 기준)부터 시작  
- Breakpoints 예시  
  - Mobile : ~ 480px  
  - Tablet : 481px ~ 1024px (나중 확장)  
  - Desktop : 1025px ~ (웹 버전은 v2 이후 고려)  
- Touch 우선 : 버튼/터치 영역 최소 48×48px 권장  
- Safe Area 고려 (iOS notch, Android gesture bar)  
- Dark Mode 지원 준비 (시스템 따라 자동 적용)  
- **신규 우선순위** : 로그인 화면 → AI 챗봇 → 기존 기능 (Gemini API 연동으로 사진 분석/예상 금액 기능 포함)

## 1. 전체 앱 구조 (Bottom Tab + Stack Navigation, 로그인 흐름 강화)

### 초기 흐름 (로그인 우선)
1. **스플래시 → 로그인 화면** (앱 실행 시 가장 먼저)  
2. 로그인 성공 → 홈 (사정사/의뢰인 모드 선택)  
3. Bottom Tab Navigator (메인 내비게이션, 로그인 후 활성화)

### Bottom Tab Navigator (메인 내비게이션)
| 탭       | 아이콘 (예시)     | 주요 화면                          | 사정사용 / 의뢰인용 | AI 챗봇 연동 |
|----------|-------------------|------------------------------------|---------------------|--------------|
| 홈       | house             | 의뢰 목록 / 새 의뢰 등록          | 둘 다               | AI 추천 팝업 |
| AI 상담  | sparkles / bot    | AI 챗봇 (간단 상담 + 사진 분석)   | 둘 다 (신규)        | 핵심         |
| 의뢰     | clipboard-list    | 선택 가능한 의뢰 풀 / 진행중      | 사정사 중심         | -            |
| 채팅     | message-square    | 1:1 채팅 목록                     | 둘 다               | -            |
| 커뮤니티 | users / forum     | 사례 공유 게시판 / Q&A            | 사정사 중심         | -            |
| 마이     | user-circle       | 프로필 / 설정 / 수익 내역         | 둘 다               | -            |

- **로그인 후** : AI 상담 탭을 홈에 바로 연결 (온보딩 느낌)  
- **의뢰인 모드** : AI 상담 강조 (간단 상담 → 의뢰 연결)

## 2. 핵심 화면 목록 (Mobile First 순서, 로그인 + AI 추가)

### 2.1 온보딩 & 인증 (최우선: 로그인 화면)
1. **스플래시 화면** (앱 로고 + "사정의 고수" 슬로건, 2초 후 자동 로그인 화면 이동)  

2. **로그인 화면** (가장 먼저 뜨는 화면, 전체 화면 사용)  
   - 상단 : 앱 로고 + "로그인" 타이틀 (Pretendard Bold 24px)  
   - 중간 : 소셜 로그인 버튼 (세로 스택, 큰 터치 영역)  
     - **카카오 로그인** (노랑 배경, 카카오 로고, "카카오로 시작하기")  
     - **네이버 로그인** (초록 배경, 네이버 로고, "네이버로 시작하기")  
     - **구글 로그인** (흰 배경, 구글 로고, "Google로 시작하기")  
     - **이메일/전화 로그인** (회색 배경, "다른 방법으로 로그인")  
   - 하단 : "계정 만들기" 링크 (사정사/의뢰인 분리 선택)  
   - **연동 팁** : Firebase Auth 또는 Kakao/Naver SDK 사용 (Flutter/React Native 호환)  
   - **UI 팁** : 버튼 높이 56px, 아이콘 + 텍스트 중앙 정렬, Shadow sm  

3. **회원가입/추가 정보 입력** (로그인 후)  
   - 사정사 : 전문 분야 태그 선택 + 경력 입력  
   - 의뢰인 : 간단 프로필 (이름, 연락처)  
   - 완료 후 : AI 챗봇 온보딩 모달 ( "AI로 먼저 상담해보세요!" )

### 2.2 AI 챗봇 화면 (신규 핵심 기능, Gemini API 연동)
- **접근** : AI 상담 탭 / 홈 FAB / 로그인 후 팝업  
- **UI 구성** (채팅 스타일, 카카오톡 느낌)  
  - 상단 : "AI 상담 봇" 헤더 + "고수 사정사 연결" 버튼 (예상 금액 후)  
  - 채팅 영역 (스크롤 가능)  
    - AI 메시지 : "안녕하세요! 사고 상황을 알려주세요. 사진도 업로드 가능해요."  
    - 사용자 입력 : 텍스트 + 마이크 + 사진 업로드 버튼 (카메라/갤러리)  
  - **Gemini API 연동 기능**  
    - **간단 상담** : 보험 유형 추천, 서류 필요 목록, 진행 팁 (텍스트/음성 입력)  
    - **예상 금액 분석** : 사진 업로드 → Gemini 1.5 Pro (또는 Firebase AI Logic SDK) 호출  
      - 입력 : 사고 사진 + 텍스트 (사고 경위)  
      - 출력 : "손상 정도: 중증 (80% 확신), 예상 보상액: 500~800만 원 (보험개발원 + 판례 기반)"  
      - 표시 : 카드 형식 (이미지 + 분석 결과 + "사정사 검토 추천" 배지)  
    - **스트리밍 응답** : 실시간 타이핑 효과 (Gemini API 지원)  
    - **보안** : 사진 업로드 시 익명화 + 사용자 동의 팝업  
- **추가 기능**  
  - "상담 기록 저장" 버튼 → 마이페이지 이동  
  - "사정사에게 연결" CTA : AI 결과 → 의뢰 등록으로 자동 연계  

### 2.3 홈 화면 (사정사 버전, AI 연동)
- 상단 : 빠른 필터 + "AI 상담 시작" 카드 (추천)  
- 중간 : 새 의뢰 카드 리스트  
- **AI 통합** : 새 의뢰 카드에 "AI 예상 보상" 미리보기 (Gemini 결과 표시)

### 2.4 나머지 화면 (기존 + AI 보완)
- 새 의뢰 상세 : AI 분석 결과 미리보기 추가  
- 프로필 : AI 사용 이력 (상담 횟수, 분석 성공률)  
- 의뢰 등록 : AI 챗봇에서 이어서 자동 채우기 (Gemini 결과 import)

## 3. 공통 컴포넌트 목록 (AI 추가)

- **소셜 로그인 버튼** (커스텀, 브랜드 컬러)  
- **AI 챗봇 컴포넌트** (Bubble UI + 이미지 업로드)  
- **Gemini 결과 카드** (분석 결과 + 수정 버튼)  
- Modal (AI 동의 / 업로드 가이드)  
- Loading Spinner (Gemini API 호출 시 "분석 중...")

## 4. 색상 & 타이포그래피 가이드 (Mobile 우선, AI 강조)

### 색상
- Primary   : #3B82F6 (blue-500, AI 버튼용)  
- AI Accent : #8B5CF6 (purple-500, 챗봇 강조)  
- Success   : #10B981  
- Kakao     : #FEE500  
- Naver     : #03C75A  
- Google    : #4285F4  

### 폰트
- Pretendard (또는 시스템 sans-serif)  
- Size scale  
  - Title : 20~24px bold  
  - AI Response : 16px (bold for 예상 금액)  

## 5. 기술 연동 팁 (프론트엔드 관점)
- **소셜 로그인** :  
  - Kakao : kakao_flutter_sdk (Flutter) / react-native-kakao-login  
  - Naver : naver_login_sdk (Flutter) / Firebase Auth + SDK  
  - Google : Firebase Authentication (Google Sign-In SDK)  
- **Gemini API** :  
  - Google AI SDK for Flutter/React Native 또는 REST API (ai.google.dev)  
  - Multimodal : 이미지 + 텍스트 프롬프트 (e.g., "이 사진의 손상 정도와 예상 보상액 분석해")  
  - 비용 : 무료 티어로 시작, 한국 리전 지원  
- **AI 챗봇** : Streamlit-like UI + Gemini Streaming API  

## 6. 추가되면 좋을 기능 제안 (AI 중심으로)
- **AI Claims Triage** : 사진 업로드 시 자동 "긴급도" 분류 (Gemini + 간단 ML) → 사정사 푸시 우선순위  
- **OCR 서류 스캔** : Gemini Vision으로 위임장/진단서 자동 읽기 (텍스트 추출)  
- **Fraud Detection** : AI가 의뢰 패턴 분석 (e.g., "이 케이스 이상 징후 감지")  
- **Personalized Tips** : 사용자 과거 데이터로 "이번 사고는 실손 우선" 추천  
- **Voice-to-Text** : 음성 상담 → Gemini 요약 (한국어 지원)  
- **A/B 테스트** : AI 상담 vs 인간 상담 비교 (의뢰율 측정)  
- **오프라인 AI** : Gemini Nano (Android on-device)로 간단 분석 (오프라인 모드)  

## 7. 다음 단계 (개발 후 확장)
- 태블릿 대응  
- PWA / 웹 버전  
- Gemini API 비용 최적화 (캐싱)  
- 베타 테스트 : AI 정확도 피드백 수집  

작성일 : 2026년 2월  
작성자 : eunjin (with Grok)  