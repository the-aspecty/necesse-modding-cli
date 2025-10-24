import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface ModContext {
  rootDir: string;
  modId: string;
  modName: string;
  packageName: string;
  srcDir: string;
  resourcesDir: string;
}

/**
 * Detect if we're in a Necesse mod directory by looking for build.gradle
 */
export async function detectModRoot(startDir: string = process.cwd()): Promise<string | null> {
  let currentDir = startDir;
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    const buildGradlePath = path.join(currentDir, 'build.gradle');
    try {
      await fs.access(buildGradlePath);
      // Verify it's a Necesse mod by checking for necesse-specific content
      const content = await fs.readFile(buildGradlePath, 'utf-8');
      if (content.includes('project.ext.modID') || content.includes('Necesse.jar')) {
        return currentDir;
      }
    } catch {
      // File doesn't exist, continue searching
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

/**
 * Parse build.gradle to extract mod configuration
 */
export async function parseModConfig(modRoot: string): Promise<Partial<ModContext>> {
  const buildGradlePath = path.join(modRoot, 'build.gradle');
  const content = await fs.readFile(buildGradlePath, 'utf-8');

  const config: Partial<ModContext> = {
    rootDir: modRoot,
  };

  // Extract modID
  const modIdMatch = content.match(/project\.ext\.modID\s*=\s*["']([^"']+)["']/);
  if (modIdMatch) {
    config.modId = modIdMatch[1];
    config.packageName = modIdMatch[1];
  }

  // Extract modName
  const modNameMatch = content.match(/project\.ext\.modName\s*=\s*["']([^"']+)["']/);
  if (modNameMatch) {
    config.modName = modNameMatch[1];
  }

  return config;
}

/**
 * Find the source directory for the mod
 */
export async function findSourceDir(modRoot: string, packageName: string): Promise<string | null> {
  const possiblePaths = [
    path.join(modRoot, 'src', 'main', 'java', packageName),
    path.join(modRoot, 'src', 'main', 'java', ...packageName.split('.')),
    path.join(modRoot, 'src', packageName),
  ];

  for (const srcPath of possiblePaths) {
    try {
      await fs.access(srcPath);
      return srcPath;
    } catch {
      // Try next path
    }
  }

  return null;
}

/**
 * Find the resources directory for the mod
 */
export async function findResourcesDir(modRoot: string): Promise<string | null> {
  const possiblePaths = [
    path.join(modRoot, 'src', 'main', 'resources'),
    path.join(modRoot, 'resources'),
  ];

  for (const resourcePath of possiblePaths) {
    try {
      await fs.access(resourcePath);
      return resourcePath;
    } catch {
      // Try next path
    }
  }

  return null;
}

/**
 * Get complete mod context for the current directory
 */
export async function getModContext(startDir?: string): Promise<ModContext> {
  const modRoot = await detectModRoot(startDir);

  if (!modRoot) {
    throw new Error(
      'Not in a Necesse mod directory. Could not find build.gradle with mod configuration.'
    );
  }

  const config = await parseModConfig(modRoot);

  if (!config.modId || !config.packageName) {
    throw new Error('Could not parse mod configuration from build.gradle');
  }

  const srcDir = await findSourceDir(modRoot, config.packageName);
  if (!srcDir) {
    throw new Error(`Could not find source directory for package: ${config.packageName}`);
  }

  const resourcesDir = await findResourcesDir(modRoot);
  if (!resourcesDir) {
    throw new Error('Could not find resources directory');
  }

  return {
    rootDir: modRoot,
    modId: config.modId,
    modName: config.modName || config.modId,
    packageName: config.packageName,
    srcDir,
    resourcesDir,
  };
}

/**
 * Validate that a mod context has all required directories and structure
 */
export async function validateModStructure(context: ModContext): Promise<boolean> {
  try {
    await fs.access(context.srcDir);
    await fs.access(context.resourcesDir);
    await fs.access(path.join(context.rootDir, 'build.gradle'));
    return true;
  } catch {
    return false;
  }
}
