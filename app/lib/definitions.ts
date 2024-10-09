// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
export interface ConnectionConfig {
  database: string;
  port?: number;
  host?: string;
  user?: string;
  password?: string;
  ssl?: boolean;
}


export interface PostProps {
  doc_id: number;
  url: string;
  title: string;
  meta?: {
    iso3: string[];
  };
  updated?: string;
  snippets?: string;
  base?: string;
}