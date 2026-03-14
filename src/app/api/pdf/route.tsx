import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PortfolioPDF } from "@/lib/pdf/template";
import type { PortfolioData } from "@/types/portfolio";

export async function POST(request: NextRequest) {
  try {
    const data: PortfolioData = await request.json();

    const buffer = await renderToBuffer(<PortfolioPDF data={data} />);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="portfolio.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF 생성 오류:", error instanceof Error ? error.stack : error);
    return NextResponse.json(
      { error: "PDF 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
