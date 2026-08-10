'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  SalesRecord,
  ValidationResult,
  AnalyticsSummary,
  ActiveTab
} from '../lib/types';
import { AIExecutiveSummary, AutoInsight } from '../lib/ai-types';
import { ForecastSummary } from '../lib/forecast-types';
import { InventorySummary } from '../lib/inventory-types';
import { INITIAL_SAMPLE_RECORDS } from '../lib/sample-data';
import { calculateAnalytics } from '../lib/data-parser';
import { generateAIExecutiveSummary } from '../lib/ai-engine';
import { generateSalesForecast } from '../lib/forecast-engine';
import { generateInventoryIntelligence } from '../lib/inventory-engine';
import { DatasetSchema, DataQualityReport, BusinessIntelligenceContext, AIBusinessAnalysis } from '../lib/dynamic-types';

interface DataContextType {
  records: SalesRecord[];
  filteredRecords: SalesRecord[];
  analytics: AnalyticsSummary;
  aiSummary: AIExecutiveSummary;
  forecastSummary: ForecastSummary;
  inventorySummary: InventorySummary;
  validation: ValidationResult | null;
  rawRows: Record<string, unknown>[];
  dynamicSchema: DatasetSchema | null;
  biContext: BusinessIntelligenceContext | null;
  dataQuality: DataQualityReport | null;
  aiAnalysis: AIBusinessAnalysis | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  uploadedFileName: string | null;
  datasetId: string;
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
  const [rawRows, setRawRows] = useState<Record<string, unknown>[]>([]);
  const [dynamicSchema, setDynamicSchema] = useState<DatasetSchema | null>(null);
  const [biContext, setBiContext] = useState<BusinessIntelligenceContext | null>(null);
  const [dataQuality, setDataQuality] = useState<DataQualityReport | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [datasetId, setDatasetId] = useState<string>('demo-initial-dataset');
  const [activeTab, setActiveTab] = useState<ActiveTab>('executive-summary');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [aiNonce, setAiNonce] = useState<number>(0);

  const [serverAiInsights, setServerAiInsights] = useState<Record<string, unknown> | null>(null);
  const [serverAutoInsights, setServerAutoInsights] = useState<AutoInsight[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIBusinessAnalysis | null>(null);

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
    const summary = generateAIExecutiveSummary(
      filteredRecords,
      analytics,
      uploadedFileName || 'Enterprise Sales Dataset'
    );
    if (serverAiInsights) {
      summary.chartInsights = serverAiInsights;
    }
    if (serverAutoInsights && serverAutoInsights.length > 0) {
      summary.autoInsights = serverAutoInsights;
    }
    return summary;
  }, [filteredRecords, analytics, uploadedFileName, aiNonce, serverAiInsights, serverAutoInsights]);

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

  const regenerateAISummary = async () => {
    try {
      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: analytics })
      });
      const data = await res.json();
      if (data.success && data.summary) {
        if (data.summary.chartInsights) setServerAiInsights(data.summary.chartInsights);
        if (data.summary.autoInsights) setServerAutoInsights(data.summary.autoInsights);
      }
    } catch (e) {
      console.error('Error fetching AI insights from server:', e);
    }
    setAiNonce(prev => prev + 1);
  };

  // File Upload Processor: Sends file to Backend API /api/parse-file after purging previous state
  const uploadFile = async (file: File): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    // 1. Immediately PURGE previous state & generate unique dataset ID
    const newDatasetId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setRecords([]);
    setRawRows([]);
    setDynamicSchema(null);
    setBiContext(null);
    setDataQuality(null);
    setValidation(null);
    setUploadedFileName(file.name);
    setDatasetId(newDatasetId);
    setSelectedCategory('All');
    setServerAiInsights(null);
    setServerAutoInsights([]);
    setAiAnalysis(null);

    try {
      // 2. Post file to backend API endpoint /api/parse-file
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-file', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      setIsLoading(false);

      const rawRowsList = Array.isArray(data.rawRows) ? data.rawRows : (Array.isArray(data.records) ? data.records : []);
      const hasValidData = data.success === true && rawRowsList.length > 0;

      if (hasValidData) {
        setRecords(rawRowsList);
        setRawRows(rawRowsList);
        setValidation(data.validation || null);
        setUploadedFileName(data.fileName);
        setDatasetId(data.datasetId || newDatasetId);
        if (data.analytics?.chartInsights) {
          // If the backend sends the new AIBusinessAnalysis format
          if (data.analytics.chartInsights.executiveSummary) {
            setAiAnalysis(data.analytics.chartInsights as AIBusinessAnalysis);
          } else {
            setServerAiInsights(data.analytics.chartInsights);
          }
        }
        if (data.analytics?.autoInsights) {
          setServerAutoInsights(data.analytics.autoInsights);
        }
        
        // Phase 2 Dynamic Extracted Fields
        if (data.dynamicSchema) setDynamicSchema(data.dynamicSchema);
        if (data.biContext) setBiContext(data.biContext);
        if (data.dataQuality) setDataQuality(data.dataQuality);

        // Automatically switch to smart-dashboard if dynamicSchema or biContext is present
        if (data.dynamicSchema || data.biContext) {
          setActiveTab('smart-dashboard');
        }

        return {
          success: true,
          message: data.message || `Successfully processed ${rawRowsList.length} records from backend upload.`
        };
      } else {
        setRecords([]);
        setRawRows([]);
        setDynamicSchema(null);
        setBiContext(null);
        setDataQuality(null);
        setValidation(data.validation || null);
        setUploadedFileName(file.name);
        return {
          success: false,
          message: data.message || `Failed to read file "${file.name}". File is empty or unreadable.`
        };
      }
    } catch (err) {
      const error = err as Error;
      setIsLoading(false);
      setRecords([]);
      setRawRows([]);
      setDynamicSchema(null);
      setBiContext(null);
      setDataQuality(null);
      setValidation(null);
      setAiAnalysis(null);
      return {
        success: false,
        message: `Upload Error: ${error.message || 'Failed to send file to server.'}`
      };
    }
  };

  const resetToSampleData = () => {
    const sampleId = `demo-${Date.now()}`;
    setRecords(INITIAL_SAMPLE_RECORDS);
    setRawRows(INITIAL_SAMPLE_RECORDS as Record<string, unknown>[]);
    setDynamicSchema(null);
    setBiContext(null);
    setDataQuality(null);
    setValidation(null);
    setAiAnalysis(null);
    setUploadedFileName(null);
    setDatasetId(sampleId);
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
        rawRows,
        dynamicSchema,
        biContext,
        dataQuality,
        aiAnalysis,
        activeTab,
        setActiveTab,
        uploadedFileName,
        datasetId,
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
