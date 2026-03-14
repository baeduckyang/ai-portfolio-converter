"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const MESSAGES = [
  "경험을 분석하는 중...",
  "핵심 성과를 추출하는 중...",
  "프로젝트를 구조화하는 중...",
  "프로페셔널한 양식으로 변환하는 중...",
];

const INTERVAL_MS = 3000;
const PROGRESS_STEP = 22;
const MAX_PROGRESS = 90;

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + PROGRESS_STEP, MAX_PROGRESS));
      setMessageIndex((prev) => Math.min(prev + 1, MESSAGES.length - 1));
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0 py-24 flex flex-col items-center space-y-8">
      {/* 아이콘 */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-[#fff5f5] flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[#fa0030] animate-pulse" />
        </div>
      </div>

      {/* 메시지 */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-[#1a1a1a]">
          포트폴리오를 만들고 있어요
        </h2>
        <p className="text-sm text-[#6b7280] h-5 transition-opacity duration-300">
          {MESSAGES[messageIndex]}
        </p>
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full space-y-2">
        <div className="w-full h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#fa0030] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs text-[#9ca3af]">{progress}%</p>
      </div>

      {/* 안내 */}
      <p className="text-xs text-[#9ca3af] text-center">
        약 10~20초 정도 소요됩니다
      </p>
    </div>
  );
}
