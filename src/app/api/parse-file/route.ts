import { NextResponse } from 'next/server';
import { parseFileBuffer } from '@/lib/file-parser';
import { inferSemanticSchema } from '@/lib/semantic-inference';
import { generateDataQualityReport } from '@/lib/data-quality';
import { calculateGenericMetrics } from '@/lib/dynamic-aggregator';
import { generateAIInsights } from '@/lib/server-ai';
import { DynamicAnalyticsSummary } from '@/lib/dynamic-types';
import mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded.' },
        { status: 400 }
      );
    }

    const datasetId = `ds-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const fileName = file.name;

    if (file.size === 0) {
      return NextResponse.json({
        success: false,
        datasetId,
        fileName,
        message: `Dosya "${fileName}" boş (0 bayt). Lütfen veri içeren geçerli bir dosya yükleyin.`,
        records: [],
        validation: null
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type.toLowerCase();
    
    let rawRows: Record<string, unknown>[] = [];
    
    if (mimeType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) {
      const pdfParseMod = await import('pdf-parse');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParse = (pdfParseMod as any).default || pdfParseMod;
      const pdfData = await pdfParse(buffer);
      const lines = pdfData.text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
      rawRows = attemptTabularExtraction(lines);
    } else if (mimeType.includes('wordprocessingml') || fileName.toLowerCase().endsWith('.docx')) {
      const docxData = await mammoth.extractRawText({ buffer });
      const lines = docxData.value.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
      rawRows = attemptTabularExtraction(lines);
    } else {
      // Use new robust file parser for CSV/Excel
      rawRows = await parseFileBuffer(buffer, mimeType, fileName);
    }

    if (rawRows.length === 0) {
      return NextResponse.json({
        success: false,
        datasetId,
        fileName,
        message: `Dosya "${fileName}" veri içeriyor ancak uygun bir tablo yapısına dönüştürülemedi.`,
        records: [],
        validation: null
      });
    }

    // Dynamic Pipeline Execution
    const schema = await inferSemanticSchema(rawRows);
    const quality = generateDataQualityReport(rawRows, schema);
    const metrics = calculateGenericMetrics(rawRows, schema);
    
    // Create base summary
    const summary: DynamicAnalyticsSummary = {
      schema,
      quality,
      metrics,
      aiAnalysis: null,
      rawSample: rawRows.slice(0, 5)
    };

    // Generate AI Business Analyst insights
    summary.aiAnalysis = await generateAIInsights(summary);

    return NextResponse.json({
      success: true,
      datasetId,
      fileName,
      message: `Dosya "${fileName}" başarıyla okundu. Toplam ${rawRows.length} veri satırı ayrıştırıldı.`,
      records: rawRows, // Backend compatibility for UI
      rawRows,
      dynamicSchema: schema,
      dynamicMetrics: metrics,
      dataQuality: quality,
      analytics: {
        chartInsights: summary.aiAnalysis, // Sending via analytics for UI fallback compatibility
        autoInsights: summary.aiAnalysis?.anomalies
      }
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: `Sunucu dosya okuma hatası: ${error instanceof Error ? error.message : 'Dosya işlenemedi'}` },
      { status: 500 }
    );
  }
}

function attemptTabularExtraction(lines: string[]): Record<string, unknown>[] {
  const result: Record<string, unknown>[] = [];
  let headerMap: string[] | null = null;
  
  for (const line of lines) {
    const columns = line.split(/\t+|\s{2,}/).map(c => c.trim()).filter(c => c.length > 0);
    
    if (columns.length > 2) {
      if (!headerMap) {
        headerMap = columns; 
      } else {
        const rowObj: Record<string, unknown> = {};
        for (let i = 0; i < Math.min(headerMap.length, columns.length); i++) {
          rowObj[headerMap[i]] = columns[i];
        }
        result.push(rowObj);
      }
    }
  }
  
  return result;
}
