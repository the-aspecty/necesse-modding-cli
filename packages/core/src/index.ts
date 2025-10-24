import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { ModConfig } from '@necesse-modding/types';
import { templates } from '@necesse-modding/templates';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export async function generateMod(config: ModConfig): Promise<void> {
  const projectName = config.modName.replace(/\s+/g, '');
  const projectPath = path.join(config.outputDir, projectName);

  // Create directory structure
  await createDirectories(projectPath, config);

  // Generate files
  await generateFiles(projectPath, config);

  // Initialize git if requested
  if (config.initGit) {
    try {
      await execAsync('git init', { cwd: projectPath });
    } catch (error) {
      console.warn('Git initialization failed (git may not be installed)');
    }
  }
}

async function createDirectories(projectPath: string, config: ModConfig): Promise<void> {
  const dirs = [
    projectPath,
    path.join(projectPath, 'src', 'main', 'java', config.modId),
    path.join(projectPath, 'src', 'main', 'java', config.modId, 'items'),
    path.join(projectPath, 'src', 'main', 'resources', 'locale'),
    path.join(projectPath, 'src', 'main', 'resources', 'items'),
  ];

  if (config.includeVSCode) {
    dirs.push(path.join(projectPath, '.vscode'));
  }

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function generateFiles(projectPath: string, config: ModConfig): Promise<void> {
  const files = templates[config.template](config);

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(projectPath, filePath);
    const fileDir = path.dirname(fullPath);

    // Ensure directory exists
    await fs.mkdir(fileDir, { recursive: true });

    // Write file
    await fs.writeFile(fullPath, content, 'utf-8');
  }
}
