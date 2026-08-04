'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Database,
  Trash2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Ruler,
  Users,
  Bot,
  User,
  Copy,
  Check
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ChatMessage } from '../../lib/chat-types';
import { processUserQuery, SUGGESTED_PROMPTS } from '../../lib/chat-engine';

export function AIChatView() {
  const { records, analytics, aiSummary, forecastSummary, uploadedFileName } = useData();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      content:
        `Hello! I am your **Vortex AI Sales Copilot**. I am connected directly to your active dataset: **"${uploadedFileName || 'Enterprise Sales Dataset'}"** (${records.length} sales records).\n\n` +
        `Ask me any natural language question about your sales revenue, best-selling products, clothing size demand, customer accounts, or 30/60/90-day predictive forecasts!`,
      dataHighlights: [
        { label: 'Active Dataset', value: uploadedFileName || 'Enterprise Demo Data', color: 'indigo' },
        { label: 'Total Revenue', value: `$${analytics.kpis.totalRevenue.toLocaleString()}`, color: 'emerald' }
      ],
      suggestedFollowUps: [
        'Which product sold the most this month?',
        'Which size has the highest demand?',
        'Who are our top customer accounts?',
        'What is our 30-day forecast?'
      ]
    }
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (queryText?: string) => {
    const textToSubmit = queryText || inputQuery;
    if (!textToSubmit.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      content: textToSubmit
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsTyping(true);

    // Simulate real-time processing delay for AI typing effect
    setTimeout(() => {
      const chatContext = {
        records,
        analytics,
        aiSummary,
        forecastSummary,
        datasetName: uploadedFileName || 'Enterprise Sales Dataset'
      };

      const aiResponse = processUserQuery(textToSubmit, chatContext);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        content: `Conversation reset. Ready to answer new questions about **"${uploadedFileName || 'Enterprise Sales Dataset'}"** (${records.length} records).`,
        dataHighlights: [
          { label: 'Active Dataset', value: uploadedFileName || 'Enterprise Demo Data', color: 'indigo' }
        ]
      }
    ]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header Context Indicator */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-100">AI Copilot Assistant</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Live Data Connected
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Querying <span className="text-slate-200 font-medium">{uploadedFileName || 'Enterprise Demo Data'}</span> ({records.length} transactions)
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors text-xs font-semibold flex items-center gap-1.5"
          title="Clear Conversation History"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Suggested Data Questions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SUGGESTED_PROMPTS.map(sp => (
            <button
              key={sp.id}
              onClick={() => handleSend(sp.prompt)}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group flex items-start justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-mono font-semibold text-indigo-400 block mb-0.5">
                  {sp.badge}
                </span>
                <span className="text-xs text-slate-200 font-medium group-hover:text-white transition-colors">
                  "{sp.prompt}"
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 flex-shrink-0 mt-1 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Timeline */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 min-h-[420px] max-h-[550px] overflow-y-auto space-y-6">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar Icon */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gradient-to-tr from-indigo-600 to-emerald-400 text-white shadow-md'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            {/* Bubble Content */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 px-1">
                <span className="font-semibold text-slate-300">
                  {msg.role === 'user' ? 'You' : 'Vortex AI Copilot'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-200 border-slate-800 rounded-tl-none shadow-lg'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.content}</div>

                {/* Data Highlight Pills */}
                {msg.dataHighlights && msg.dataHighlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-800">
                    {msg.dataHighlights.map((dh, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                      >
                        <span className="text-slate-400">{dh.label}:</span>
                        <strong className="text-emerald-400">{dh.value}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Copy & Follow-Up Buttons */}
              {msg.role === 'assistant' && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-800/50"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  {msg.suggestedFollowUps &&
                    msg.suggestedFollowUps.map((fu, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(fu)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all"
                      >
                        "{fu}"
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Loader Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs text-slate-400 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              <span className="font-mono text-[11px] ml-1">Analyzing dataset records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask any question about your sales data (e.g. 'Which product sold the most?')"
          className="w-full pl-5 pr-14 py-3.5 text-xs sm:text-sm rounded-2xl bg-slate-900 text-slate-100 border border-slate-700 focus:outline-none focus:border-indigo-500 shadow-xl transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isTyping}
          className="absolute right-2 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
