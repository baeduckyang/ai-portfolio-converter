import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 포트폴리오 변환기 | 팀스파르타",
  description:
    "당신의 경험을 팀스파르타가 선호하는 포트폴리오 양식으로 AI가 자동 변환해 드립니다.",
  openGraph: {
    title: "AI 포트폴리오 변환기 | 팀스파르타",
    description:
      "당신의 경험을 팀스파르타가 선호하는 포트폴리오 양식으로 AI가 자동 변환해 드립니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "팀스파르타",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 포트폴리오 변환기 | 팀스파르타",
    description:
      "당신의 경험을 팀스파르타가 선호하는 포트폴리오 양식으로 AI가 자동 변환해 드립니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="bg-white text-[#1a1a1a] antialiased">
        {children}
      </body>
    </html>
  );
}
