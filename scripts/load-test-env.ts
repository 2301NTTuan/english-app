import { loadEnvConfig } from "@next/env";
import { existsSync } from "node:fs";
import path from "node:path";

export function loadTestEnvironment() {
  const originalNodeEnv = process.env.NODE_ENV;
  const hasTestEnv = existsSync(path.join(process.cwd(), ".env.test.local"));
  Reflect.set(process.env, "NODE_ENV", hasTestEnv ? "test" : "development");
  try {
    loadEnvConfig(process.cwd(), !hasTestEnv);
  } finally {
    if (originalNodeEnv === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
    else Reflect.set(process.env, "NODE_ENV", originalNodeEnv);
  }
}
