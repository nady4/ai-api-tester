import * as path from "path";
import chalk from "chalk";
import { Config, FileInfo, AIResponse } from "../types";
import { FileUtils } from "../utils/fileUtils";
import { AIService } from "../services/aiService";

export class TestGenerator {
  private config: Config;
  private aiService: AIService;

  constructor(config: Config) {
    this.config = config;
    this.aiService = new AIService(config.model || "gpt-5");
  }

  async generate(): Promise<void> {
    console.log(chalk.blue("🚀 Starting AI Test Generation..."));

    try {
      // Scan files
      const files = await this.scanFiles();
      if (files.length === 0) {
        console.log(chalk.yellow("No files found to test"));
        return;
      }

      console.log(chalk.green(`Found ${files.length} files to test`));

      // Generate project structure overview
      const projectStructure = await this.generateProjectStructure();

      // Generate tests
      const testResponses = await this.aiService.generateTests({
        files,
        testFramework: this.config.testFramework,
        projectStructure,
      });

      // Write test files
      await this.writeTestFiles(testResponses);

      console.log(chalk.green("✅ Test generation completed!"));

      // Show summary
      this.showSummary(testResponses);
    } catch (error) {
      console.error(chalk.red("❌ Test generation failed:"), error);
      throw error;
    }
  }

  private async scanFiles(): Promise<FileInfo[]> {
    const files: FileInfo[] = [];

    // Scan routes
    const routeFiles = await FileUtils.readDirectory(this.config.routesDir);
    for (const filePath of routeFiles) {
      const fileInfo = await FileUtils.createFileInfo(
        filePath,
        "route",
        this.config.routesDir,
        this.config.maxFileSize
      );
      if (fileInfo) {
        files.push(fileInfo);
      }
    }

    // Scan controllers
    const controllerFiles = await FileUtils.readDirectory(
      this.config.controllersDir
    );
    for (const filePath of controllerFiles) {
      const fileInfo = await FileUtils.createFileInfo(
        filePath,
        "controller",
        this.config.controllersDir,
        this.config.maxFileSize
      );
      if (fileInfo) {
        files.push(fileInfo);
      }
    }

    return files;
  }

  private async generateProjectStructure(): Promise<string> {
    const structure = [];

    try {
      const routeFiles = await FileUtils.readDirectory(this.config.routesDir);
      const controllerFiles = await FileUtils.readDirectory(
        this.config.controllersDir
      );

      structure.push("ROUTES:");
      routeFiles.forEach((file) => {
        structure.push(`  - ${path.relative(process.cwd(), file)}`);
      });

      structure.push("\nCONTROLLERS:");
      controllerFiles.forEach((file) => {
        structure.push(`  - ${path.relative(process.cwd(), file)}`);
      });
    } catch (error) {
      structure.push("Unable to generate project structure");
    }

    return structure.join("\n");
  }

  private async writeTestFiles(responses: AIResponse[]): Promise<void> {
    for (const response of responses) {
      try {
        const testPath = path.join(this.config.testsDir, response.testFileName);
        await FileUtils.writeFile(testPath, response.generatedTest);
      } catch (error) {
        console.error(
          chalk.red(`Failed to write test file ${response.testFileName}:`),
          error
        );
      }
    }
  }

  private showSummary(responses: AIResponse[]): void {
    console.log(chalk.blue("\n📊 Generation Summary:"));
    console.log(`Generated ${responses.length} test files`);

    const dependencies = new Set<string>();
    responses.forEach((r) => {
      if (r.dependencies) {
        r.dependencies.forEach((dep: string) => dependencies.add(dep));
      }
    });

    if (dependencies.size > 0) {
      console.log(
        chalk.yellow("\n📦 Additional dependencies you may need to install:")
      );
      dependencies.forEach((dep) => console.log(`  - ${dep}`));
    }
  }
}
