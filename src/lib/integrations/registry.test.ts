import { describe, it, expect } from "vitest";
import { integrations } from "@/lib/integrations/registry";

describe("Integration Registry", () => {
  describe("integrations object", () => {
    it("should contain all expected providers", () => {
      const expectedProviders = ["slack", "google_sheets", "github", "notion"];

      expectedProviders.forEach((provider) => {
        expect(integrations).toHaveProperty(provider);
      });
    });

    it("should have at least 4 integrations", () => {
      const integrationKeys = Object.keys(integrations);
      expect(integrationKeys.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Slack integration", () => {
    const slack = integrations.slack;

    it("should have correct metadata", () => {
      expect(slack.id).toBe("slack");
      expect(slack.name).toBe("Slack");
      expect(slack.type).toBe("oauth2");
      expect(slack.icon).toBe("MessageSquare");
      expect(slack.description).toBeTruthy();
    });

    it("should have correct OAuth scopes", () => {
      expect(slack.scopes).toEqual([
        "chat:write",
        "channels:read",
        "channels:join",
      ]);
    });

    it("should have operations", () => {
      expect(slack.operations).toBeDefined();
      expect(slack.operations.length).toBeGreaterThan(0);
    });

    it("should have send_message operation with required args", () => {
      const sendMessage = slack.operations.find(
        (op) => op.id === "send_message",
      );

      expect(sendMessage).toBeDefined();
      expect(sendMessage?.name).toBe("Send Message");
      expect(sendMessage?.args.channel).toBeDefined();
      expect(sendMessage?.args.channel.required).toBe(true);
      expect(sendMessage?.args.message).toBeDefined();
      expect(sendMessage?.args.message.required).toBe(true);
    });

    it("should have list_channels operation", () => {
      const listChannels = slack.operations.find(
        (op) => op.id === "list_channels",
      );

      expect(listChannels).toBeDefined();
      expect(listChannels?.name).toBe("List Channels");
    });
  });

  describe("Google Sheets integration", () => {
    const googleSheets = integrations.google_sheets;

    it("should have correct metadata", () => {
      expect(googleSheets.id).toBe("google_sheets");
      expect(googleSheets.name).toBe("Google Sheets");
      expect(googleSheets.type).toBe("oauth2");
      expect(googleSheets.icon).toBe("Table");
    });

    it("should have correct OAuth scopes", () => {
      expect(googleSheets.scopes).toContain(
        "https://www.googleapis.com/auth/spreadsheets",
      );
      expect(googleSheets.scopes).toContain(
        "https://www.googleapis.com/auth/drive.file",
      );
    });

    it("should have append_row operation", () => {
      const appendRow = googleSheets.operations.find(
        (op) => op.id === "append_row",
      );

      expect(appendRow).toBeDefined();
      expect(appendRow?.name).toBe("Append Row");
      expect(appendRow?.args.spreadsheetId).toBeDefined();
      expect(appendRow?.args.spreadsheetId.required).toBe(true);
      expect(appendRow?.args.range).toBeDefined();
      expect(appendRow?.args.values).toBeDefined();
    });

    it("should have read_rows operation", () => {
      const readRows = googleSheets.operations.find(
        (op) => op.id === "read_rows",
      );

      expect(readRows).toBeDefined();
      expect(readRows?.name).toBe("Read Rows");
      expect(readRows?.args.spreadsheetId.required).toBe(true);
      expect(readRows?.args.range.required).toBe(true);
    });
  });

  describe("GitHub integration", () => {
    const github = integrations.github;

    it("should have correct metadata", () => {
      expect(github.id).toBe("github");
      expect(github.name).toBe("GitHub");
      expect(github.type).toBe("oauth2");
      expect(github.icon).toBe("Github");
    });

    it("should have correct OAuth scopes", () => {
      expect(github.scopes).toEqual(["repo", "user"]);
    });

    it("should have create_issue operation", () => {
      const createIssue = github.operations.find(
        (op) => op.id === "create_issue",
      );

      expect(createIssue).toBeDefined();
      expect(createIssue?.name).toBe("Create Issue");
      expect(createIssue?.args.owner.required).toBe(true);
      expect(createIssue?.args.repo.required).toBe(true);
      expect(createIssue?.args.title.required).toBe(true);
      expect(createIssue?.args.body.required).not.toBe(true);
    });

    it("should have list_issues operation", () => {
      const listIssues = github.operations.find(
        (op) => op.id === "list_issues",
      );

      expect(listIssues).toBeDefined();
      expect(listIssues?.name).toBe("List Issues");
      expect(listIssues?.args.owner).toBeDefined();
      expect(listIssues?.args.repo).toBeDefined();
    });
  });

  describe("Notion integration", () => {
    const notion = integrations.notion;

    it("should have correct metadata", () => {
      expect(notion.id).toBe("notion");
      expect(notion.name).toBe("Notion");
      expect(notion.type).toBe("oauth2");
      expect(notion.icon).toBe("FileText");
    });

    it("should have empty scopes array", () => {
      expect(notion.scopes).toEqual([]);
    });

    it("should have create_page operation", () => {
      const createPage = notion.operations.find(
        (op) => op.id === "create_page",
      );

      expect(createPage).toBeDefined();
      expect(createPage?.name).toBe("Create Page");
      expect(createPage?.args.databaseId.required).toBe(true);
      expect(createPage?.args.properties.required).toBe(true);
      expect(createPage?.args.properties.type).toBe("json");
    });

    it("should have query_database operation", () => {
      const queryDatabase = notion.operations.find(
        (op) => op.id === "query_database",
      );

      expect(queryDatabase).toBeDefined();
      expect(queryDatabase?.name).toBe("Query Database");
      expect(queryDatabase?.args.databaseId.required).toBe(true);
      expect(queryDatabase?.args.filter.type).toBe("json");
    });
  });

  describe("Integration structure validation", () => {
    it("should have all required fields for each integration", () => {
      Object.values(integrations).forEach((integration) => {
        expect(integration.id).toBeTruthy();
        expect(integration.name).toBeTruthy();
        expect(integration.description).toBeTruthy();
        expect(integration.type).toBeTruthy();
        expect(integration.icon).toBeTruthy();
        expect(integration.operations).toBeInstanceOf(Array);
      });
    });

    it("should have valid operations for each integration", () => {
      Object.values(integrations).forEach((integration) => {
        integration.operations.forEach((operation) => {
          expect(operation.id).toBeTruthy();
          expect(operation.name).toBeTruthy();
          expect(operation.args).toBeDefined();
          expect(typeof operation.args).toBe("object");
        });
      });
    });

    it("should have valid operation args structure", () => {
      Object.values(integrations).forEach((integration) => {
        integration.operations.forEach((operation) => {
          Object.values(operation.args).forEach((arg) => {
            expect(arg.type).toBeTruthy();
            expect(arg.label).toBeTruthy();
          });
        });
      });
    });

    it("should only use valid integration types", () => {
      const validTypes = ["oauth2", "apiKey", "basic"];

      Object.values(integrations).forEach((integration) => {
        expect(validTypes).toContain(integration.type);
      });
    });

    it("should have scopes defined for OAuth2 integrations", () => {
      Object.values(integrations).forEach((integration) => {
        if (integration.type === "oauth2") {
          expect(integration.scopes).toBeDefined();
          expect(Array.isArray(integration.scopes)).toBe(true);
        }
      });
    });
  });

  describe("Operation argument types", () => {
    it("should use valid argument types", () => {
      const validTypes = ["string", "number", "boolean", "json", "array"];

      Object.values(integrations).forEach((integration) => {
        integration.operations.forEach((operation) => {
          Object.values(operation.args).forEach((arg) => {
            expect(validTypes).toContain(arg.type);
          });
        });
      });
    });

    it("should mark appropriate args as required", () => {
      // Check that at least some operations have required args
      let hasRequiredArgs = false;

      Object.values(integrations).forEach((integration) => {
        integration.operations.forEach((operation) => {
          Object.values(operation.args).forEach((arg) => {
            if (arg.required) {
              hasRequiredArgs = true;
            }
          });
        });
      });

      expect(hasRequiredArgs).toBe(true);
    });
  });
});
