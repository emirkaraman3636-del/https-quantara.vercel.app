import { executeRefreshWorker } from './refresh-worker';

export async function runScheduledRefresh(
  userId: string,
  orgId: string,
  projectId: string,
  dataSourceUrl: string,
  mimeType: string,
  fileName: string
) {
  console.log(`[Scheduler] Triggering scheduled refresh for project ${projectId}`);
  
  // In a real production system, this would query a DataSource table
  // to find all active refresh jobs and push them to a queue.
  // For Phase 6.6, we trigger the worker directly.
  
  const result = await executeRefreshWorker(
    userId,
    orgId,
    projectId,
    dataSourceUrl,
    mimeType,
    fileName
  );
  
  return result;
}
