import { Config } from "../types";

export const defaultConfig: Partial<Config> = {
  model: "gpt-5",
  routesDir: "./routes",
  controllersDir: "./controllers",
  testsDir: "./tests",
  testFramework: "jest",
  maxFileSize: 50000, // 50KB max file size
};
