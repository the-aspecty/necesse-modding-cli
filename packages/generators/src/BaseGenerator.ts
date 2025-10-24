import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { ModContext } from '@necesse-modding/utils';

export interface GeneratorOptions {
  name: string;
  [key: string]: unknown;
}

export abstract class BaseGenerator {
  constructor(protected context: ModContext) {}

  abstract generate(options: GeneratorOptions): Promise<void>;

  /**
   * Convert a component name to PascalCase class name
   */
  protected toClassName(name: string): string {
    return name
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  /**
   * Convert a component name to camelCase variable name
   */
  protected toVariableName(name: string): string {
    const className = this.toClassName(name);
    return className.charAt(0).toLowerCase() + className.slice(1);
  }

  /**
   * Convert a component name to lowercase ID
   */
  protected toId(name: string): string {
    return name.toLowerCase().replace(/[\s_-]+/g, '');
  }

  /**
   * Write a file to the filesystem
   */
  protected async writeFile(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Check if a file already exists
   */
  protected async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
