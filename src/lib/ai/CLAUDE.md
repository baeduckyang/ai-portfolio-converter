# AI 서브에이전트 — Claude API 변환 로직 가이드

## 담당 범위
- `src/lib/ai/prompt.ts` — 프롬프트 템플릿 + Claude API 호출 함수
- `src/app/api/convert/route.ts` — Next.js API Route 핸들러

## 사용 모델
- **Claude Sonnet 4.6** (`claude-sonnet-4-6-20250514`)
- Anthropic SDK: `@anthropic-ai/sdk`

## prompt.ts 상세

### 함수: `convertToPortfolio(text: string, jobCategory?: JobCategory): Promise<PortfolioData>`

1. System 프롬프트:
```
당신은 팀스파르타 채용팀의 포트폴리오 변환 AI입니다.
후보자가 입력한 경력/성과 텍스트를 구조화된 포트폴리오로 변환합니다.

## 변환 원칙
1. **있는 내용만 활용**: 입력에 없는 내용을 절대 지어내지 마세요.
   정보가 부족하면 해당 필드를 빈 문자열로 남기세요.
2. **구조화에 집중**: 동일한 내용을 설득력 있는 구조로 재배치합니다.
3. **수치 기반 타이틀**: 프로젝트 제목은 가능하면 핵심 성과 수치를 포함합니다.
   (예: "전환율 30% 개선", "운영 비용 40% 절감")
   수치가 없으면 핵심 행동 기반으로 작성합니다.
4. **5분 테스트**: 채용 담당자가 5분 안에 강점을 파악할 수 있어야 합니다.
5. **상단 배치**: 가장 강한 역량/성과를 최상단에 배치합니다.

## 프로젝트 구조 (각 프로젝트마다 반드시 5단계)
- 맥락: 왜 이 프로젝트를 했는가 (배경)
- 문제 정의: 무엇이 비효율/과제였는가 (문제 구조)
- 본인 역할: 팀 내 책임 범위, 의사결정 기여도
- 행동과 판단: 어떤 기준으로 판단하고 왜 그렇게 선택했는가
- 결과와 지표: 수치화된 성과, 배운 점

## 출력 형식
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트를 추가하지 마세요.
```

2. JSON 스키마를 system 프롬프트에 포함:
```json
{
  "name": "string (이름, 입력에 없으면 빈 문자열)",
  "tagline": "string (한 줄 소개, 직무 맥락 반영)",
  "keywords": ["string (핵심 역량 키워드 3~5개)"],
  "projects": [
    {
      "title": "string (수치 기반 타이틀)",
      "context": "string",
      "problem": "string",
      "role": "string",
      "action": "string",
      "result": "string"
    }
  ],
  "coreCompetencies": ["string (핵심 역량 2~4개 문장)"],
  "motivation": "string | null (지원 동기, 있는 경우만)"
}
```

3. User 프롬프트:
```
[지원 희망 직무: {jobCategory 한글명 또는 "미선택"}]

아래 텍스트를 포트폴리오로 변환해주세요:

---
{사용자 입력 텍스트}
---
```

4. API 호출 설정:
- `max_tokens`: 4096
- `temperature`: 0.3 (구조화 작업이므로 낮게)
- 응답을 JSON.parse하여 PortfolioData로 반환
- JSON 파싱 실패 시 에러 throw

### 에러 처리
- API key 없음 → "서버 설정 오류"
- Rate limit → "잠시 후 다시 시도해주세요"
- 빈 입력 → 400 에러
- JSON 파싱 실패 → 재시도 1회, 그래도 실패하면 에러

## route.ts 상세

### POST /api/convert

```typescript
Request Body: ConvertRequest { text: string; jobCategory?: JobCategory }
Response: ConvertResponse { success: boolean; data?: PortfolioData; error?: string }
```

검증:
- text가 비어있으면 400
- text가 5000자 초과면 400
- jobCategory가 유효하지 않으면 무시 (undefined 처리)

처리:
1. 입력 검증
2. `convertToPortfolio()` 호출
3. 성공 시 `{ success: true, data }` 반환
4. 실패 시 `{ success: false, error: 메시지 }` 반환

헤더:
- Content-Type: application/json
- 캐시 안 함

## 환경변수
- `ANTHROPIC_API_KEY`: process.env에서 읽음 (Vercel 환경변수)

## 주의사항
- 사용자 입력 텍스트를 어디에도 저장하지 않음
- console.log에 입력 텍스트 출력하지 않음
- API key를 클라이언트에 노출하지 않음 (서버사이드 only)
- `@/types/portfolio`에서 타입 import
