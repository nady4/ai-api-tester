import OpenAI from "openai";
import * as path from "path";
import chalk from "chalk";
import { AIResponse, FileInfo, TestGenerationRequest } from "../types";

export class AIService {
  private client: OpenAI;
  private model: string;

  constructor(model: string = "gpt-5") {
    this.client = new OpenAI({
      apiKey: process.env.AI_API_KEY,
    });
    this.model = model;
  }

  async generateTests(request: TestGenerationRequest): Promise<AIResponse[]> {
    const responses: AIResponse[] = [];

    for (const file of request.files) {
      try {
        console.log(chalk.blue(`Generating tests for: ${file.relativePath}`));

        const prompt = this.createPrompt(
          file,
          request.testFramework,
          request.projectStructure
        );
        const response = await this.callAI(prompt);

        const aiResponse = this.parseAIResponse(response, file);
        responses.push(aiResponse);

        await this.delay(1000); // respect rate limits
      } catch (error) {
        console.error(
          chalk.red(`Error generating tests for ${file.relativePath}:`),
          error
        );
      }
    }

    return responses;
  }

  private createPrompt(
    file: FileInfo,
    testFramework: string,
    projectStructure: string
  ): string {
    return `You are an expert test generator. Generate comprehensive ${testFramework} tests for the following ${
      file.type
    } file.

PROJECT STRUCTURE:
${projectStructure}

FILE TYPE: ${file.type}
FILE PATH: ${file.relativePath}
FILE CONTENT:
\`\`\`${this.getFileExtension(file.path)}
${file.content}
\`\`\`

REQUIREMENTS:
1. Generate complete, runnable ${testFramework} tests
2. Include imports and setup code
3. Test all exported functions/methods/routes
4. Include both positive and negative test cases
5. Mock external dependencies appropriately
6. Follow best practices for ${testFramework}
7. Include proper error handling tests
8. Test edge cases and boundary conditions

For ROUTES:
- Test HTTP methods (GET, POST, PUT, DELETE, etc.)
- Test request/response handling
- Test middleware functionality
- Test error responses and status codes
- Mock database calls and external services

For CONTROLLERS:
- Test all public methods
- Test input validation
- Test business logic
- Test error handling
- Mock dependencies and services

RESPONSE FORMAT:
Return a JSON object with the following structure:
{
  "generatedTest": "complete test code here",
  "testFileName": "appropriate test file name with .test.ts or .test.js extension",
  "dependencies": ["array of additional npm packages needed for testing"]
}

Generate the tests now:`;
  }

  private async callAI(prompt: string): Promise<string> {
    try {
      const response = await this.client.responses.create({
        model: this.model,
        input: prompt,
      });

      return response.output_text;
    } catch (error) {
      console.error(chalk.red("OpenAI API Error:"), error);
      throw error;
    }
  }

  private parseAIResponse(response: string, file: FileInfo): AIResponse {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        generatedTest: parsed.generatedTest || response,
        testFileName: parsed.testFileName || this.generateTestFileName(file),
        dependencies: parsed.dependencies || [],
      };
    } catch (error) {
      console.warn(
        chalk.yellow(
          `Failed to parse AI response as JSON for ${file.relativePath}, using raw response`
        )
      );

      return {
        generatedTest: response,
        testFileName: this.generateTestFileName(file),
        dependencies: [],
      };
    }
  }

  private generateTestFileName(file: FileInfo): string {
    const baseName = path.parse(file.relativePath).name;
    const dir = path.dirname(file.relativePath);
    return path.join(dir, `${baseName}.test.ts`);
  }

  private getFileExtension(filePath: string): string {
    return path.extname(filePath).slice(1) || "javascript";
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
