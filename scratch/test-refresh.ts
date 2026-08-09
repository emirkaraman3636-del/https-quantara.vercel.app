import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const { prisma } = require('../src/lib/prisma');
const { runScheduledRefresh } = require('../src/lib/refresh/scheduler');

async function testRefresh() {
  console.log('Testing Phase 6.6 Automated Refresh Pipeline');

  try {
    // We need a dummy organization, user, workspace and project
    const org = await prisma.organization.create({ data: { name: 'Refresh Org' } });
    const user = await prisma.user.create({ data: { id: `refresh_user_${Date.now()}`, email: `refresh_${Date.now()}@test.com`, orgId: org.id } });
    const ws = await prisma.workspace.create({ data: { name: 'Refresh WS', orgId: org.id } });
    const proj = await prisma.project.create({ data: { name: 'Refresh Project', workspaceId: ws.id } });

    // Mock external CSV data using data URI
    const mockCsv = 'Ürün,Tarih,Fiyat,Adet\nTestUrun,2026-08-10,500,2';
    const dataUri = `data:text/csv;base64,${Buffer.from(mockCsv).toString('base64')}`;

    console.log('Triggering scheduler...');
    const result = await runScheduledRefresh(
      user.id,
      org.id,
      proj.id,
      dataUri,
      'text/csv',
      'automated_refresh.csv'
    );

    console.log('Refresh result:', result);

    if (result.success) {
      // Check database to see if dataset, analysis, and audit log were created
      const dataset = await prisma.dataset.findUnique({ where: { id: result.datasetId } });
      const analysis = await prisma.analysis.findFirst({ where: { datasetId: result.datasetId } });
      const logs = await prisma.auditLog.findMany({ where: { userId: user.id } });

      console.log('Dataset created:', !!dataset);
      console.log('Analysis created:', !!analysis);
      
      const successLog = await prisma.auditLog.findFirst({
        where: { action: 'DATA_REFRESH_SUCCESS' }
      });
      console.log('Notification AuditLog created:', !!successLog);
    }
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    process.exit(0);
  }
}

testRefresh();
