import { parseBuffer } from './parser-trigger';
import { createNewVersion } from './data-versioning';
import { rebuildAnalysis } from './analysis-rebuild';
import { sendNotification } from './notification';

export async function executeRefreshWorker(
  userId: string,
  orgId: string,
  projectId: string,
  dataSourceUrl: string,
  mimeType: string,
  fileName: string
) {
  try {
    // 1. Fetch external data
    const response = await fetch(dataSourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from source: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Parser Trigger
    const { records, validation } = await parseBuffer(buffer, mimeType, fileName);

    if (!validation.isValid) {
      throw new Error('Data validation failed after fetch.');
    }

    // 3. Data Versioning (Create a new Dataset Snapshot)
    const dataset = await createNewVersion(
      projectId,
      fileName,
      dataSourceUrl,
      mimeType,
      buffer.length
    );

    // 4. Analysis Rebuild
    await rebuildAnalysis(projectId, dataset.id, records);

    // 5. Notification
    await sendNotification(userId, orgId, projectId, 'SUCCESS', `Data refreshed from ${dataSourceUrl} with ${records.length} records.`);
    
    return { success: true, datasetId: dataset.id };
  } catch (error: unknown) {
    console.error(`Refresh worker failed for project ${projectId}:`, error);
    await sendNotification(userId, orgId, projectId, 'ERROR', (error instanceof Error ? error.message : String(error)) || 'Unknown error');
    return { success: false, error: (error instanceof Error ? error.message : String(error)) };
  }
}
