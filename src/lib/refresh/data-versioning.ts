import { prisma } from '../prisma';

export async function createNewVersion(
  projectId: string,
  fileName: string,
  fileUrl: string,
  fileType: string,
  sizeBytes: number
) {
  // Check if there is an existing dataset with this name or just create a new Dataset
  // The system currently creates a new Dataset per upload in the route, so we will emulate that
  // for non-breaking compatibility.
  
  const dataset = await prisma.dataset.create({
    data: {
      projectId,
      name: fileName,
      fileUrl,
      fileType,
      sizeBytes
    }
  });

  return dataset;
}
