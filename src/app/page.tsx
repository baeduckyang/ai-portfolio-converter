"use client";

import { useState } from "react";
import type {
  ConvertRequest,
  ConvertResponse,
  ConvertStatus,
  PortfolioData,
} from "@/types/portfolio";
import InputForm from "@/components/InputForm";
import LoadingScreen from "@/components/LoadingScreen";
import ResultScreen from "@/components/ResultScreen";

export default function Home() {
  const [status, setStatus] = useState<ConvertStatus>("idle");
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (req: ConvertRequest) => {
    setStatus("converting");
    setError(null);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      const json: ConvertResponse = await res.json();

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "변환에 실패했습니다. 다시 시도해 주세요.");
      }

      setPortfolioData(json.data);
      setStatus("done");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setPortfolioData(null);
    setError(null);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      {status === "idle" && (
        <InputForm onSubmit={handleSubmit} isLoading={false} error={error} />
      )}

      {status === "converting" && <LoadingScreen />}

      {status === "done" && portfolioData && (
        <ResultScreen data={portfolioData} onReset={handleReset} onDataChange={setPortfolioData} />
      )}

      {status === "error" && (
        <InputForm onSubmit={handleSubmit} isLoading={false} error={error} />
      )}
    </main>
  );
}
