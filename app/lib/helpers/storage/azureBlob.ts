import { BlobServiceClient } from "@azure/storage-blob";

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || "";

if (!CONNECTION_STRING) {
  // We don't throw at import time in case environment isn't available in some dev flows,
  // but functions will check and throw when used.
}

export async function uploadToAzureBlob(
  data: ArrayBuffer | Buffer | Uint8Array,
  filename: string,
  containerName = "sdgcommons",
  contentType?: string
): Promise<string> {
  if (!CONNECTION_STRING) {
    throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING environment variable")
  }

  const serviceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING)
  const containerClient = serviceClient.getContainerClient(containerName)

  // create container if it does not exist (public read access to blobs)
  await containerClient.createIfNotExists({ access: "container" })

  // sanitize filename and make it reasonably unique
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${String(
    filename
  ).replace(/[^a-zA-Z0-9.\-_]/g, "_")}`

  const blockBlobClient = containerClient.getBlockBlobClient(safeName)

  const uploadOptions: any = {}
  if (contentType) {
    uploadOptions.blobHTTPHeaders = { blobContentType: contentType }
  }

  // upload the binary data
  // Accept ArrayBuffer / Buffer / Uint8Array
  await blockBlobClient.uploadData(data as any, uploadOptions)

  return blockBlobClient.url
}
