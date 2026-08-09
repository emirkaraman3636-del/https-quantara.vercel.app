import { NextResponse } from 'next/server';
import { generateAIInsights } from '@/lib/server-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { summary } = body;

    if (!summary) {
      return NextResponse.json(
        { success: false, message: 'Analytics summary is required' },
        { status: 400 }
      );
    }

    const updatedSummary = await generateAIInsights(summary);

    return NextResponse.json({
      success: true,
      summary: updatedSummary
    });
  } catch (error: unknown) {
    console.error('Error in /api/ai-insights:', error);
    return NextResponse.json(
      { success: false, message: (error instanceof Error ? error.message : String(error)) || 'Server error generating AI insights' },
      { status: 500 }
    );
  }
}
