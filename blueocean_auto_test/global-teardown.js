import fs from 'fs';
import path from 'path';

const REPORT_DIR = path.resolve(process.cwd(), 'lighthouse-reports');

async function globalTeardown() {
  if (!fs.existsSync(REPORT_DIR)) {
    console.warn('[global-teardown] lighthouse-reports/ 없음 → 스킵');
    return;
  }

  const jsonFiles = fs
    .readdirSync(REPORT_DIR)
    .filter((f) => f.endsWith('.json'));

  if (jsonFiles.length === 0) {
    console.warn('[global-teardown] JSON 리포트 없음 → summary.html 미생성');
    return;
  }

  const rows = [];

  for (const file of jsonFiles.sort()) {
    const raw = fs.readFileSync(path.join(REPORT_DIR, file), 'utf-8');
    let lhr;
    try {
      const parsed = JSON.parse(raw);
      // playwright-lighthouse는 { lhr: ... } 래핑 없이 LHR 직접 저장
      lhr = parsed.lhr ?? parsed;
    } catch {
      continue;
    }

    const cats = lhr.categories ?? {};
    const score = (key) => {
      const s = cats[key]?.score;
      return s != null ? Math.round(s * 100) : '-';
    };

    // 파일명 패턴: {store_code}_{page_code}.json
    const basename = file.replace('.json', '');
    const underscoreIdx = basename.indexOf('_');
    const storeCode = underscoreIdx >= 0 ? basename.slice(0, underscoreIdx) : basename;
    const pageCode  = underscoreIdx >= 0 ? basename.slice(underscoreIdx + 1) : '';

    rows.push({
      storeCode,
      pageCode,
      url: lhr.finalUrl ?? lhr.finalDisplayedUrl ?? '',
      performance: score('performance'),
      accessibility: score('accessibility'),
      bestPractices: score('best-practices'),
      seo: score('seo'),
    });
  }

  const colorClass = (score) => {
    if (score === '-') return '';
    if (score >= 90) return 'good';
    if (score >= 50) return 'avg';
    return 'bad';
  };

  const td = (score) =>
    `<td class="${colorClass(score)}">${score}</td>`;

  const tableRows = rows
    .map(
      (r) => `
    <tr>
      <td>${r.storeCode}</td>
      <td>${r.pageCode}</td>
      <td><a href="${r.url}" target="_blank">${r.url}</a></td>
      ${td(r.performance)}
      ${td(r.accessibility)}
      ${td(r.bestPractices)}
      ${td(r.seo)}
    </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>Lighthouse Summary</title>
  <style>
    body { font-family: sans-serif; padding: 24px; }
    h1 { font-size: 1.4rem; margin-bottom: 16px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: center; }
    th { background: #f0f0f0; }
    td:nth-child(1), td:nth-child(2), td:nth-child(3) { text-align: left; }
    .good { background: #d4edda; color: #155724; font-weight: bold; }
    .avg  { background: #fff3cd; color: #856404; font-weight: bold; }
    .bad  { background: #f8d7da; color: #721c24; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Lighthouse Summary (${rows.length} pages)</h1>
  <table>
    <thead>
      <tr>
        <th>Store</th>
        <th>Page Code</th>
        <th>URL</th>
        <th>Performance</th>
        <th>Accessibility</th>
        <th>Best Practices</th>
        <th>SEO</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
</body>
</html>`;

  const summaryPath = path.join(REPORT_DIR, 'summary.html');
  fs.writeFileSync(summaryPath, html, 'utf-8');
  console.log(`[global-teardown] summary.html 생성 완료 → ${summaryPath}`);
}

export default globalTeardown;
