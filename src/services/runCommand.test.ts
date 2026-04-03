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
});
