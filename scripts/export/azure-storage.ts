// Azure Blob Storage operations

import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';

/**
 * Upload a readable stream directly to Azure Blob Storage
 * @param readable - The readable stream to upload
 * @param destName - The destination blob name
 * @param contentType - Optional content type for the blob
 * @returns The URL to access the uploaded blob
 */
export async function uploadStreamToAzure(
  readable: any,
  destName: string,
  contentType?: string
): Promise<string> {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!conn) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured');
  }

  const client = BlobServiceClient.fromConnectionString(conn);
  const containerName = process.env.AZURE_EXPORT_CONTAINER || 'exports';
  const container = client.getContainerClient(containerName);
  
  await container.createIfNotExists().catch(() => {});
  
  const block = container.getBlockBlobClient(destName);
  const bufferSize = 4 * 1024 * 1024; // 4MB
  const maxConcurrency = 5;

  const uploadOptions: any = {};
  if (contentType) {
    uploadOptions.blobHTTPHeaders = { blobContentType: contentType };
  }

  await block.uploadStream(readable as any, bufferSize, maxConcurrency, uploadOptions);

  // Build return URL (prefer env SAS token, otherwise attempt to generate per-blob SAS)
  let returnUrl = block.url;
  
  if (process.env.AZURE_EXPORT_SAS_TOKEN) {
    returnUrl = `${block.url}?${process.env.AZURE_EXPORT_SAS_TOKEN}`;
    console.log('Uploaded stream to Azure (with provided SAS token):', destName, returnUrl);
    return returnUrl;
  }

  try {
    const m = String(conn).match(/AccountName=([^;]+);AccountKey=([^;]+);/);
    if (m) {
      const account = m[1];
      const accountKey = m[2];
      const sharedKey = new StorageSharedKeyCredential(account, accountKey);
      const expiresOn = new Date(Date.now() + 24 * 3600 * 1000);
      const sas = generateBlobSASQueryParameters({
        containerName,
        blobName: destName,
        permissions: BlobSASPermissions.parse('r'),
        startsOn: new Date(Date.now() - 5 * 60 * 1000),
        expiresOn,
      }, sharedKey).toString();
      returnUrl = `${block.url}?${sas}`;
      console.log('Uploaded stream to Azure (generated SAS):', destName, returnUrl);
      return returnUrl;
    }
  } catch (e) {
    console.warn('Failed to generate SAS token (stream), returning raw blob URL', String((e as any)?.message || e));
  }

  console.log('Uploaded stream to Azure (raw URL):', destName, returnUrl);
  return returnUrl;
}
