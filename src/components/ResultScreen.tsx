"use client";

import { useState, useRef, useEffect, useCallback, type TextareaHTMLAttributes } from "react";
import {
  Download,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Briefcase,
  Loader2,
  Plus,
  X,
  Trash2,
  ChevronUp,
  ChevronDown,
  Pencil,
} from "lucide-react";
import type { PortfolioData, PortfolioProject, CustomSection } from "@/types/portfolio";

/* ── Props ── */
interface ResultScreenProps {
  data: PortfolioData;
  onReset: () => void;
  onDataChange: (data: PortfolioData) => void;
}

/* ── AutoResizeTextarea ── */
function AutoResizeTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string },
) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [props.value, resize]);

  return (
    <textarea
      ref={ref}
      rows={1}
      {...props}
      onInput={(e) => {
        resize();
        props.onInput?.(e);
      }}
      className={`w-full resize-none overflow-hidden bg-transparent border border-transparent hover:border-[#e5e7eb] focus:border-[#fa0030] focus:outline-none rounded-md px-2 py-1 transition-colors text-sm text-[#374151] leading-relaxed ${props.className ?? ""}`}
      style={{ fontSize: "16px", ...props.style }}
    />
  );
}

/* ── 편집용 input 공통 스타일 ── */
const editInputClass =
  "w-full bg-transparent border border-transparent hover:border-[#e5e7eb] focus:border-[#fa0030] focus:outline-none rounded-md px-2 py-1 transition-colors";

/* ── 프로젝트 라벨 ── */
const PROJECT_LABELS = [
  { key: "context", label: "배경" },
  { key: "problem", label: "문제" },
  { key: "role", label: "역할" },
  { key: "action", label: "액션" },
  { key: "result", label: "결과" },
] as const;

/* ── 빈 프로젝트 기본값 ── */
const EMPTY_PROJECT: PortfolioProject = {
  title: "",
  company: "",
  context: "",
  problem: "",
  role: "",
  action: "",
  result: "",
};

