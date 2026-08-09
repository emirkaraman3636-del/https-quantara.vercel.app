import { prisma } from '../prisma';

export async function sendNotification(
  userId: string,
  orgId: string,
  projectId: string,
  status: 'SUCCESS' | 'ERROR',
  details: string
) {
  console.log(`[Notification] Project ${projectId} refresh ${status}: ${details}`);
  
  // We log this to the AuditLog to keep a persistent record of the refresh outcome.
  await prisma.auditLog.create({
    data: {
      userId,
      orgId,
      action: `DATA_REFRESH_${status}`,
      details: {
        projectId,
        message: details,
        timestamp: new Date().toISOString()
      }
    }
  });
}
