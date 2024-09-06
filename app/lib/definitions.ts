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
