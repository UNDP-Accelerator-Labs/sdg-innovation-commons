import { NextResponse } from 'next/server'  
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const filename = url.searchParams.get('filename') || 'file'
    const contentType = url.searchParams.get('contentType') || 'application/octet-stream'
    const containerName = url.searchParams.get('container') || 'sdgcommons'

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!connectionString) {
      return NextResponse.json({ error: 'Missing AZURE_STORAGE_CONNECTION_STRING' }, { status: 500 })
    }

    // Parse account name from connection string for URL construction
    const accountMatch = connectionString.match(/AccountName=([^;]+)/)
    const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/)
    
    if (!accountMatch || !accountKeyMatch) {
      return NextResponse.json({ error: 'Invalid Azure connection string format' }, { status: 500 })
    }

    const accountName = accountMatch[1]
    const accountKey = accountKeyMatch[1]

    const serviceClient = BlobServiceClient.fromConnectionString(connectionString)

    // ensure container exists
    const containerClient = serviceClient.getContainerClient(containerName)
    await containerClient.createIfNotExists({ access: 'container' })

    // create a safe, unique blob name
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${String(filename).replace(/[^a-zA-Z0-9.\-_]/g, '_')}`

    const expiresOn = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Create credential for SAS token generation
    const credential = new StorageSharedKeyCredential(accountName, accountKey)

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: safeName,
        permissions: BlobSASPermissions.parse('crw'), // create, read, write
        startsOn: new Date(Date.now() - 5 * 60 * 1000),
        expiresOn,
      },
      credential
    ).toString()

    const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${safeName}`
    const uploadUrl = `${blobUrl}?${sasToken}`

    return NextResponse.json({ uploadUrl, blobUrl, blobName: safeName, expiresOn: expiresOn.toISOString(), contentType })
  } catch (e) {
    console.error('Failed to create SAS URL', (e as any)?.message || e)
    return NextResponse.json({ error: 'Failed to create SAS URL' }, { status: 500 })
  }
}
