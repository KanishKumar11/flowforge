# OAuth and Platform Registration Guide ✅

This document lists the external platforms that require registration (OAuth apps or API keys), exact redirect URIs to use for this project, required scopes, and the environment variables to set. Use the localhost example for local development and replace `https://your-domain.com` with your real production domain when ready.

---

## Common redirect URIs

- Local (development): `http://localhost:3000/api/oauth/[provider]/callback`
- Production (replace domain): `https://your-domain.com/api/oauth/[provider]/callback`

Replace `[provider]` with `slack`, `google`, `github`, or `notion`.

---

## Slack (recommended) 🔧

- **Register:** Create a Slack App at https://api.slack.com/apps
- **OAuth Redirect URI:** Add both:
  - `http://localhost:3000/api/oauth/slack/callback`
  - `https://your-domain.com/api/oauth/slack/callback`
- **Scopes (required by project):** `chat:write`, `channels:read`, `channels:join`
- **Environment variables to set:**
  - `SLACK_CLIENT_ID`
  - `SLACK_CLIENT_SECRET`
  - `SLACK_BOT_TOKEN` (obtain after installing the app to your workspace)

Steps:

1. Create App → OAuth & Permissions → add scopes above
   1a. (Optional) Create the app **from a manifest** using `docs/slack/manifest.yml` — Slack: _Create an app_ → _From an app manifest_ → select workspace and paste the YAML.
2. Add Redirect URIs and save
3. Install app to workspace → note `Bot User OAuth Token` (set as `SLACK_BOT_TOKEN`)
4. Copy **Client ID** and **Client Secret** into your `.env.local`

---

## Google (Sheets + Gemini / Generative) 🌐

- **Register:** Google Cloud Console - create a project and OAuth 2.0 Client ID at https://console.cloud.google.com/apis/credentials
- **APIs to enable (for Sheets):** Google Sheets API, Google Drive API
- **OAuth Redirect URI:**
  - `http://localhost:3000/api/oauth/google/callback`
  - `https://your-domain.com/api/oauth/google/callback`
- **Scopes (Sheets):**
  - `https://www.googleapis.com/auth/spreadsheets`
  - `https://www.googleapis.com/auth/drive.file`
- **Environment variables to set:**
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_GENERATIVE_AI_API_KEY` (for Gemini / Google Generative API)
  - `GOOGLE_API_KEY` (optional)

Steps:

1. Create project → Enable APIs (Sheets, Drive, Generative API as needed)
2. Configure OAuth consent screen (external/internal), add authorized domains
3. Create OAuth Client ID and add redirect URIs above
4. Obtain client ID and secret and set in `.env.local`
5. For Gemini/Generative, create an API key in the Cloud Console and set `GOOGLE_GENERATIVE_AI_API_KEY`

---

## GitHub 🐙

- **Register:** Create an OAuth App at https://github.com/settings/developers or create a GitHub App depending on needs
- **Authorization callback URL:**
  - `http://localhost:3000/api/oauth/github/callback`
  - `https://your-domain.com/api/oauth/github/callback`
- **Scopes used by project:** `repo`, `user` (adjust if you only need a narrower set)
- **Environment variables to set:**
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`

Steps:

1. Create OAuth App → set callback URL(s)
2. Add the app credentials (`Client ID` and `Client Secret`) to `.env.local`

---

## Notion 🗂️

- **Register:** Notion Integrations at https://www.notion.so/my-integrations
- **Redirect URI (if using public OAuth):**
  - `http://localhost:3000/api/oauth/notion/callback`
  - `https://your-domain.com/api/oauth/notion/callback`
- **Notes:** Notion often uses internal integration tokens (`NOTION_KEY`). Public OAuth is supported but requires additional configuration.
- **Environment variables to set:**
  - `NOTION_CLIENT_ID` (if using OAuth)
  - `NOTION_CLIENT_SECRET` (if using OAuth)
  - `NOTION_KEY` (integration token for direct API access)

Steps:

1. Create an integration in Notion → obtain internal integration key (`NOTION_KEY`) or register a public OAuth app (client id/secret)
2. Share the target database/page with the integration (important)
3. Add keys to `.env.local`

---

## Verification / Smoke test ✅

- After adding credentials to `.env.local`, restart the app and navigate to: `/credentials` or use the "Connect" buttons in the app to run a quick OAuth flow.
- For Slack/GitHub/Google/Notion, try the provider "Connect" flow and confirm a credential record is created under **Credentials** in the UI.
- OpenAI / Google Gemini nodes now support selecting a **Credential** on the node configuration (Credential dropdown). If you add your API key as a Credential (type `apiKey`), select it in the node and the runtime will resolve `credentialId` to an API key automatically (fallback order: env var → node `apiKey` → selected `Credential`).
- Check server logs and the OAuth callback endpoints tests (already present in repo) if something fails.

---

## Notes & Help

If you want, I can:

- Prepare a PR that adds these steps to `project_documentation.md` and an `OAUTH_SETUP.md` (this file) ✔️
- Add example `.env.local` entries (without secrets) and a checklist of which variables are still missing
- Draft the exact OAuth app settings (what to paste into provider forms) for each provider

Tell me which of the above you want me to do next and I’ll proceed. ✨
