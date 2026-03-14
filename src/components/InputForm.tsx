"use client";

import { useState } from "react";
import { Sparkles, FileText, ChevronDown } from "lucide-react";
import type { ConvertRequest, JobCategory } from "@/types/portfolio";
import { JOB_CATEGORY_LABELS } from "@/types/portfolio";

interface InputFormProps {
  onSubmit: (req: ConvertRequest) => void;
  isLoading: boolean;
  error?: string | null;
}

const MAX_LENGTH = 20000;

const jobCategories = Object.entries(JOB_CATEGORY_LABELS) as [
  JobCategory,
  string,
][];

export default function InputForm({ onSubmit, isLoading, error }: InputFormProps) {
  const [text, setText] = useState("");
  const [jobCategory, setJobCategory] = useState<JobCategory | "">("");
  const [agreed, setAgreed] = useState(false);

  const canSubmit = text.trim().length > 0 && agreed && !isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      text: text.trim(),
      ...(jobCategory ? { jobCategory } : {}),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0 py-12 space-y-8">
      {/* 헤더 */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
          AI 포트폴리오 변환기
        </h1>
        <p className="text-base text-[#6b7280]">
          당신의 경험을 팀스파르타가 선호하는 포트폴리오 양식으로 자동 변환해 드려요
        </p>
      </div>

      {/* AI 이력서 대환영 배너 */}
      <div className="bg-[#fff5f5] border border-[#fa0030]/10 rounded-xl px-5 py-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#fa0030] mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a]">
            AI 이력서 대환영!
          </p>
          <p className="text-sm text-[#6b7280] mt-1">
            AI로 작성한 이력서도 괜찮아요. 경험의 핵심을 구조화하는 데 집중합니다.
          </p>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 직무 선택 */}
        <div className="space-y-2">
          <label
            htmlFor="jobCategory"
            className="block text-sm font-medium text-[#1a1a1a]"
          >
            직무 분야 <span className="text-[#6b7280] font-normal">(선택)</span>
          </label>
          <div className="relative">
            <select
              id="jobCategory"
              value={jobCategory}
              onChange={(e) =>
                setJobCategory(e.target.value as JobCategory | "")
              }
              className="w-full appearance-none bg-white border border-[#e5e7eb] rounded-lg px-4 py-3 pr-10 text-base text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#fa0030]/20 focus:border-[#fa0030] transition-colors"
            >
              <option value="">직무를 선택해 주세요</option>
              {jobCategories.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none" />
          </div>
        </div>

        {/* 텍스트 입력 */}
        <div className="space-y-2">
          <label
            htmlFor="portfolioText"
            className="block text-sm font-medium text-[#1a1a1a]"
          >
            경력 / 프로젝트 경험
          </label>
          <div className="relative">
            <textarea
              id="portfolioText"
              value={text}
              onChange={(e) => {
                setText(e.target.value.slice(0, MAX_LENGTH));
              }}
              placeholder={`자유롭게 작성해 주세요. 예시:\n\n• 담당한 프로젝트와 역할\n• 주요 성과 (수치가 있으면 더 좋아요)\n• 사용한 도구 / 기술 스택\n• 경력 연차`}
              rows={10}
              className="w-full bg-white border border-[#e5e7eb] rounded-lg px-4 py-3 text-base text-[#1a1a1a] placeholder:text-[#9ca3af] resize-y min-h-[240px] focus:outline-none focus:ring-2 focus:ring-[#fa0030]/20 focus:border-[#fa0030] transition-colors"
            />
            <span className="absolute bottom-3 right-3 text-xs text-[#9ca3af]">
              {text.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}자
            </span>
          </div>
        </div>

        {/* 개인정보 동의 */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#fa0030] rounded cursor-pointer"
          />
          <span className="text-sm text-[#6b7280] leading-relaxed">
            입력한 내용은 AI 변환에만 사용되며, 별도로 저장되지 않습니다.{" "}
            <span className="text-[#1a1a1a] font-medium">
              개인정보 처리에 동의합니다.
            </span>
          </span>
        </label>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 bg-[#fa0030] hover:bg-[#d10028] disabled:bg-[#e5e7eb] disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-lg text-base transition-colors"
        >
          <FileText className="w-5 h-5" />
          AI로 변환하기
        </button>
      </form>

      {/* 하단 브랜딩 */}
      <p className="text-center text-xs text-[#9ca3af]">
        팀스파르타 AI 임팩트 메이커 채용캠페인
      </p>
    </div>
  );
}
