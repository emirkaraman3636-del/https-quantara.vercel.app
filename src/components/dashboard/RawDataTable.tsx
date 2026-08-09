import React, { useState } from 'react';
import { DatasetSchema } from '../../lib/dynamic-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RawDataTableProps {
  schema: DatasetSchema;
  rawRows: Record<string, unknown>[];
}

export function RawDataTable({ schema, rawRows }: RawDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (!rawRows || rawRows.length === 0 || !schema?.columns) {
    return null;
  }

  const totalPages = Math.ceil(rawRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = rawRows.slice(startIndex, startIndex + rowsPerPage);

  const formatCellValue = (value: unknown) => {
    if (value === null || value === undefined) return <span className="text-slate-500 italic">null</span>;
    if (value === '') return <span className="text-slate-500 italic">empty</span>;
    if (typeof value === 'boolean') return value ? 'True' : 'False';
    if (typeof value === 'object') return JSON.stringify(value);
    
    // Truncate long strings for table view
    const strVal = String(value);
    if (strVal.length > 50) return strVal.substring(0, 47) + '...';
    
    return strVal;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-700/50">
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 w-12 text-center border-r border-slate-700/50">#</th>
              {schema.columns.map(col => (
                <th key={`th-${col.name}`} className="px-4 py-3 text-xs font-semibold text-slate-300 whitespace-nowrap">
                  {col.name}
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5 capitalize">{col.semanticType}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {currentRows.map((row, idx) => (
              <tr key={`row-${startIndex + idx}`} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-2 text-xs text-slate-500 text-center border-r border-slate-800/50 font-mono">
                  {startIndex + idx + 1}
                </td>
                {schema.columns.map(col => (
                  <td key={`td-${col.name}-${idx}`} className="px-4 py-2 text-sm text-slate-300 whitespace-nowrap max-w-[200px] truncate">
                    {formatCellValue(row[col.name])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/40">
          <span className="text-xs text-slate-400">
            Toplam <strong className="text-slate-200">{rawRows.length.toLocaleString('tr-TR')}</strong> kayıttan <strong className="text-slate-200">{startIndex + 1}-{Math.min(startIndex + rowsPerPage, rawRows.length)}</strong> arası gösteriliyor.
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-50 hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-300 font-medium px-2">
              Sayfa {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-50 hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
