import * as fs from "fs-extra";
import * as path from "path";
import { FileInfo } from "../types";
import chalk from "chalk";

export class FileUtils {
  static async readDirectory(dirPath: string): Promise<string[]> {
    try {
      const exists = await fs.pathExists(dirPath);
      if (!exists) {
        console.log(chalk.yellow(`Directory ${dirPath} does not exist`));
        return [];
      }

      const files = await fs.readdir(dirPath, { withFileTypes: true });
      const filePaths: string[] = [];

      for (const file of files) {
        const fullPath = path.join(dirPath, file.name);

        if (file.isDirectory()) {
          const subFiles = await this.readDirectory(fullPath);
          filePaths.push(...subFiles);
        } else if (this.isValidCodeFile(file.name)) {
          filePaths.push(fullPath);
        }
      }

      return filePaths;
    } catch (error) {
      console.error(chalk.red(`Error reading directory ${dirPath}:`), error);
      return [];
    }
  }

  static async readFileContent(
    filePath: string,
    maxSize: number
  ): Promise<string> {
    try {
      const stats = await fs.stat(filePath);

      if (stats.size > maxSize) {
        console.log(
          chalk.yellow(
            `File ${filePath} is too large (${stats.size} bytes), skipping`
          )
        );
        return "";
      }

      return await fs.readFile(filePath, "utf-8");
    } catch (error) {
      console.error(chalk.red(`Error reading file ${filePath}:`), error);
      return "";
    }
  }

  static async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content, "utf-8");
      console.log(chalk.green(`✓ Test file created: ${filePath}`));
    } catch (error) {
      console.error(chalk.red(`Error writing file ${filePath}:`), error);
      throw error;
    }
  }

  static isValidCodeFile(fileName: string): boolean {
    const validExtensions = [".js", ".ts", ".jsx", ".tsx"];
    return validExtensions.some((ext) => fileName.endsWith(ext));
  }

  static async createFileInfo(
    filePath: string,
    type: "route" | "controller",
    baseDir: string,
    maxSize: number
  ): Promise<FileInfo | null> {
    const content = await this.readFileContent(filePath, maxSize);

    if (!content) {
      return null;
    }

    return {
      path: filePath,
      content,
      type,
      relativePath: path.relative(baseDir, filePath),
    };
  }
}
