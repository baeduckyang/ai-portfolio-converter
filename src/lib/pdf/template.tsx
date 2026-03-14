import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  pdf,
} from '@react-pdf/renderer';
import type { PortfolioData } from '@/types/portfolio';

// ---------------------------------------------------------------------------
// 1. 한글 폰트 등록 (Noto Sans KR — Google Fonts TTF)
// ---------------------------------------------------------------------------
Font.register({
  family: 'NotoSansKR',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Regular.otf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf',
      fontWeight: 700,
    },
  ],
});

// ---------------------------------------------------------------------------
// 2. 스타일 정의
// ---------------------------------------------------------------------------
const colors = {
  primary: '#fa0030',
  text: '#1a1a1a',
  subText: '#6b7280',
  border: '#e5e7eb',
  accentBg: '#fff5f5',
  sectionBg: '#f9fafb',
  white: '#ffffff',
};

const styles = StyleSheet.create({
  // Page
  page: {
    fontFamily: 'NotoSansKR',
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.text,
    backgroundColor: colors.white,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
  },

  // ---- Profile ----
  profileSection: {
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 11,
    color: colors.subText,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keyword: {
    fontSize: 9,
    color: colors.primary,
    backgroundColor: colors.accentBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },

  // ---- Divider ----
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginVertical: 14,
  },

  // ---- Section Title ----
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 10,
  },

  // ---- Project ----
  projectSection: {
    marginBottom: 18,
    padding: 12,
    backgroundColor: colors.sectionBg,
    borderRadius: 6,
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 2,
  },
  projectCompany: {
    fontSize: 9,
    color: colors.subText,
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.primary,
    width: 70,
    flexShrink: 0,
  },
  fieldValue: {
    fontSize: 10,
    color: colors.text,
    flex: 1,
    lineHeight: 1.6,
  },

  // ---- Motivation ----
  motivationSection: {
    marginBottom: 14,
  },
  motivationText: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.6,
  },

  // ---- Competency ----
  competencySection: {
    marginBottom: 14,
  },
  competencyItem: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.6,
    marginBottom: 2,
  },

  // ---- Footer ----
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: colors.subText,
    letterSpacing: 0.5,
  },
});

// ---------------------------------------------------------------------------
// 3. PortfolioPDF 컴포넌트
// ---------------------------------------------------------------------------
export function PortfolioPDF({ data }: { data: PortfolioData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ---- 프로필 섹션 ---- */}
        <View style={styles.profileSection}>
          <Text style={styles.name}>{data.name || '포트폴리오'}</Text>
          {data.tagline ? (
            <Text style={styles.tagline}>{data.tagline}</Text>
          ) : null}
          {data.keywords && data.keywords.length > 0 ? (
            <View style={styles.keywordsRow}>
              {data.keywords.map((kw, i) => (
                <Text key={i} style={styles.keyword}>
                  #{kw}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.divider} />

        {/* ---- 프로젝트 섹션 ---- */}
        <Text style={styles.sectionTitle}>프로젝트</Text>
        {data.projects.map((project, i) => (
          <View key={i} style={styles.projectSection} wrap={false}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            {project.company ? (
              <Text style={styles.projectCompany}>{project.company}</Text>
            ) : null}

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>배경</Text>
              <Text style={styles.fieldValue}>{project.context}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>문제</Text>
              <Text style={styles.fieldValue}>{project.problem}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>역할</Text>
              <Text style={styles.fieldValue}>{project.role}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>액션</Text>
              <Text style={styles.fieldValue}>{project.action}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>결과</Text>
              <Text style={styles.fieldValue}>{project.result}</Text>
            </View>
          </View>
        ))}

        <View style={styles.divider} />

        {/* ---- 핵심 역량 ---- */}
        {data.coreCompetencies && data.coreCompetencies.length > 0 ? (
          <View style={styles.competencySection}>
            <Text style={styles.sectionTitle}>핵심 역량</Text>
            {data.coreCompetencies.map((comp, i) => (
              <Text key={i} style={styles.competencyItem}>
                {'\u2022'} {comp}
              </Text>
            ))}
          </View>
        ) : null}

        {/* ---- 커스텀 섹션 ---- */}
        {data.customSections && data.customSections.length > 0
          ? data.customSections.map((section, i) =>
              section.title || section.content ? (
                <View key={i} style={styles.motivationSection}>
                  <Text style={styles.sectionTitle}>
                    {section.title || "추가 섹션"}
                  </Text>
                  <Text style={styles.motivationText}>{section.content}</Text>
                </View>
              ) : null,
            )
          : null}


        {/* ---- 푸터 ---- */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            AI 임팩트 메이커 | teamsparta.co
          </Text>
        </View>
      </Page>
    </Document>
  );
}

// ---------------------------------------------------------------------------
// 4. PDF 생성 함수
// ---------------------------------------------------------------------------
export async function generatePDF(data: PortfolioData): Promise<Blob> {
  const blob = await pdf(<PortfolioPDF data={data} />).toBlob();
  return blob;
}

// ---------------------------------------------------------------------------
// 5. PDF 다운로드 헬퍼
// ---------------------------------------------------------------------------
export function downloadPDF(
  blob: Blob,
  filename: string = 'portfolio.pdf',
): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
