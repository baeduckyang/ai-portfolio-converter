# PDF 서브에이전트 — PDF 생성 가이드

## 담당 범위
- `src/lib/pdf/template.tsx` — PDF 템플릿 컴포넌트 + 생성 함수

## 기술
- **@react-pdf/renderer** — React 컴포넌트로 PDF 렌더링 (클라이언트 사이드)
- 브라우저에서 직접 PDF를 생성하여 다운로드

## template.tsx 상세

### 1. PDF 스타일 (react-pdf StyleSheet)

**페이지 설정:**
- A4 사이즈
- padding: 40pt (상하좌우)
- fontFamily: 'Pretendard' 또는 시스템 폰트 폴백

**주의: @react-pdf/renderer 폰트 등록**
- react-pdf에서 한글 폰트 사용을 위해 Font.register() 필요
- Pretendard CDN 폰트 URL 등록:
  - Regular: https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard/Pretendard-Regular.subset.woff2 → 확장자 문제 시 .otf 사용
  - Bold: 같은 방식으로 Bold 등록
- 폰트 등록이 복잡하면 시스템 폰트('Helvetica')로 우선 진행하고, 한글은 fallback으로 처리
- **가장 확실한 방법**: Noto Sans KR (Google Fonts) .ttf 파일 사용
  - Font.register({ family: 'NotoSansKR', src: 'https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLTq8H4hfeE.ttf' })

**색상:**
- Primary: '#fa0030'
- Text: '#1a1a1a'
- Sub Text: '#6b7280'
- Border: '#e5e7eb'
- Accent BG: '#fff5f5'
- Section BG: '#f9fafb'

**타이포그래피 (pt 단위):**
- 이름: 22pt, bold
- 섹션 타이틀: 14pt, bold, primary color
- 프로젝트 타이틀: 12pt, bold
- 본문: 10pt, lineHeight 1.6
- 캡션/라벨: 8pt, sub text color

### 2. PDF 컴포넌트 구조

```tsx
// PortfolioPDF: 메인 PDF Document 컴포넌트
<Document>
  <Page size="A4" style={styles.page}>

    {/* 프로필 섹션 */}
    <View style={styles.profileSection}>
      <Text style={styles.name}>{data.name || '포트폴리오'}</Text>
      <Text style={styles.tagline}>{data.tagline}</Text>
      <View style={styles.keywordsRow}>
        {data.keywords.map(kw =>
          <Text style={styles.keyword}>#{kw}</Text>
        )}
      </View>
    </View>

    <View style={styles.divider} />

    {/* 프로젝트 섹션 */}
    {data.projects.map((project, i) => (
      <View style={styles.projectSection} key={i}>
        <Text style={styles.projectTitle}>{project.title}</Text>

        {/* 5단계 구조 */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>맥락</Text>
          <Text style={styles.fieldValue}>{project.context}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>문제 정의</Text>
          <Text style={styles.fieldValue}>{project.problem}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>역할</Text>
          <Text style={styles.fieldValue}>{project.role}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>행동과 판단</Text>
          <Text style={styles.fieldValue}>{project.action}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>결과와 지표</Text>
          <Text style={styles.fieldValue}>{project.result}</Text>
        </View>
      </View>
    ))}

    <View style={styles.divider} />

    {/* 핵심 역량 */}
    <View style={styles.competencySection}>
      <Text style={styles.sectionTitle}>핵심 역량</Text>
      {data.coreCompetencies.map((comp, i) =>
        <Text style={styles.competencyItem}>• {comp}</Text>
      )}
    </View>

    {/* 푸터 */}
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        AI 임팩트 메이커 | teamsparta.co
      </Text>
    </View>
  </Page>
</Document>
```

### 3. PDF 생성 함수

```typescript
// generatePDF(data: PortfolioData): Promise<Blob>
// - pdf() 함수로 Document를 Blob으로 변환
// - 호출 측에서 URL.createObjectURL로 다운로드 트리거

import { pdf } from '@react-pdf/renderer';

export async function generatePDF(data: PortfolioData): Promise<Blob> {
  const blob = await pdf(<PortfolioPDF data={data} />).toBlob();
  return blob;
}

// 다운로드 헬퍼
export function downloadPDF(blob: Blob, filename: string = 'portfolio.pdf') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

### 4. 프로젝트가 많을 때 페이지 분할
- @react-pdf/renderer는 자동으로 페이지를 분할함
- `wrap={false}`를 프로젝트 View에 넣으면 프로젝트 중간에 끊기지 않음
- 단, 프로젝트가 1페이지를 초과하면 wrap 허용

## 입력 타입
- `PortfolioData` from `@/types/portfolio`

## 주의사항
- @react-pdf/renderer는 **클라이언트 사이드 전용** (서버 컴포넌트에서 import 불가)
- 반드시 `'use client'` 또는 dynamic import with `{ ssr: false }` 사용
- Tailwind CSS는 react-pdf에서 사용 불가 → StyleSheet.create() 사용
- HTML 태그 사용 불가 → react-pdf 전용 컴포넌트만 (Document, Page, View, Text, Image 등)
- 한글 폰트 등록 필수 (등록 안 하면 깨짐)
- **export 필수**: `PortfolioPDF` 컴포넌트, `generatePDF` 함수, `downloadPDF` 함수
