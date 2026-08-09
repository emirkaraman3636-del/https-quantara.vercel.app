import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { checkTenantAccess } from '../../../lib/auth-server';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { parseFileBuffer } from '@/lib/file-parser';
import { inferSemanticSchema } from '@/lib/semantic-inference';
import { generateDataQualityReport } from '@/lib/data-quality';
import { calculateGenericMetrics } from '@/lib/dynamic-aggregator';
import { generateAIInsights } from '@/lib/server-ai';
import { DynamicAnalyticsSummary } from '@/lib/dynamic-types';
import mammoth from 'mammoth';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;

    if (!file || !projectId) {
      return NextResponse.json({ error: 'File and projectId are required' }, { status: 400 });
    }

    const authCheck = await checkTenantAccess({ projectId });
    
    if (!authCheck.authorized || !authCheck.user) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const dbUser = authCheck.user;

    // 1. Upload to Supabase Storage
    const fileName = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('datasets')
      .upload(`${projectId}/${fileName}`, file);

    if (uploadError) throw uploadError;

    // 2. Parse file content robustly
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type.toLowerCase();
    
    let rawRows: Record<string, unknown>[] = [];
    
    if (mimeType.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')) {
      const pdfParseMod = await import('pdf-parse');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParse = (pdfParseMod as any).default || pdfParseMod;
      const pdfData = await pdfParse(buffer);
      const lines = pdfData.text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
      rawRows = attemptTabularExtraction(lines);
    } else if (mimeType.includes('wordprocessingml') || file.name.toLowerCase().endsWith('.docx')) {
      const docxData = await mammoth.extractRawText({ buffer });
      const lines = docxData.value.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
      rawRows = attemptTabularExtraction(lines);
    } else {
      // Use new robust file parser for CSV/Excel
      rawRows = await parseFileBuffer(buffer, mimeType, file.name);
    }

    if (rawRows.length === 0) {
      return NextResponse.json({ error: 'Veri bulunamadı veya tablo ayrıştırılamadı.', issues: [] }, { status: 400 });
    }

    // 3. Dynamic Pipeline Execution
    const schema = await inferSemanticSchema(rawRows);
    const quality = generateDataQualityReport(rawRows, schema);
    const metrics = calculateGenericMetrics(rawRows, schema);
    
    // Create base summary
    const summary: DynamicAnalyticsSummary = {
      schema,
      quality,
      metrics,
      aiAnalysis: null,
      rawSample: rawRows.slice(0, 5) // Send a small sample for UI context
    };

    // 4. Generate AI Business Analyst insights
    summary.aiAnalysis = await generateAIInsights(summary);

    // 5. Database Records
    const dataset = await prisma.dataset.create({
      data: {
        projectId,
        name: file.name,
        fileUrl: uploadData.path,
        fileType: file.type,
        sizeBytes: file.size
      }
    });

    const analysis = await prisma.analysis.create({
      data: {
        datasetId: dataset.id,
        summaryJson: JSON.parse(JSON.stringify(summary))
      }
    });

    // 6. Log Action
    await prisma.auditLog.create({
      data: {
        orgId: dbUser.orgId,
        userId: dbUser.id,
        action: 'DATASET_UPLOADED',
        details: { datasetId: dataset.id, fileName: file.name, datasetType: schema.datasetType }
      }
    });

    return NextResponse.json({ dataset, analysis });
  } catch (error: unknown) {
    console.error('Error uploading dataset:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to process dataset' }, { status: 500 });
  }
}

// Yardımcı Heuristik (PDF/DOCX için)
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
