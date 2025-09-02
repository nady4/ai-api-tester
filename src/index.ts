import * as dotenv from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import * as path from "path";
import * as fs from "fs-extra";
import { Config } from "./types";
import { defaultConfig } from "./config/default";
import { TestGenerator } from "./core/testGenerator";

dotenv.config();

interface CLIArgs {
  "ai-key": string;
  model?: string;
  "routes-dir": string;
  "controllers-dir": string;
  "tests-dir": string;
  "test-framework": "jest" | "mocha";
  "max-file-size": number;
  "dry-run": boolean;
  verbose: boolean;
  init: boolean;
}

async function detectProjectStructure(): Promise<Partial<Config>> {
  const cwd = process.cwd();
  const detected: Partial<Config> = {};

  // Check if package.json exists
  const packageJsonPath = path.join(cwd, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const packageJson = await fs.readJson(packageJsonPath);

      // Detect test framework from dependencies
      if (packageJson.devDependencies) {
        if (
          packageJson.devDependencies.jest ||
          packageJson.devDependencies["@types/jest"]
        ) {
          detected.testFramework = "jest";
        } else if (
          packageJson.devDependencies.mocha ||
          packageJson.devDependencies["@types/mocha"]
        ) {
          detected.testFramework = "mocha";
        }
      }
    } catch (error) {
      console.warn(chalk.yellow("Warning: Could not parse package.json"));
    }
  }

  // Auto-detect common directory structures
  const commonStructures = [
    { routes: "./routes", controllers: "./controllers" },
    { routes: "./src/routes", controllers: "./src/controllers" },
    { routes: "./api/routes", controllers: "./api/controllers" },
    { routes: "./src/api/routes", controllers: "./src/api/controllers" },
    { routes: "./pages/api", controllers: "./pages/api" }, // Next.js
    { routes: "./src", controllers: "./src" }, // NestJS or general src structure
  ];

  for (const structure of commonStructures) {
    const routesExist = await fs.pathExists(path.join(cwd, structure.routes));
    const controllersExist = await fs.pathExists(
      path.join(cwd, structure.controllers)
    );

    if (routesExist || controllersExist) {
      if (routesExist) detected.routesDir = structure.routes;
      if (controllersExist) detected.controllersDir = structure.controllers;
      break;
    }
  }

  // Detect test directory
  const commonTestDirs = [
    "./tests",
    "./__tests__",
    "./test",
    "./src/__tests__",
    "./src/tests",
  ];
  for (const testDir of commonTestDirs) {
    if (await fs.pathExists(path.join(cwd, testDir))) {
      detected.testsDir = testDir;
      break;
    }
  }

  return detected;
}

async function initializeProject(): Promise<void> {
  console.log(chalk.blue("🚀 Initializing AI API Tester in your project...\n"));

  // Create .env file if it doesn't exist
  const envPath = path.join(process.cwd(), ".env");
  if (!(await fs.pathExists(envPath))) {
    const envContent = `# AI API Configuration for ai-api-tester
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your-openai-api-key-here
`;
    await fs.writeFile(envPath, envContent);
    console.log(
      chalk.green("✓ Created .env file with OpenAI API configuration")
    );
  }

  // Create npm script in package.json
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const packageJson = await fs.readJson(packageJsonPath);

      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }

      if (!packageJson.scripts["generate-tests"]) {
        packageJson.scripts["generate-tests"] = "ai-api-tester";
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        console.log(
          chalk.green('✓ Added "generate-tests" script to package.json')
        );
      }
    } catch (error) {
      console.warn(chalk.yellow("Warning: Could not modify package.json"));
    }
  }

  console.log(chalk.blue("\n📋 Next Steps:"));
  console.log("1. Configure your OpenAI API key in .env file");
  console.log("2. Run: npm run generate-tests");
  console.log("3. Or run directly: npx ai-api-tester");
}

