# UI 서브에이전트 — 컴포넌트 가이드

## 담당 범위
`src/components/` 내 모든 UI 컴포넌트 + `src/app/page.tsx` (메인 페이지)

## 만들어야 할 파일
1. **InputForm.tsx** — 텍스트 입력 폼
2. **LoadingScreen.tsx** — 변환 중 로딩 화면
3. **ResultScreen.tsx** — 결과 미리보기 + 다운로드/지원 버튼
4. **src/app/page.tsx** — 메인 페이지 (3개 컴포넌트를 상태로 전환)
5. **src/app/layout.tsx** — 글로벌 레이아웃 (Pretendard 폰트 등)

## 디자인 스펙

### 컬러
- Primary: `#fa0030` (버튼, 강조)
- Primary Hover: `#d10028`
- Background: `#ffffff`
- Card BG: `#f9fafb` (gray-50)
- Text: `#1a1a1a`
- Sub Text: `#6b7280`
- Accent BG: `#fff5f5` (연한 레드)
- Border: `#e5e7eb`

### 타이포그래피
- 폰트: Pretendard (Google Fonts CDN 또는 CDN)
  - 폴백: -apple-system, BlinkMacSystemFont, system-ui, sans-serif
- 메인 타이틀: text-3xl ~ text-4xl, font-bold
- 서브 타이틀: text-xl, font-semibold
- 본문: text-base (16px)
- 캡션: text-sm (14px), text-gray-500

### 레이아웃
- max-w-2xl mx-auto (중앙 정렬, 최대 672px)
- 모바일: px-4, 데스크톱: px-0
- 섹션 간격: space-y-8

## 각 컴포넌트 상세

### InputForm.tsx
```
Props: {
  onSubmit: (req: ConvertRequest) => void;
  isLoading: boolean;
}
```
- 상단: 서비스 타이틀 + 설명 문구
- "AI 이력서 대환영" 배너 (accent BG)
- 직무 선택 드롭다운 (선택사항) — JobCategory 타입 사용
- 텍스트 입력 textarea (최소 높이 240px, 최대 5000자, 글자수 표시)
- placeholder에 입력 가이드 (담당 프로젝트, 성과, 도구/기술, 연차)
- 개인정보 동의 체크박스 + 안내 문구
- "AI로 변환하기" 버튼 (Primary, 체크 안 하면 disabled)
- 하단: 팀스파르타 브랜딩 문구

### LoadingScreen.tsx
```
Props: {
  // props 없음, 자체 애니메이션
}
```
- 중앙 정렬 로딩 UI
- 프로그레스 바 (가짜 진행률 — 3초마다 증가, 최대 90%)
- 단계별 메시지 순환:
  1. "경험을 분석하는 중..."
  2. "핵심 성과를 추출하는 중..."
  3. "프로젝트를 구조화하는 중..."
  4. "프로페셔널한 양식으로 변환하는 중..."
- 팀스파르타 레드 포인트 사용

### ResultScreen.tsx
```
Props: {
  data: PortfolioData;
  onReset: () => void;
}
```
- "포트폴리오가 완성되었어요!" 타이틀
- 포트폴리오 미리보기 카드 (PortfolioData를 보기 좋게 렌더링)
  - 이름, 키워드 태그, 한줄 소개
  - 프로젝트별 5단계 구조 표시
  - 핵심 역량
- [PDF 다운로드] 버튼 — PDF 에이전트의 generatePDF 함수 호출
- [이 포트폴리오로 지원하기 →] 버튼 — 외부 링크 (href는 빈 값, 추후 연결)
- [다시 만들기] 버튼 — onReset 호출
- 하단 팁 문구

### page.tsx (메인 페이지)
```
상태 관리:
- status: ConvertStatus ('idle' | 'converting' | 'done' | 'error')
- portfolioData: PortfolioData | null
- error: string | null

플로우:
idle → InputForm 표시
converting → LoadingScreen 표시
done → ResultScreen 표시
error → InputForm + 에러 토스트
```

API 호출: `POST /api/convert` with ConvertRequest body

### layout.tsx
- Pretendard 웹폰트 로드 (link preconnect + stylesheet)
- 메타 태그: "AI 포트폴리오 변환기 | 팀스파르타"
- OG 태그 기본 설정
- body: bg-white, text-gray-900, antialiased

## 주의사항
- `@/types/portfolio`에서 타입 import
- Tailwind만 사용 (별도 CSS 파일 만들지 않기)
- lucide-react 아이콘 활용 (FileText, Download, ArrowRight, RotateCcw, Sparkles, CheckCircle 등)
- 모바일 반응형 필수
- 한국어 UI
