import { describe, expect, it } from "vitest";
import { registrationSchema } from "./password";

describe("server registration password validation", () => {
  const registration = { name: "Learner", email: "learner@example.test" };

  it("rejects an invalid password when client validation is bypassed", () => {
    expect(registrationSchema.safeParse({ ...registration, password: "short" }).success).toBe(false);
  });

  it("accepts a policy-valid password without a confirmation value", () => {
    expect(registrationSchema.safeParse({ ...registration, password: "Abcdefghijk1" }).success).toBe(true);
  });
});
