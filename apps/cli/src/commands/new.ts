import inquirer from 'inquirer';
import { cyan, green, red, bold } from 'colorette';
import ora from 'ora';
import { generateMod } from '@necesse-modding/core';
import type { ModConfig } from '@necesse-modding/types';
import { getDefaultGameDirectory } from '@necesse-modding/utils';
import * as path from 'node:path';

interface NewCommandOptions {
  interactive?: boolean;
  author?: string;
  description?: string;
  modId?: string;
  gameDir?: string;
  gameVersion?: string;
  modVersion?: string;
  clientside?: boolean;
  output?: string;
}

interface InquirerAnswers {
  modName: string;
  modId: string;
  author: string;
  description: string;
  gameDirectory: string;
  gameVersion: string;
  modVersion: string;
  clientside: boolean;
  template: 'basic' | 'item' | 'qol' | 'empty';
  vscode: boolean;
  git: boolean;
  includeWrapper: boolean;
}

export async function newCommand(modName: string | undefined, options: NewCommandOptions) {
  console.log(bold(cyan('\n🎮 Create Necesse Mod\n')));

  let config: ModConfig;

  if (options.interactive || !modName) {
    // Interactive mode
    const answers = await inquirer.prompt<InquirerAnswers>([
      {
        type: 'input',
        name: 'modName',
        message: 'What is your mod name?',
        default: modName || 'MyNecesseMod',
        validate: (input: string) => input.length > 0 || 'Mod name is required',
      },
      {
        type: 'input',
        name: 'modId',
        message: 'Mod ID (lowercase, no spaces):',
        default: (answers: Partial<InquirerAnswers>) =>
          (answers.modName || '').toLowerCase().replace(/\s+/g, ''),
        validate: (input: string) =>
          /^[a-z0-9]+$/.test(input) || 'Mod ID must be lowercase alphanumeric',
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        default: options.author || 'YourName',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Mod description:',
        default: options.description || 'A Necesse mod',
      },
      {
        type: 'input',
        name: 'gameDirectory',
        message: 'Path to Necesse game directory:',
        default: getDefaultGameDirectory(),
        validate: (input: string) => input.length > 0 || 'Game directory is required',
      },
      {
        type: 'input',
        name: 'gameVersion',
        message: 'Target game version:',
        default: options.gameVersion || '1.0.1',
      },
      {
        type: 'input',
        name: 'modVersion',
        message: 'Mod version:',
        default: options.modVersion || '1.0.0',
      },
      {
        type: 'confirm',
        name: 'clientside',
        message: 'Is this a client-side only mod?',
        default: options.clientside || false,
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose a template:',
        choices: [
          { name: 'Basic Mod (recommended)', value: 'basic' },
          { name: 'Item Mod (weapons, tools)', value: 'item' },
          { name: 'QOL Mod (quality of life)', value: 'qol' },
          { name: 'Empty Mod (minimal setup)', value: 'empty' },
        ],
      },
      {
        type: 'confirm',
        name: 'vscode',
        message: 'Include VSCode configuration?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'git',
        message: 'Initialize git repository?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'includeWrapper',
        message: 'Include Gradle wrapper properties? (Recommended)',
        default: true,
      },
    ]);

    config = {
      modName: answers.modName,
      modId: answers.modId,
      author: answers.author,
      description: answers.description,
      gameDirectory: answers.gameDirectory,
      gameVersion: answers.gameVersion,
      modVersion: answers.modVersion,
      clientside: answers.clientside,
      template: answers.template,
      outputDir: options.output || '.',
      includeVSCode: answers.vscode,
      initGit: answers.git,
      includeWrapper: answers.includeWrapper,
    };
  } else {
    // Command-line mode
    config = {
      modName,
      modId: options.modId || modName.toLowerCase().replace(/\s+/g, ''),
      author: options.author || 'YourName',
      description: options.description || 'A Necesse mod',
      gameDirectory: options.gameDir || getDefaultGameDirectory(),
      gameVersion: options.gameVersion || '1.0.1',
      modVersion: options.modVersion || '1.0.0',
      clientside: options.clientside || false,
      template: 'basic',
      outputDir: options.output || '.',
      includeVSCode: true,
      initGit: true,
      includeWrapper: true,
    };
  }

  // Generate the mod
  const spinner = ora('Generating mod template...').start();

  try {
    await generateMod(config);
    spinner.succeed(green('Mod template generated successfully!'));

    const projectPath = path.join(config.outputDir, config.modName.replace(/\s+/g, ''));
    const isWindows = process.platform === 'win32';

    console.log(cyan('\n📦 Next steps:'));
    console.log(`  cd ${projectPath}`);

    if (config.includeWrapper !== false) {
      console.log('  gradle wrapper            # Generate wrapper scripts (gradlew/gradlew.bat)');
      console.log(`  ${isWindows ? 'gradlew.bat' : './gradlew'} buildModJar  # Build your mod`);
      console.log(`  ${isWindows ? 'gradlew.bat' : './gradlew'} runDevClient     # Run with Necesse`);
    } else {
      console.log('  gradle buildModJar  # Build your mod (requires Gradle installation)');
      console.log('  gradle runDDevClient     # Run with Necesse (client Dev Mode)');
    }

    console.log(cyan('\n💡 Or open in VSCode:'));
    console.log(`  code ${projectPath}`);

    if (config.includeWrapper !== false) {
      console.log(cyan('\n✨ Gradle wrapper properties included!'));
      console.log(cyan('   Run "gradle wrapper" first to generate gradlew scripts.'));
    }

    console.log(cyan('🚀 Happy modding!\n'));
  } catch (error) {
    spinner.fail(red('Failed to generate mod template'));
    console.error(red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}
