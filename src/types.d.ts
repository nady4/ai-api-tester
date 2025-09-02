export interface Config {
  aiApiUrl: string;
  aiApiKey: string;
  model?: string;
  routesDir: string;
  controllersDir: string;
  testsDir: string;
  testFramework: "jest" | "mocha";
  maxFileSize: number;
}

export interface FileInfo {
  path: string;
  content: string;
  type: "route" | "controller";
  relativePath: string;
}

export interface TestGenerationRequest {
  files: FileInfo[];
  testFramework: string;
  projectStructure: string;
}

export interface AIResponse {
  generatedTest: string;
  testFileName: string;
  dependencies?: string[];
}
