import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { resolveMenuConfig } from "./resolveMenuConfig";

let tempDir: string;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), "devmenu-test-"));
});

afterEach(() => {
  rmSync(tempDir, { recursive: true, force: true });
});

describe("resolveMenuConfig", () => {
  it("returns empty categories when no config file exists", () => {
    const result = resolveMenuConfig(tempDir);
    expect(result.hasConfigFile).toBe(false);
    expect(result.categories).toHaveLength(0);
  });

  it("parses a minimal YAML config", () => {
    const yaml = `categories:
  - name: Scripts
    commands:
      - label: Test
        command: bun test
`;
    writeFileSync(join(tempDir, "devmenu.yaml"), yaml);
    const result = resolveMenuConfig(tempDir);
    expect(result.hasConfigFile).toBe(true);
    expect(result.categories).toHaveLength(1);
    expect(result.categories[0].name).toBe("Scripts");
    expect(result.categories[0].commands).toHaveLength(1);
    expect(result.categories[0].commands[0].label).toBe("Test");
    expect(result.categories[0].commands[0].command).toBe("bun test");
  });

  it("parses a minimal JSON config", () => {
    const json = JSON.stringify({
      categories: [
        {
          name: "Git",
          commands: [{ label: "Status", command: "git status" }],
        },
      ],
    });
    writeFileSync(join(tempDir, "devmenu.json"), json);
    const result = resolveMenuConfig(tempDir);
    expect(result.hasConfigFile).toBe(true);
    expect(result.categories[0].name).toBe("Git");
  });

  it("prefers YAML over JSON in the same directory", () => {
    writeFileSync(
      join(tempDir, "devmenu.yaml"),
      "categories:\n  - name: FromYAML\n    commands:\n      - label: Y\n        command: echo yaml\n",
    );
    writeFileSync(
      join(tempDir, "devmenu.json"),
      JSON.stringify({
        categories: [
          {
            name: "FromJSON",
            commands: [{ label: "J", command: "echo json" }],
          },
        ],
      }),
    );
    const result = resolveMenuConfig(tempDir);
    expect(result.categories[0].name).toBe("FromYAML");
  });

  it("walks up to find config in parent directory", () => {
    const subDir = join(tempDir, "src", "deep");
    mkdirSync(subDir, { recursive: true });
    writeFileSync(
      join(tempDir, "devmenu.yaml"),
      "categories:\n  - name: Root\n    commands:\n      - label: Hello\n        command: echo hi\n",
    );
    const result = resolveMenuConfig(subDir);
    expect(result.hasConfigFile).toBe(true);
    expect(result.categories[0].name).toBe("Root");
    expect(result.rootDir).toBe(tempDir);
  });

  it("skips categories with no valid commands", () => {
    const yaml = `categories:
  - name: Empty
    commands: []
  - name: HasOne
    commands:
      - label: Go
        command: echo go
`;
    writeFileSync(join(tempDir, "devmenu.yaml"), yaml);
    const result = resolveMenuConfig(tempDir);
    expect(result.categories).toHaveLength(1);
    expect(result.categories[0].name).toBe("HasOne");
  });

  it("skips commands missing required fields", () => {
    const yaml = `categories:
  - name: Mixed
    commands:
      - label: Valid
        command: echo ok
      - label: NoCommand
      - command: echo orphan
`;
    writeFileSync(join(tempDir, "devmenu.yaml"), yaml);
    const result = resolveMenuConfig(tempDir);
    expect(result.categories[0].commands).toHaveLength(1);
    expect(result.categories[0].commands[0].label).toBe("Valid");
  });

  it("parses optional fields (description, cwd, tags, confirm, confirmText)", () => {
    const yaml = `categories:
  - name: Full
    commands:
      - label: Deploy
        command: deploy.sh
        description: Ship it
        cwd: ./scripts
        tags: [deploy, prod]
        confirm: true
        confirmText: Are you sure?
`;
    writeFileSync(join(tempDir, "devmenu.yaml"), yaml);
    const result = resolveMenuConfig(tempDir);
    const cmd = result.categories[0].commands[0];
    expect(cmd.description).toBe("Ship it");
    expect(cmd.cwd).toBe("./scripts");
    expect(cmd.tags).toEqual(["deploy", "prod"]);
    expect(cmd.confirm).toBe(true);
    expect(cmd.confirmText).toBe("Are you sure?");
  });

  it("parses inputs with all fields", () => {
    const yaml = `categories:
  - name: WithInputs
    commands:
      - label: Greet
        command: echo {{name}}
        inputs:
          - name: name
            label: Your name
            placeholder: Jane
            default: World
            required: true
            multiline: false
`;
    writeFileSync(join(tempDir, "devmenu.yaml"), yaml);
    const result = resolveMenuConfig(tempDir);
    const input = result.categories[0].commands[0].inputs?.[0];
    expect(input).toBeDefined();
    expect(input?.name).toBe("name");
    expect(input?.label).toBe("Your name");
    expect(input?.placeholder).toBe("Jane");
    expect(input?.default).toBe("World");
    expect(input?.required).toBe(true);
    expect(input?.multiline).toBe(false);
  });

  it("throws on malformed YAML", () => {
    writeFileSync(join(tempDir, "devmenu.yaml"), ":::\nnot valid yaml: [");
    expect(() => resolveMenuConfig(tempDir)).toThrow();
  });

  it("throws on malformed JSON", () => {
    writeFileSync(join(tempDir, "devmenu.json"), "{ not json }}}");
    expect(() => resolveMenuConfig(tempDir)).toThrow();
  });

  it("recognizes dotfile config names", () => {
    writeFileSync(
      join(tempDir, ".devmenu.yaml"),
      "categories:\n  - name: Hidden\n    commands:\n      - label: Hi\n        command: echo hi\n",
    );
    const result = resolveMenuConfig(tempDir);
    expect(result.hasConfigFile).toBe(true);
    expect(result.categories[0].name).toBe("Hidden");
  });
});
