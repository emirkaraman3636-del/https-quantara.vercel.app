import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export async function parseFileBuffer(buffer: Buffer, mimeType: string, filename: string): Promise<Record<string, unknown>[]> {
  try {
    const isCsv = mimeType === 'text/csv' || filename.toLowerCase().endsWith('.csv');
    const isExcel = mimeType.includes('spreadsheetml') || mimeType.includes('excel') || filename.toLowerCase().endsWith('.xlsx') || filename.toLowerCase().endsWith('.xls');

    if (isCsv) {
      // Handle CSV
      // Convert buffer to string, handle potential UTF-8 BOM
      let csvString = buffer.toString('utf-8');
      if (csvString.charCodeAt(0) === 0xFEFF) {
        csvString = csvString.slice(1);
      }

      return new Promise((resolve, reject) => {
        Papa.parse(csvString, {
          header: true,
          skipEmptyLines: 'greedy',
          dynamicTyping: true, // Auto convert numbers and booleans
          complete: (results) => {
            if (results.errors.length > 0 && results.data.length === 0) {
              reject(new Error(`CSV Parse Error: ${results.errors[0].message}`));
            } else {
              resolve(results.data as Record<string, unknown>[]);
            }
          },
          error: (error: Error) => {
            reject(error);
          }
        });
      });
    } else if (isExcel) {
      // Handle Excel
      const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
      if (workbook.SheetNames.length === 0) {
        throw new Error("Excel file is empty");
      }
      
      // We will parse the first non-empty sheet
      let rawRows: Record<string, unknown>[] = [];
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        if (rawRows.length > 0) {
          break; // Found our data sheet
        }
      }
      
      return rawRows;
    } else {
      throw new Error("Unsupported file format. Please upload CSV or Excel files.");
    }
  } catch (err: unknown) {
    console.error("File parsing error:", err);
    throw new Error(`Failed to parse file: ${(err instanceof Error ? err.message : String(err)) || 'Unknown error'}`);
  }
}
