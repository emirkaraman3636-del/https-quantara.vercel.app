'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import {
  SalesRecord,
  ValidationResult,
  AnalyticsSummary,
  ActiveTab
} from '../lib/types';
import { AIExecutiveSummary } from '../lib/ai-types';
import { ForecastSummary } from '../lib/forecast-types';
import { InventorySummary } from '../lib/inventory-types';
import { INITIAL_SAMPLE_RECORDS } from '../lib/sample-data';
import { validateAndParseRows, calculateAnalytics } from '../lib/data-parser';
import { generateAIExecutiveSummary } from '../lib/ai-engine';
import { generateSalesForecast } from '../lib/forecast-engine';
import { generateInventoryIntelligence } from '../lib/inventory-engine';

interface DataContextType {
  records: SalesRecord[];
  filteredRecords: SalesRecord[];
  analytics: AnalyticsSummary;
  aiSummary: AIExecutiveSummary;
  forecastSummary: ForecastSummary;
  inventorySummary: InventorySummary;
  validation: ValidationResult | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  uploadedFileName: string | null;
  isLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  uploadFile: (file: File) => Promise<{ success: boolean; message: string }>;
  resetToSampleData: () => void;
  regenerateAISummary: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<SalesRecord[]>(INITIAL_SAMPLE_RECORDS);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [aiNonce, setAiNonce] = useState<number>(0);

  // Load theme preference or set dark mode class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Filter records based on active category selection
  const filteredRecords = useMemo(() => {
    if (selectedCategory === 'All') return records;
    return records.filter(r => r.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [records, selectedCategory]);

  // Recalculate dynamic analytics automatically whenever filtered records update
  const analytics = useMemo(() => {
    return calculateAnalytics(filteredRecords);
  }, [filteredRecords]);

  // Recalculate AI Executive Summary dynamically whenever records or analytics update
  const aiSummary = useMemo(() => {
    return generateAIExecutiveSummary(
      filteredRecords,
      analytics,
      uploadedFileName || 'Enterprise Sales Dataset'
    );
  }, [filteredRecords, analytics, uploadedFileName, aiNonce]);

  // Recalculate Sales Forecast dynamically whenever records or analytics update
  const forecastSummary = useMemo(() => {
    return generateSalesForecast(
      filteredRecords,
      analytics,
      uploadedFileName || 'Enterprise Sales Dataset'
    );
  }, [filteredRecords, analytics, uploadedFileName]);

  // Recalculate Inventory Intelligence & Reorder Points dynamically
  const inventorySummary = useMemo(() => {
    return generateInventoryIntelligence(
      filteredRecords,
      analytics,
      forecastSummary,
      uploadedFileName || 'Enterprise Sales Dataset'
    );
  }, [filteredRecords, analytics, forecastSummary, uploadedFileName]);

  const regenerateAISummary = () => {
    setAiNonce(prev => prev + 1);
  };

  // File Upload Processor for CSV and Excel (.xlsx, .xls)
  const uploadFile = async (file: File): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    return new Promise(resolve => {
      const fileExt = file.name.split('.').pop()?.toLowerCase();

      if (fileExt === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            const rawRows = results.data as any[];
            const { records: parsedRecords, validation: valResult } = validateAndParseRows(rawRows);
            
            setRecords(parsedRecords);
            setValidation(valResult);
            setUploadedFileName(file.name);
            setSelectedCategory('All');
            setIsLoading(false);

            if (valResult.isValid) {
              resolve({
                success: true,
                message: `Successfully processed ${parsedRecords.length} rows from ${file.name}`
              });
            } else {
              resolve({
                success: false,
                message: `Parsed file with warnings: Missing columns (${valResult.missingColumns.join(', ')})`
              });
            }
          },
          error: (err) => {
            setIsLoading(false);
            resolve({ success: false, message: `CSV Parsing Error: ${err.message}` });
          }
        });
      } else if (fileExt === 'xlsx' || fileExt === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            const { records: parsedRecords, validation: valResult } = validateAndParseRows(rawRows);

            setRecords(parsedRecords);
            setValidation(valResult);
            setUploadedFileName(file.name);
            setSelectedCategory('All');
            setIsLoading(false);

            resolve({
              success: true,
              message: `Successfully imported ${parsedRecords.length} sales records from Excel workbook "${file.name}"`
            });
          } catch (err: any) {
            setIsLoading(false);
            resolve({ success: false, message: `Excel Import Error: ${err.message || 'Failed to read worksheet'}` });
          }
        };
        reader.onerror = () => {
          setIsLoading(false);
          resolve({ success: false, message: 'File read error' });
        };
        reader.readAsArrayBuffer(file);
      } else {
        setIsLoading(false);
        resolve({ success: false, message: 'Unsupported file format. Please upload an Excel (.xlsx, .xls) or CSV file.' });
      }
    });
  };

  const resetToSampleData = () => {
    setRecords(INITIAL_SAMPLE_RECORDS);
    setValidation(null);
    setUploadedFileName(null);
    setSelectedCategory('All');
  };

  return (
    <DataContext.Provider
      value={{
        records,
        filteredRecords,
        analytics,
        aiSummary,
        forecastSummary,
        inventorySummary,
        validation,
        activeTab,
        setActiveTab,
        uploadedFileName,
        isLoading,
        theme,
        toggleTheme,
        selectedCategory,
        setSelectedCategory,
        uploadFile,
        resetToSampleData,
        regenerateAISummary
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
