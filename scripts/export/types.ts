// Type definitions for export system

export interface ExportJob {
  id: string | number;
  requester_uuid?: string;
  worker_id?: string | null;
  status: 'pending' | 'processing' | 'done' | 'failed';
  blob_url?: string | null;
  error?: string | null;
  params?: Record<string, any>;
  created_at?: Date | string;
  updated_at?: Date | string;
  expires_at?: Date | string;
  last_heartbeat?: Date | string;
}

export interface ExportParams {
  dbKeys?: string[];
  format?: string;
  excludePii?: boolean;
  requester_email?: string;
  [key: string]: any;
}

export interface ProcessedExport {
  blobUrl: string;
  outFiles: string[];
}

export interface UserInfo {
  uuid: string;
  name?: string;
  email?: string;
  iso3?: string;
}
