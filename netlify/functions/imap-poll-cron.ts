import type { Config } from "@netlify/functions";

/**
 * Netlify Scheduled Function — triggers the IMAP poll API route every minute.
 * Set CRON_SECRET + APP_URL env vars in the Netlify dashboard.
 */
export default async function handler() {
  const appUrl = process.env.APP_URL ?? process.env.URL;
  if (!appUrl) {
    console.error("[imap-cron] APP_URL env var not set");
    return;
  }

  const headers: HeadersInit = { "Content-Type": "application/json" };
  const secret = process.env.CRON_SECRET;
  if (secret) {
    headers["Authorization"] = `Bearer ${secret}`;
  }

  const res = await fetch(`${appUrl}/api/cron/imap-poll`, { headers });
  const data = await res.json();
  console.log("[imap-cron] result:", JSON.stringify(data));
}

export const config: Config = {
  schedule: "* * * * *",
};
