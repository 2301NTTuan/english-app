import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PasswordFeedback, PasswordInput, PasswordMatchFeedback } from "./password-feedback";
import { assessPassword, passwordSchema as clientPasswordSchema } from "@/lib/auth/password-policy";
import { passwordSchema as serverPasswordSchema } from "@/lib/auth/password";

const passwordFeedback = (password: string, touched: boolean) => renderToStaticMarkup(createElement(PasswordFeedback, { password, touched }));
const matchFeedback = (password: string, confirmation: string, touched: boolean) => renderToStaticMarkup(createElement(PasswordMatchFeedback, { password, confirmation, touched }));

describe("live password feedback", () => {
  it("keeps an empty untouched password neutral", () => {
    const markup = passwordFeedback("", false);
    expect(markup).toContain("Requirements and strength will update as you type");
    expect(markup).not.toContain("Not met:");
  });

  it("shows the minimum requirement as unmet below 12 characters", () => {
    const markup = passwordFeedback("ShortPass1", true);
    expect(markup).toContain("Not met: ");
    expect(markup).toContain("At least 12 characters");
    expect(assessPassword("ShortPass1").valid).toBe(false);
  });

  it("accepts 12 characters when every server requirement is met", () => {
    const password = "Abcdefghijk1";
    expect(assessPassword(password)).toMatchObject({ valid: true, strength: "Fair" });
    expect(passwordFeedback(password, true)).toContain("Password meets the registration requirements");
  });

  it("changes strength deterministically while typing without making strength a validity gate", () => {
    expect(assessPassword("ShortPass1").strength).toBe("Weak");
    expect(assessPassword("Abcdefghijk1")).toMatchObject({ valid: true, strength: "Fair" });
    expect(assessPassword("Correct-horse-battery-42")).toMatchObject({ valid: true, strength: "Strong" });
    expect(assessPassword("correct-horse-battery-staple")).toMatchObject({ valid: false, strength: "Strong" });
  });

  it("reports confirmation mismatch only after confirmation is touched", () => {
    expect(matchFeedback("Password1234", "", false)).toBe("");
    expect(matchFeedback("Password1234", "Different1234", true)).toContain("Passwords do not match");
    expect(matchFeedback("Password1234", "Password1234", true)).toContain("Passwords match");
  });

  it("renders a labelled, hidden password input with an accessible visibility control", () => {
    const markup = renderToStaticMarkup(createElement(PasswordInput, { id: "password", label: "Password", name: "password" }));
    expect(markup).toContain('for="password"');
    expect(markup).toContain('id="password"');
    expect(markup).toContain('type="password"');
    expect(markup).toContain('aria-label="Show password"');
  });

  it("uses exactly the server password policy and never logs password values", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    for (const password of ["short", "alllowercase1234", "Abcdefghijk1", "Correct-horse-battery-42"]) {
      expect(clientPasswordSchema.safeParse(password).success).toBe(serverPasswordSchema.safeParse(password).success);
      assessPassword(password);
    }
    expect(log).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });
});
