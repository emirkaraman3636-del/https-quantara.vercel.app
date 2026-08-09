import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { validateAndParseRows } from '../data-parser';

export async function parseBuffer(buffer: Buffer, mimeType: string, fileName: string) {
  const fileNameLower = fileName.toLowerCase();
  let rawRows: Record<string, unknown>[] = [];

  if (mimeType.includes('csv') || fileNameLower.endsWith('.csv')) {
    const fileContent = buffer.toString('utf-8');
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });
    rawRows = parsed.data as Record<string, unknown>[];
  }
  else if (mimeType.includes('json') || fileNameLower.endsWith('.json')) {
    const fileContent = buffer.toString('utf-8');
    const parsedJson = JSON.parse(fileContent);
    rawRows = Array.isArray(parsedJson) ? parsedJson : (parsedJson.data && Array.isArray(parsedJson.data) ? parsedJson.data : [parsedJson]);
  }
  else if (mimeType.includes('excel') || mimeType.includes('spreadsheetml') || fileNameLower.endsWith('.xlsx') || fileNameLower.endsWith('.xls')) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);
  }
  else if (mimeType.includes('pdf') || fileNameLower.endsWith('.pdf')) {
    const pdfParseMod = await import('pdf-parse');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParse = (pdfParseMod as any).default || pdfParseMod;
    const pdfData = await pdfParse(buffer);
    const lines = pdfData.text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    rawRows = attemptTabularExtraction(lines);
    if (rawRows.length === 0) {
      throw new Error('PDF dosyasından tablo verisi çıkarılamadı.');
    }
  }
  else if (mimeType.includes('wordprocessingml') || fileNameLower.endsWith('.docx')) {
    const docxData = await mammoth.extractRawText({ buffer });
    const lines = docxData.value.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    rawRows = attemptTabularExtraction(lines);
    if (rawRows.length === 0) {
      throw new Error('DOCX dosyasından tablo verisi çıkarılamadı.');
    }
  }
  else {
    throw new Error('Desteklenmeyen dosya formatı');
  }

  const { records, validation } = validateAndParseRows(rawRows);

  if (!validation.isValid) {
    throw new Error('Veri doğrulama başarısız. Lütfen dosyayı kontrol edin.');
  }

  return { records, validation };
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
