# AI 포트폴리오 변환기 — 프로젝트 컨텍스트

## 프로젝트 목적
팀스파르타 "AI 임팩트 메이커" 채용캠페인용 서비스.
후보자의 경력/성과 텍스트를 팀스파르타 선호 양식의 포트폴리오 PDF로 AI 자동 변환.

## 기술 스택
- Next.js 14 (App Router, src/ 디렉토리)
- TypeScript + Tailwind CSS
- Claude Sonnet 4.6 (Anthropic API) — AI 변환
- @react-pdf/renderer — 클라이언트 사이드 PDF 생성
- Vercel 배포

## 디자인 시스템
- Primary: `#fa0030` (팀스파르타 레드)
- Background: `#ffffff`
- Text: `#1a1a1a`, Sub: `#6b7280`
- Accent BG: `#fff5f5`
- Font: Pretendard (웹폰트), 시스템 폰트 폴백
- 반응형 필수 (모바일 우선)

## 핵심 아키텍처
```
[입력 화면] → [/api/convert] → [Claude API] → [JSON 응답]
                                                    ↓
[결과 화면] ← [PDF 렌더링 (클라이언트)] ← [PortfolioData]
```

## 공유 타입
`src/types/portfolio.ts` — 모든 컴포넌트/API가 이 타입을 사용

## 폴더 구조
```
src/
├── app/
│   ├── page.tsx              ← 메인 페이지 (UI 에이전트)
│   ├── layout.tsx            ← 레이아웃
│   └── api/convert/route.ts  ← AI 변환 API (AI 에이전트)
├── components/               ← UI 컴포넌트 (UI 에이전트)
│   ├── InputForm.tsx
│   ├── LoadingScreen.tsx
│   ├── ResultScreen.tsx
│   └── CLAUDE.md
├── lib/
│   ├── ai/                   ← AI 로직 (AI 에이전트)
│   │   ├── prompt.ts
│   │   └── CLAUDE.md
│   └── pdf/                  ← PDF 생성 (PDF 에이전트)
│       ├── template.tsx
│       └── CLAUDE.md
└── types/
    └── portfolio.ts          ← 공유 타입 (이미 생성됨)
```

## 환경변수
- `ANTHROPIC_API_KEY` — Vercel 환경변수로 설정

## 주의사항
- 데이터 저장 절대 안 함 (Stateless)
- AI가 없는 내용을 지어내지 않도록 프롬프트에 명시
- 개인정보 동의 체크 필수