async function main() {
  console.log(chalk.blue("🤖 AI API Tester"));
  console.log(
    chalk.gray("Generating intelligent tests for your Node.js project...\n")
  );

  const argv = (await yargs(hideBin(process.argv))
    .usage("Usage: $0 [options]")
    .option("init", {
      type: "boolean",
      description: "Initialize ai-api-tester in your project",
      default: false,
    })
    .option("ai-key", {
      alias: "k",
      type: "string",
      description: "OpenAI API Key",
      default: process.env.AI_API_KEY,
    })
    .option("model", {
      alias: "m",
      type: "string",
      description: "AI Model to use",
      default: defaultConfig.model,
    })
    .option("routes-dir", {
      alias: "r",
      type: "string",
      description: "Routes directory path (auto-detected if not specified)",
    })
    .option("controllers-dir", {
      alias: "c",
      type: "string",
      description:
        "Controllers directory path (auto-detected if not specified)",
    })
    .option("tests-dir", {
      alias: "t",
      type: "string",
      description:
        "Tests output directory path (auto-detected if not specified)",
    })
    .option("test-framework", {
      alias: "f",
      type: "string",
      choices: ["jest", "mocha"] as const,
      description: "Test framework to use (auto-detected if not specified)",
    })
    .option("max-file-size", {
      alias: "s",
      type: "number",
      description: "Maximum file size in bytes",
      default: defaultConfig.maxFileSize,
    })
    .option("dry-run", {
      type: "boolean",
      description: "Show what would be generated without creating files",
      default: false,
    })
    .option("verbose", {
      alias: "v",
      type: "boolean",
      description: "Show detailed output",
      default: false,
    })
    .help()
    .alias("help", "h")
    .example("$0 --init", "Initialize ai-api-tester in your project")
    .example("$0", "Generate tests with auto-detection")
    .example('$0 --ai-key "your-key"', "Use specific OpenAI API key")
    .example("$0 --dry-run", "Preview what will be generated").argv) as CLIArgs;

  // Handle initialization
  if (argv.init) {
    await initializeProject();
    return;
  }

  // Auto-detect project structure
  const detectedConfig = await detectProjectStructure();

  // Merge configurations: CLI args > detected > defaults
  const config: Config = {
    aiApiKey: argv["ai-key"] || process.env.AI_API_KEY || "",
    aiApiUrl: process.env.OPENAI_API_URL || "https://api.openai.com/v1",
    model: argv.model || defaultConfig.model,
    routesDir:
      argv["routes-dir"] ||
      detectedConfig.routesDir ||
      defaultConfig.routesDir!,
    controllersDir:
      argv["controllers-dir"] ||
      detectedConfig.controllersDir ||
      defaultConfig.controllersDir!,
    testsDir:
      argv["tests-dir"] || detectedConfig.testsDir || defaultConfig.testsDir!,
    testFramework:
      (argv["test-framework"] as "jest" | "mocha") ||
      detectedConfig.testFramework ||
      defaultConfig.testFramework!,
    maxFileSize: argv["max-file-size"] || defaultConfig.maxFileSize!,
  };

  // Validate required configuration
  if (!config.aiApiKey) {
    console.error(chalk.red("❌ OpenAI API Key is required."));
    console.error(
      chalk.gray("   Set OPENAI_API_KEY in .env file or use --ai-key flag")
    );
    console.error(
      chalk.gray(
        "   Get your API key from: https://platform.openai.com/api-keys"
      )
    );
    console.error(
      chalk.gray('   Run "ai-api-tester --init" to set up your project')
    );
    process.exit(1);
  }

  // Show detected configuration
  console.log(chalk.blue("🔍 Project Analysis:"));
  if (detectedConfig.routesDir)
    console.log(chalk.green(`  ✓ Found routes in: ${config.routesDir}`));
  if (detectedConfig.controllersDir)
    console.log(
      chalk.green(`  ✓ Found controllers in: ${config.controllersDir}`)
    );
  if (detectedConfig.testFramework)
    console.log(
      chalk.green(`  ✓ Detected test framework: ${config.testFramework}`)
    );
  if (detectedConfig.testsDir)
    console.log(chalk.green(`  ✓ Found test directory: ${config.testsDir}`));
  console.log();

  if (argv.verbose) {
    console.log(chalk.blue("📋 Final Configuration:"));
    console.log(`  Routes: ${config.routesDir}`);
    console.log(`  Controllers: ${config.controllersDir}`);
    console.log(`  Tests Output: ${config.testsDir}`);
    console.log(`  Framework: ${config.testFramework}`);
    console.log(`  Model: ${config.model}`);
    console.log(`  Dry Run: ${argv["dry-run"]}`);
    console.log();
  }

  try {
    const generator = new TestGenerator(config);
    await generator.generate();
  } catch (error) {
    console.error(chalk.red("❌ Generation failed:"), error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error(
    chalk.red("Unhandled Rejection at:"),
    promise,
    chalk.red("reason:"),
    reason
  );
  process.exit(1);
});

if (require.main === module) {
  main();
}
