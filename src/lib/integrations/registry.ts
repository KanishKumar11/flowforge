export type IntegrationType = "oauth2" | "apiKey" | "basic";

export interface IntegrationDef {
  id: string;
  name: string;
  description: string;
  type: IntegrationType;
  icon: string; // Lucide icon name or image URL

  // OAuth specific
  scopes?: string[];
  tokenUrl?: string;
  authUrl?: string;

  // Operations
  operations: {
    id: string;
    name: string;
    description?: string;
    args: Record<string, { type: string; label: string; required?: boolean }>;
  }[];
}

export const integrations: Record<string, IntegrationDef> = {
  slack: {
    id: "slack",
    name: "Slack",
    description: "Send messages and manage channels in Slack workspace",
    type: "oauth2",
    icon: "MessageSquare",
    scopes: ["chat:write", "channels:read", "channels:join"],
    operations: [
      {
        id: "send_message",
        name: "Send Message",
        description: "Post a message to a channel",
        args: {
          channel: {
            type: "string",
            label: "Channel ID or Name",
            required: true,
          },
          message: { type: "string", label: "Message Text", required: true },
        },
      },
      {
        id: "list_channels",
        name: "List Channels",
        description: "Get a list of public channels",
        args: {
          exclude_archived: { type: "boolean", label: "Exclude Archived" },
        },
      },
    ],
  },

  google_sheets: {
    id: "google_sheets",
    name: "Google Sheets",
    description: "Read, write, and manage Google Spreadsheets",
    type: "oauth2",
    icon: "Table",
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
    operations: [
      {
        id: "append_row",
        name: "Append Row",
        description: "Add a new row to a sheet",
        args: {
          spreadsheetId: {
            type: "string",
            label: "Spreadsheet ID",
            required: true,
          },
          range: { type: "string", label: "Sheet Name/Range", required: true },
          values: { type: "json", label: "Row Values (Array)", required: true },
        },
      },
      {
        id: "read_rows",
        name: "Read Rows",
        description: "Read data from a sheet",
        args: {
          spreadsheetId: {
            type: "string",
            label: "Spreadsheet ID",
            required: true,
          },
          range: { type: "string", label: "Range (A1:B10)", required: true },
        },
      },
    ],
  },

  github: {
    id: "github",
    name: "GitHub",
    description: "Manage issues, pull requests, and repositories",
    type: "oauth2", // Can also be PAT (personal access token)
    icon: "Github",
    scopes: ["repo", "user"],
    operations: [
      {
        id: "create_issue",
        name: "Create Issue",
        description: "Create a new issue in a repository",
        args: {
          owner: { type: "string", label: "Repository Owner", required: true },
          repo: { type: "string", label: "Repository Name", required: true },
          title: { type: "string", label: "Issue Title", required: true },
          body: { type: "string", label: "Issue Body" },
        },
      },
      {
        id: "list_issues",
        name: "List Issues",
        description: "List issues in a repository",
        args: {
          owner: { type: "string", label: "Repository Owner", required: true },
          repo: { type: "string", label: "Repository Name", required: true },
          state: { type: "string", label: "State (open/closed)" },
        },
      },
    ],
  },

  notion: {
    id: "notion",
    name: "Notion",
    description: "Create pages and query databases in Notion",
    type: "oauth2",
    icon: "FileText",
    scopes: [], // Notion uses internal integrations usually, but supports public oauth
    operations: [
      {
        id: "create_page",
        name: "Create Page",
        description: "Create a new page in a database",
        args: {
          databaseId: { type: "string", label: "Database ID", required: true },
          properties: {
            type: "json",
            label: "Properties (JSON)",
            required: true,
          },
        },
      },
      {
        id: "query_database",
        name: "Query Database",
        description: "Query a database with filters",
        args: {
          databaseId: { type: "string", label: "Database ID", required: true },
          filter: { type: "json", label: "Filter (JSON)" },
        },
      },
    ],
  },
};