/* ── ResultScreen 본체 ── */
export default function ResultScreen({
  data,
  onReset,
  onDataChange,
}: ResultScreenProps) {
  const [downloading, setDownloading] = useState(false);


  /* ── 헬퍼: 단일 필드 ── */
  const updateField = <K extends keyof PortfolioData>(
    key: K,
    value: PortfolioData[K],
  ) => {
    onDataChange({ ...data, [key]: value });
  };

  /* ── 헬퍼: 배열 아이템 (keywords, coreCompetencies) ── */
  const updateArrayItem = (
    key: "keywords" | "coreCompetencies",
    idx: number,
    value: string,
  ) => {
    const arr = [...data[key]];
    arr[idx] = value;
    onDataChange({ ...data, [key]: arr });
  };

  const addArrayItem = (key: "keywords" | "coreCompetencies") => {
    onDataChange({ ...data, [key]: [...data[key], ""] });
  };

  const removeArrayItem = (
    key: "keywords" | "coreCompetencies",
    idx: number,
  ) => {
    onDataChange({ ...data, [key]: data[key].filter((_, i) => i !== idx) });
  };

  /* ── 헬퍼: 프로젝트 ── */
  const updateProject = <K extends keyof PortfolioProject>(
    idx: number,
    key: K,
    value: PortfolioProject[K],
  ) => {
    const projects = [...data.projects];
    projects[idx] = { ...projects[idx], [key]: value };
    onDataChange({ ...data, projects });
  };

  const addProject = () => {
    onDataChange({ ...data, projects: [...data.projects, { ...EMPTY_PROJECT }] });
  };

  const removeProject = (idx: number) => {
    if (!confirm("이 프로젝트를 삭제할까요?")) return;
    onDataChange({ ...data, projects: data.projects.filter((_, i) => i !== idx) });
  };

  const moveProject = (idx: number, direction: "up" | "down") => {
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= data.projects.length) return;
    const projects = [...data.projects];
    [projects[idx], projects[target]] = [projects[target], projects[idx]];
    onDataChange({ ...data, projects });
  };

  /* ── 헬퍼: 커스텀 섹션 ── */
  const sections = data.customSections ?? [];

  const updateSection = (idx: number, key: keyof CustomSection, value: string) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [key]: value };
    onDataChange({ ...data, customSections: updated });
  };

  const addSection = () => {
    onDataChange({ ...data, customSections: [...sections, { title: "", content: "" }] });
  };

  const removeSection = (idx: number) => {
    if (!confirm("이 섹션을 삭제할까요?")) return;
    onDataChange({ ...data, customSections: sections.filter((_, i) => i !== idx) });
  };

  /* ── PDF 다운로드 ── */
  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("PDF 생성 실패");
      const blob = await res.blob();
      const filename = data.name
        ? `${data.name}_포트폴리오.pdf`
        : "포트폴리오.pdf";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF 다운로드 실패:", err);
      alert("PDF 다운로드에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setDownloading(false);
    }
  };

  /* ── 렌더 ── */
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0 py-12 space-y-8">
      {/* 완성 헤더 */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mx-auto">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
          포트폴리오가 완성되었어요!
        </h1>
        <p className="text-sm text-[#6b7280]">
          각 항목을 클릭하면 바로 수정할 수 있어요
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs text-[#6b7280] bg-[#f9fafb] border border-[#e5e7eb] rounded-full px-3 py-1">
          <Pencil className="w-3 h-3" />
          모든 항목 편집 가능
        </span>
      </div>

      {/* 미리보기 카드 */}
      <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl overflow-hidden">
        {/* 프로필 섹션 */}
        <div className="px-6 py-5 border-b border-[#e5e7eb] space-y-2">
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={`${editInputClass} text-xl font-bold text-[#1a1a1a]`}
            style={{ fontSize: "16px" }}
            placeholder="이름"
          />
          <input
            type="text"
            value={data.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            className={`${editInputClass} text-sm text-[#6b7280]`}
            style={{ fontSize: "16px" }}
            placeholder="한 줄 소개"
          />

          {/* 키워드 태그 */}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {data.keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-[#fff5f5] text-[#fa0030] text-xs font-medium pl-2.5 pr-1 py-1 rounded-full"
              >
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) =>
                    updateArrayItem("keywords", idx, e.target.value)
                  }
                  className="bg-transparent border-none outline-none text-[#fa0030] text-xs font-medium w-16 min-w-0"
                  style={{
                    width: `${Math.max(keyword.length, 2) * 0.8 + 1}em`,
                    fontSize: "16px",
                  }}
                />
                <button
                  onClick={() => removeArrayItem("keywords", idx)}
                  className="p-0.5 rounded-full hover:bg-[#fa0030]/10 transition-colors"
                  aria-label="키워드 삭제"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={() => addArrayItem("keywords")}
              className="inline-flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#fa0030] border border-dashed border-[#e5e7eb] hover:border-[#fa0030] rounded-full px-2.5 py-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              추가
            </button>
          </div>
        </div>

        {/* 프로젝트 목록 */}
        <div className="divide-y divide-[#e5e7eb]">
          {data.projects.map((project, idx) => (
            <div key={idx} className="px-6 py-5 space-y-3">
              {/* 프로젝트 헤더 + 컨트롤 */}
              <div className="flex items-start gap-2">
                <Briefcase className="w-4 h-4 text-[#fa0030] mt-2.5 shrink-0" />
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) =>
                    updateProject(idx, "title", e.target.value)
                  }
                  className={`${editInputClass} flex-1 text-base font-semibold text-[#1a1a1a]`}
                  style={{ fontSize: "16px" }}
                  placeholder="프로젝트 제목"
                />
                {/* 순서 이동 + 삭제 */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => moveProject(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-[#e5e7eb] disabled:opacity-30 transition-colors"
                    aria-label="위로 이동"
                  >
                    <ChevronUp className="w-4 h-4 text-[#6b7280]" />
                  </button>
                  <button
                    onClick={() => moveProject(idx, "down")}
                    disabled={idx === data.projects.length - 1}
                    className="p-1 rounded hover:bg-[#e5e7eb] disabled:opacity-30 transition-colors"
                    aria-label="아래로 이동"
                  >
                    <ChevronDown className="w-4 h-4 text-[#6b7280]" />
                  </button>
                  <button
                    onClick={() => removeProject(idx)}
                    className="p-1 rounded hover:bg-red-50 transition-colors"
                    aria-label="프로젝트 삭제"
                  >
                    <Trash2 className="w-4 h-4 text-[#6b7280] hover:text-[#fa0030]" />
                  </button>
                </div>
              </div>

              {/* 회사명 */}
              <div className="ml-6">
                <input
                  type="text"
                  value={project.company}
                  onChange={(e) =>
                    updateProject(idx, "company", e.target.value)
                  }
                  className={`${editInputClass} text-xs text-[#6b7280]`}
                  style={{ fontSize: "16px" }}
                  placeholder="회사명 (예: 팀스파르타)"
                />
              </div>

              {/* 5단계 필드 */}
              <div className="space-y-2 ml-6">
                {PROJECT_LABELS.map(({ key, label }) => (
                  <div key={key} className="flex items-start gap-2">
                    <span className="text-xs font-medium text-[#fa0030] bg-[#fff5f5] px-2 py-0.5 rounded shrink-0 mt-1.5">
                      {label}
                    </span>
                    <AutoResizeTextarea
                      value={project[key]}
                      onChange={(e) =>
                        updateProject(idx, key, e.target.value)
                      }
                      placeholder={`${label}을 입력하세요`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 프로젝트 추가 버튼 */}
        <div className="px-6 py-3 border-t border-[#e5e7eb]">
          <button
            onClick={addProject}
            className="w-full flex items-center justify-center gap-2 text-sm text-[#6b7280] hover:text-[#fa0030] border border-dashed border-[#e5e7eb] hover:border-[#fa0030] rounded-lg py-2.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            프로젝트 추가
          </button>
        </div>

        {/* 핵심 역량 */}
        <div className="px-6 py-5 border-t border-[#e5e7eb]">
          <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">
            핵심 역량
          </h3>
          <ul className="space-y-2">
            {data.coreCompetencies.map((comp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#fa0030] mt-2 shrink-0">&#8226;</span>
                <AutoResizeTextarea
                  value={comp}
                  onChange={(e) =>
                    updateArrayItem("coreCompetencies", idx, e.target.value)
                  }
                  placeholder="핵심 역량을 입력하세요"
                />
                <button
                  onClick={() => removeArrayItem("coreCompetencies", idx)}
                  className="p-1 rounded hover:bg-red-50 shrink-0 transition-colors mt-0.5"
                  aria-label="역량 삭제"
                >
                  <X className="w-3.5 h-3.5 text-[#6b7280] hover:text-[#fa0030]" />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => addArrayItem("coreCompetencies")}
            className="mt-2 inline-flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#fa0030] border border-dashed border-[#e5e7eb] hover:border-[#fa0030] rounded-full px-3 py-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            역량 추가
          </button>
        </div>

        {/* 커스텀 섹션 */}
        {sections.map((section, idx) => (
          <div key={idx} className="px-6 py-5 border-t border-[#e5e7eb]">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(idx, "title", e.target.value)}
                className={`${editInputClass} text-sm font-semibold text-[#1a1a1a] flex-1`}
                style={{ fontSize: "16px" }}
                placeholder="섹션 제목 (예: 지원 동기, 자격증, 수상 경력)"
              />
              <button
                onClick={() => removeSection(idx)}
                className="p-1 rounded hover:bg-red-50 shrink-0 transition-colors"
                aria-label="섹션 삭제"
              >
                <Trash2 className="w-4 h-4 text-[#6b7280] hover:text-[#fa0030]" />
              </button>
            </div>
            <AutoResizeTextarea
              value={section.content}
              onChange={(e) => updateSection(idx, "content", e.target.value)}
              placeholder="내용을 입력하세요"
            />
          </div>
        ))}

        {/* 섹션 추가 버튼 */}
        <div className="px-6 py-3 border-t border-[#e5e7eb]">
          <button
            onClick={addSection}
            className="w-full flex items-center justify-center gap-2 text-sm text-[#6b7280] hover:text-[#fa0030] border border-dashed border-[#e5e7eb] hover:border-[#fa0030] rounded-lg py-2.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            섹션 추가
          </button>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 bg-[#fa0030] hover:bg-[#d10028] disabled:bg-[#fa0030]/70 text-white font-semibold py-3.5 px-6 rounded-lg text-base transition-colors"
        >
          {downloading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              PDF 생성 중...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              PDF 다운로드
            </>
          )}
        </button>

        <a
          href="#"
          className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#333333] text-white font-semibold py-3.5 px-6 rounded-lg text-base transition-colors"
        >
          이 포트폴리오로 지원하기
          <ArrowRight className="w-5 h-5" />
        </a>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-white border border-[#e5e7eb] hover:bg-[#f9fafb] text-[#6b7280] font-medium py-3 px-6 rounded-lg text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          다시 만들기
        </button>
      </div>

      {/* 하단 팁 */}
      <div className="bg-[#f9fafb] rounded-xl px-5 py-4 text-center">
        <p className="text-xs text-[#9ca3af]">
          TIP: 수정한 내용은 PDF 다운로드에 바로 반영돼요. 원하는 대로 편집한 후 다운로드하세요!
        </p>
      </div>

      {/* 하단 브랜딩 */}
      <p className="text-center text-xs text-[#9ca3af]">
        팀스파르타 AI 임팩트 메이커 채용캠페인
      </p>
    </div>
  );
}
