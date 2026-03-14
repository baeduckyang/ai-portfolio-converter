import { GoogleGenAI } from "@google/genai";
import {
  PortfolioData,
  JobCategory,
  JOB_CATEGORY_LABELS,
} from "@/types/portfolio";

const MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `당신은 팀스파르타 채용팀의 포트폴리오 변환 AI입니다.
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
- 배경: 왜 이 프로젝트를 했는가 (배경, 상황)
- 문제: 데이터나 현상에서 발견한 핵심 문제는 무엇인가 (문제-가설-액션 프레임의 "문제". 단순히 힘들었던 상황이 아니라, 해결해야 할 구체적 문제를 정의)
- 역할: 팀 내 책임 범위, 의사결정 기여도
- 액션: 문제에 대한 가설을 세우고 어떤 액션을 취했는가, 왜 그 방법을 선택했는가
- 결과: 수치화된 성과, 배운 점

## 출력 형식
반드시 아래 JSON 형식으로만 응답하세요. JSON 외에 다른 텍스트를 절대 추가하지 마세요.
코드 블록(\`\`\`)도 사용하지 마세요. 순수 JSON만 출력하세요.

{
  "name": "string (이름, 입력에 없으면 빈 문자열)",
  "tagline": "string (한 줄 소개, 직무 맥락 반영)",
  "keywords": ["string (핵심 역량 키워드 3~5개)"],
  "projects": [
    {
      "title": "string (수치 기반 타이틀)",
      "company": "string (해당 프로젝트를 수행한 회사명, 입력에 없으면 빈 문자열)",
      "context": "string",
      "problem": "string",
      "role": "string",
      "action": "string",
      "result": "string"
    }
  ],
  "coreCompetencies": ["string (핵심 역량 2~4개 문장)"]
}`;

function buildUserPrompt(text: string, jobCategory?: JobCategory): string {
  const jobLabel = jobCategory
    ? JOB_CATEGORY_LABELS[jobCategory]
    : "미선택";

  return `[지원 희망 직무: ${jobLabel}]

아래 텍스트를 포트폴리오로 변환해주세요:

---
${text}
---`;
}

function parsePortfolioJSON(raw: string): PortfolioData {
  let jsonStr = raw.trim();

  // 코드 블록 감싸기 제거
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);

  // 필수 필드 검증
  if (!Array.isArray(parsed.projects)) {
    throw new Error("projects 필드가 배열이 아닙니다.");
  }
  if (!Array.isArray(parsed.keywords)) {
    throw new Error("keywords 필드가 배열이 아닙니다.");
  }
  if (!Array.isArray(parsed.coreCompetencies)) {
    throw new Error("coreCompetencies 필드가 배열이 아닙니다.");
  }

  return {
    name: parsed.name ?? "",
    tagline: parsed.tagline ?? "",
    keywords: parsed.keywords,
    projects: parsed.projects.map(
      (p: Record<string, unknown>) => ({
        title: (p.title as string) ?? "",
        company: (p.company as string) ?? "",
        context: (p.context as string) ?? "",
        problem: (p.problem as string) ?? "",
        role: (p.role as string) ?? "",
        action: (p.action as string) ?? "",
        result: (p.result as string) ?? "",
      })
    ),
    coreCompetencies: parsed.coreCompetencies,
  } satisfies PortfolioData;
}

async function callGemini(
  client: GoogleGenAI,
  userPrompt: string
): Promise<string> {
  const response = await client.models.generateContent({
    model: MODEL,
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.3,
      maxOutputTokens: 8192,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini API에서 텍스트 응답을 받지 못했습니다.");
  }

  return text;
}

export async function convertToPortfolio(
  text: string,
  jobCategory?: JobCategory
): Promise<PortfolioData> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
  }

  const client = new GoogleGenAI({ apiKey });
  const userPrompt = buildUserPrompt(text, jobCategory);

  const raw = await callGemini(client, userPrompt);

  // 1차 파싱 시도
  try {
    return parsePortfolioJSON(raw);
  } catch {
    console.warn("JSON 파싱 실패, 재시도합니다.");
  }

  const retryRaw = await callGemini(client, userPrompt);
  return parsePortfolioJSON(retryRaw);
}
