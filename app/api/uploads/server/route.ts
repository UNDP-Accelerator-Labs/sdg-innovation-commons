import { NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10MB' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!connectionString) {
      console.error('Azure connection string not configured')
      return NextResponse.json({ error: 'Azure not configured' }, { status: 500 })
    }

    const serviceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = serviceClient.getContainerClient('sdgcommons')
    
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
    const blobClient = containerClient.getBlockBlobClient(safeName)
    
    const arrayBuffer = await file.arrayBuffer()
    await blobClient.uploadData(new Uint8Array(arrayBuffer), {
      blobHTTPHeaders: {
        blobContentType: file.type
      }
    })

    const blobUrl = blobClient.url
    console.log('File uploaded:', { name: file.name, size: file.size, blobName: safeName })
    
    return NextResponse.json({ blobUrl, blobName: safeName })
    
  } catch (error) {
    console.error('Server upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed',
      details: (error as any)?.message 
    }, { status: 500 })
  }
}