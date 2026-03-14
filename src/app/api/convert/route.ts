import { NextRequest, NextResponse } from "next/server";
import { convertToPortfolio } from "@/lib/ai/prompt";
import {
  ConvertRequest,
  ConvertResponse,
  JobCategory,
  JOB_CATEGORY_LABELS,
} from "@/types/portfolio";

const MAX_TEXT_LENGTH = 20000;

const VALID_JOB_CATEGORIES = Object.keys(JOB_CATEGORY_LABELS) as JobCategory[];

function isValidJobCategory(value: unknown): value is JobCategory {
  return (
    typeof value === "string" &&
    VALID_JOB_CATEGORIES.includes(value as JobCategory)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ConvertRequest;

    // 입력 검증: 빈 텍스트
    if (!body.text || body.text.trim().length === 0) {
      return NextResponse.json<ConvertResponse>(
        { success: false, error: "텍스트를 입력해주세요." },
        { status: 400 }
      );
    }

    // 입력 검증: 글자 수 초과
    if (body.text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json<ConvertResponse>(
        {
          success: false,
          error: `텍스트는 ${MAX_TEXT_LENGTH}자 이내로 입력해주세요.`,
        },
        { status: 400 }
      );
    }

    // jobCategory 유효성 검사 — 유효하지 않으면 undefined 처리
    const jobCategory = isValidJobCategory(body.jobCategory)
      ? body.jobCategory
      : undefined;

    const data = await convertToPortfolio(body.text.trim(), jobCategory);

    return NextResponse.json<ConvertResponse>(
      { success: true, data },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: unknown) {
    console.error("변환 API 오류:", error instanceof Error ? error.message : error);
    console.error("에러 전체:", JSON.stringify(error, Object.getOwnPropertyNames(error as object), 2));

    // Anthropic API 에러 분기 처리
    if (error instanceof Error) {
      // API Key 미설정
      if (error.message.includes("GEMINI_API_KEY") || error.message.includes("API_KEY")) {
        return NextResponse.json<ConvertResponse>(
          { success: false, error: "서버 설정 오류가 발생했습니다." },
          { status: 500 }
        );
      }

      // Rate limit (Anthropic SDK 에러 메시지 패턴)
      if (
        error.message.includes("rate_limit") ||
        error.message.includes("429")
      ) {
        return NextResponse.json<ConvertResponse>(
          {
            success: false,
            error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
          },
          { status: 429 }
        );
      }

      // JSON 파싱 실패 (재시도 후에도 실패한 경우)
      if (
        error.message.includes("JSON") ||
        error.message.includes("Unexpected token")
      ) {
        return NextResponse.json<ConvertResponse>(
          {
            success: false,
            error:
              "AI 응답을 처리하지 못했습니다. 다시 시도해주세요.",
          },
          { status: 502 }
        );
      }
    }

    // 기타 알 수 없는 오류
    return NextResponse.json<ConvertResponse>(
      {
        success: false,
        error: "변환 중 오류가 발생했습니다. 다시 시도해주세요.",
      },
      { status: 500 }
    );
  }
}
