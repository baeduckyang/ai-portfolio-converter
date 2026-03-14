// AI 변환 결과 공유 타입 — 모든 서브에이전트가 이 인터페이스를 기준으로 작업

export interface PortfolioProject {
  title: string; // 수치 기반 타이틀 (예: "전환율 30% 개선 프로젝트")
  company: string; // 회사명 (예: "팀스파르타")
  context: string; // 맥락: 왜 이 프로젝트를 했는가
  problem: string; // 문제 정의: 무엇이 비효율/과제였는가
  role: string; // 본인 역할: 책임 범위, 의사결정 기여도
  action: string; // 행동과 판단: 어떤 기준으로 왜 그렇게 선택했는가
  result: string; // 결과와 지표: 수치화된 성과, 배운 점
}

export interface CustomSection {
  title: string; // 섹션 제목 (예: "지원 동기", "자격증", "교육 이수")
  content: string; // 섹션 내용
}

export interface PortfolioData {
  name: string; // 이름
  tagline: string; // 한 줄 소개 (직무 맥락)
  keywords: string[]; // 핵심 역량 키워드 3~5개
  projects: PortfolioProject[]; // 프로젝트 목록
  coreCompetencies: string[]; // 핵심 역량 정리 (2~4개 문장)
  motivation?: string; // 지원 동기 (레거시 — customSections로 자동 변환)
  customSections?: CustomSection[]; // 사용자 커스텀 섹션
}

export interface ConvertRequest {
  text: string; // 사용자 입력 텍스트
  jobCategory?: JobCategory; // 직무 선택 (선택사항)
}

export interface ConvertResponse {
  success: boolean;
  data?: PortfolioData;
  error?: string;
}

export type JobCategory =
  | "pm"
  | "developer"
  | "designer"
  | "marketing"
  | "sales"
  | "operations"
  | "other";

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  pm: "PM / 기획",
  developer: "개발",
  designer: "디자인",
  marketing: "마케팅",
  sales: "세일즈 / AE",
  operations: "운영 / 기타",
  other: "기타",
};

// 변환 상태 (UI에서 사용)
export type ConvertStatus =
  | "idle"
  | "converting"
  | "done"
  | "error";
