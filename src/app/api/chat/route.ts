import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { AIChatResponseSchema } from '../../../lib/zod-schemas';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, message: 'API key missing.' }, { status: 500 });
    }

    const body = await req.json();
    const { prompt, biContext, aiAnalysis, history } = body;

    if (!prompt || !biContext) {
      return NextResponse.json({ success: false, message: 'Missing prompt or context.' }, { status: 400 });
    }

    const systemPrompt = `
You are a highly professional Enterprise AI Business Analyst answering a user's question about their data.

ZERO HALLUCINATION POLICY:
- NEVER invent or calculate financial metrics (Revenue, Cost, Profit, Margin, etc.) that are not in the context.
- If the question asks for a calculation or metric that is unavailable, explicitly say: "Insufficient data" or explain what is missing.
- When asked "What is my profit?" or similar, retrieve the deterministic 'netProfit' or 'grossProfit' from the metrics, do not calculate it yourself.
- Base ALL answers exclusively on the provided Business Intelligence Context and existing AI Analysis.

BUSINESS INTELLIGENCE CONTEXT:
${JSON.stringify(biContext)}

EXISTING AI ANALYSIS SUMMARY:
${aiAnalysis?.executiveSummary || 'No analysis available'}

OUTPUT FORMAT:
Return a raw JSON object EXACTLY matching this schema:
{
  "answer": "string (the natural language answer)",
  "confidence": "High" | "Medium" | "Low" | "Unknown",
  "evidence": ["string"],
  "dataLimitations": ["string"],
  "recommendation": "string" | null
}
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: prompt }
    ];

    let jsonText = '';

    if (process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      // Gemini format conversion
      const geminiMessages = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : m.role === 'system' ? 'user' : 'user', // Basic map
        parts: [{ text: m.content }]
      }));
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!res.ok) {
        throw new Error('Gemini API Error: ' + await res.text());
      }
      const resData = await res.json();
      jsonText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    } else {
      const openai = new OpenAI({ apiKey: apiKey });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages as any,
        response_format: { type: "json_object" }
      });
      jsonText = response.choices[0]?.message?.content || '{}';
    }

    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedContent = JSON.parse(jsonText);
    
    if (parsedContent) {
      return NextResponse.json({ success: true, answer: parsedContent });
    } else {
      return NextResponse.json({ success: false, message: 'AI failed to format response.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
