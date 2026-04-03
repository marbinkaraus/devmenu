import { describe, expect, it } from "bun:test";
import { applyInputTemplates } from "./runCommand";

describe("applyInputTemplates", () => {
  it("returns source unchanged when no values are provided", () => {
    expect(applyInputTemplates("git push", undefined)).toBe("git push");
  });

  it("replaces a single placeholder", () => {
    expect(
      applyInputTemplates('git commit -m "{{msg}}"', { msg: "hello" }),
    ).toBe('git commit -m "hello"');
  });

  it("replaces multiple different placeholders", () => {
    expect(
      applyInputTemplates('git commit -m "{{subject}}" -m "{{body}}"', {
        subject: "feat: add",
        body: "details here",
      }),
    ).toBe('git commit -m "feat: add" -m "details here"');
  });

  it("replaces repeated occurrences of the same placeholder", () => {
    expect(
      applyInputTemplates("echo {{x}} && echo {{x}}", { x: "hi" }),
    ).toBe("echo hi && echo hi");
  });

  it("replaces with empty string when key is missing from values", () => {
    expect(
      applyInputTemplates("echo {{missing}}", { other: "val" }),
    ).toBe("echo ");
  });

  it("handles whitespace inside braces", () => {
    expect(
      applyInputTemplates("echo {{ name }}", { name: "world" }),
    ).toBe("echo world");
  });

  it("returns source unchanged when values is an empty object", () => {
    expect(applyInputTemplates("git push", {})).toBe("git push");
  });

  it("leaves non-template braces alone", () => {
    expect(applyInputTemplates("echo {notTemplate}", {})).toBe(
      "echo {notTemplate}",
    );
  });
});
