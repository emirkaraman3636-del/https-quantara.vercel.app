const fs = require('fs');

const replaceInFile = (file, regex, replacement) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
  }
}

replaceInFile('src/app/api/ai-insights/route.ts', /error\.message/g, '(error instanceof Error ? error.message : String(error))');
replaceInFile('src/app/api/cron/refresh/route.ts', /error\.message/g, '(error instanceof Error ? error.message : String(error))');
replaceInFile('src/app/api/projects/route.ts', /error\.message/g, '(error instanceof Error ? error.message : String(error))');
replaceInFile('src/app/api/user-setup/route.ts', /error\.message/g, '(error instanceof Error ? error.message : String(error))');
replaceInFile('src/lib/file-parser.ts', /err\.message/g, '(err instanceof Error ? err.message : String(err))');
replaceInFile('src/lib/refresh/refresh-worker.ts', /error\.message/g, '(error instanceof Error ? error.message : String(error))');

const pdfParseReplacement = `const pdfParseMod = await import('pdf-parse');
      const pdfParse = (pdfParseMod as any).default || pdfParseMod;`;

replaceInFile('src/app/api/datasets/route.ts', /const { default: pdfParse } = await import\('pdf-parse'\);/, pdfParseReplacement);
replaceInFile('src/app/api/parse-file/route.ts', /const { default: pdfParse } = await import\('pdf-parse'\);/, pdfParseReplacement);
replaceInFile('src/lib/refresh/parser-trigger.ts', /const { default: pdfParse } = await import\('pdf-parse'\);/, `const pdfParseMod = await import('pdf-parse');
    const pdfParse = (pdfParseMod as any).default || pdfParseMod;`);

replaceInFile('src/components/views/ForecastingView.tsx', /formatter=\{\(val: unknown, name: string\) => \[/g, `// eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any, name: any) => [`);
replaceInFile('src/components/views/SalesTrendsView.tsx', /formatter=\{\(val: unknown, name: string\) => \[/g, `// eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any, name: any) => [`);

console.log("Fixes applied");
