// 'use server';
import nodemailer from "nodemailer";
import { query as dbQuery } from "@/app/lib/db";

//Environment variables
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  ADMIN_EMAILS,
  SMTP_SERVICE,
  NODE_ENV,
} = process.env;

//Email function
export async function sendEmail(
  to: string,
  cc: string | null | undefined,
  subject: string,
  html: string
) {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP configuration is missing. Email not sent.");
    return;
  }

  const transportOptions: any = SMTP_SERVICE
    ? { service: SMTP_SERVICE, auth: { user: SMTP_USER, pass: SMTP_PASS } }
    : {
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      };

  const transporter = nodemailer.createTransport(transportOptions);

  let mailOptions: nodemailer.SendMailOptions = {
    from: `"SDG Innovation Commons" <${SMTP_USER}>`,
    to,
    subject,
    html,
  };

  if (cc) {
    mailOptions = { ...mailOptions, cc };
  }

  try {
    if (NODE_ENV === "production") {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(
        "Email content (not sent in non-production environment):",
        mailOptions
      );
    }
    console.log(`Email sent to ${to} with subject "${subject}"`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

/**
 * Helper to ensure array format
 */
export function safeArr(arr: any[], defaultVal: string): string[] {
  return arr && arr.length > 0 ? arr : [defaultVal];
}

/**
 * Count occurrences in array and return aggregated data
 */
export function countArray(
  data: any[],
  options: { key?: string; keyname: string; keep?: string[] }
) {
  const { key = "id", keyname, keep = [] } = options;
  const counts = new Map<any, any>();

  data.forEach((item) => {
    const itemKey = key ? item[key] : item;
    if (!counts.has(itemKey)) {
      const newItem: any = { [keyname]: itemKey, count: 0 };
      keep.forEach((k) => {
        if (item[k] !== undefined) newItem[k] = item[k];
      });
      counts.set(itemKey, newItem);
    }
    counts.get(itemKey)!.count++;
  });

  return Array.from(counts.values());
}

/**
 * Join arrays by matching IDs
 */
export function multiJoin(
  mainArray: any[],
  joinArrays: [any[], string][]
): any[] {
  return mainArray.map((mainItem) => {
    const joined = { ...mainItem };
    joinArrays.forEach(([arr, key]) => {
      const match = arr.find((item) => item[key] === mainItem[key]);
      if (match) Object.assign(joined, match);
    });
    return joined;
  });
}

/**
 * Platform mapping: frontend platform names to database shortkeys
 */
export const PLATFORM_MAP: { [key: string]: string } = {
  solution: "sm",
  experiment: "exp",
  "action plan": "ap",
  actionplan: "ap",
  insight: "blogs",
  login: "login",
  consent: "consent",
  codification: "codification",
  signal: "signal",
  global: "global",
};

/**
 * Reverse platform mapping: database shortkeys to frontend platform names
 */
export const PLATFORM_REVERSE_MAP: { [key: string]: string } = {
  sm: "solution",
  exp: "experiment",
  ap: "action plan",
  blogs: "insight",
  login: "login",
  consent: "consent",
  codification: "codification",
  signal: "signal",
  global: "global",
};

/**
 * Map platform name to database shortkey
 */
export function mapPlatformToShortkey(platform: string): string {
  return PLATFORM_MAP[platform] || platform;
}

/**
 * Map multiple platforms to database shortkeys
 */
export function mapPlatformsToShortkeys(
  platforms: string | string[]
): string[] {
  const platformArr = Array.isArray(platforms) ? platforms : [platforms];
  return platformArr.map((p) => mapPlatformToShortkey(p));
}

/**
 * Map database shortkey to platform name
 */
export function mapShortkeyToPlatform(shortkey: string): string {
  return PLATFORM_REVERSE_MAP[shortkey] || shortkey;
}

const CACHE_TTL = 1000 * 60 * 60 * 60 * 1; // 1 day
let CACHE_TS = 0;
let CACHE_MAP: Map<string, number> = new Map();

export async function loadExternDb() {
  if (Date.now() - CACHE_TS < CACHE_TTL && CACHE_MAP.size > 0) return CACHE_MAP;
  try {
    const res = await dbQuery("general", "SELECT id, db FROM extern_db");
    const rows = res?.rows || [];
    const m = new Map<string, number>();
    rows.forEach((r: any) => {
      if (r.db) m.set(String(r.db).toLowerCase(), r.id);
    });
    CACHE_MAP = m;
    CACHE_TS = Date.now();
    return CACHE_MAP;
  } catch (error) {
    console.error("loadExternDb error:", error);
    return CACHE_MAP;
  }
}

export async function getExternDbIdForPlatform(
  platformName: string
): Promise<number | null> {
  if (!platformName) return null;
  const short = mapPlatformToShortkey(platformName);
  const key = String(short).toLowerCase();
  const map = await loadExternDb();
  return map.get(key) ?? null;
}
