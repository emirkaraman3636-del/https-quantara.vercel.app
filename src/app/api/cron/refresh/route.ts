import { NextResponse } from 'next/server';
import { runScheduledRefresh } from '@/lib/refresh/scheduler';

export async function GET(request: Request) {
  try {
    // 1. Cron Security Validation
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Validate Bearer token exactly matches CRON_SECRET. Fail closed if missing.
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized Cron Request' }, { status: 401 });
    }

    // 2. Fetch projects/data sources that need refreshing (Mocked for now since DB structure is frozen)
    // In production, this would query Prisma for active projects with auto-refresh enabled.
    const mockUserId = 'SYSTEM_CRON';
    const mockOrgId = 'SYSTEM_ORG';
    const mockProjectId = 'b457e284-29b3-480d-b716-f84a117866bb'; // Example Project
    const mockCsv = 'Ürün,Tarih,Fiyat,Adet\nAutoProduct,2026-08-11,750,1';
    const mockDataUri = `data:text/csv;base64,${Buffer.from(mockCsv).toString('base64')}`;

    // 3. Trigger the isolated Phase 6.6 pipeline
    const result = await runScheduledRefresh(
      mockUserId,
      mockOrgId,
      mockProjectId,
      mockDataUri,
      'text/csv',
      'cron_automated_refresh.csv'
    );

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Failed to run automated refresh', details: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
