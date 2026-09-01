import { describe, expect, it } from "vitest";
import {
  isEmailUniqueViolation,
  isRegisterErrorCode,
  registerErrorMessage,
  registrationSchema,
} from "./registration";

describe("registration contract", () => {
  const valid = { name: "Learner", email: "learner@example.com", password: "ValidPassword1234" };

  it("accepts valid registration fields and trims name and email", () => {
    expect(registrationSchema.parse({ ...valid, name: "  Learner  ", email: "  Learner@Example.com  " }))
      .toEqual({ ...valid, email: "Learner@Example.com" });
  });

  it.each([
    [{ ...valid, name: "" }, "name"],
    [{ ...valid, email: "" }, "email"],
    [{ ...valid, email: "invalid" }, "email"],
    [{ ...valid, password: "Short1A" }, "password"],
  ])("rejects invalid registration fields", (input, field) => {
    const result = registrationSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>;
      expect(fieldErrors[field]).toBeTruthy();
    }
  });

  it("recognizes only the race-safe users email constraint through wrapped database errors", () => {
    expect(isEmailUniqueViolation({ cause: { code: "23505", constraint: "users_email_unique" } })).toBe(true);
    expect(isEmailUniqueViolation({ code: "23505", constraint: "another_unique_constraint" })).toBe(false);
    expect(isEmailUniqueViolation(new Error("users_email_unique"))).toBe(false);
  });

  it("maps stable codes without depending on server prose", () => {
    expect(isRegisterErrorCode("EMAIL_ALREADY_REGISTERED")).toBe(true);
    expect(isRegisterErrorCode("arbitrary server error")).toBe(false);
    expect(registerErrorMessage("EMAIL_ALREADY_REGISTERED")).toBe("This email is already registered.");
    expect(registerErrorMessage("RATE_LIMITED", 12)).toContain("12 seconds");
    expect(registerErrorMessage("SERVICE_UNAVAILABLE")).toContain("temporarily unavailable");
  });
});
