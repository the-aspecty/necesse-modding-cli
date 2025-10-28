#!/usr/bin/env node
import { Command, Argument } from 'commander';
import {
  newCommand,
  addCommand,
  customCommand,
  localeCommand,
  recipeCommand,
  gradleCommand,
  vscodeCommand,
} from './commands/index.js';

const program = new Command();

program
  .name('create-necesse-mod')
  .description('CLI tool to generate and manage Necesse mods')
  .version('1.0.0');

// New mod command
program
  .command('new [mod-name]', { isDefault: true })
  .description('Create a new Necesse mod from template')
  .option('-i, --interactive', 'Interactive mode', false)
  .option('-a, --author <author>', 'Mod author name')
  .option('-d, --description <description>', 'Mod description')
  .option('-m, --mod-id <modId>', 'Mod ID (defaults to lowercase mod name)')
  .option('-g, --game-dir <gameDir>', 'Path to Necesse game directory')
  .option('--game-version <gameVersion>', 'Target game version', '1.0.2')
  .option('--mod-version <modVersion>', 'Mod version', '1.0.0')
  .option('-c, --clientside', 'Mark mod as client-side only', false)
  .option('-o, --output <directory>', 'Output directory', '.')
  .action(newCommand);

// Add component command
program
  .command('add')
  .addArgument(
    new Argument('[type]', 'Type of component to add (item, mob, tile, buff)').choices([
      'item',
      'mob',
      'tile',
      'buff',
    ])
  )
  .description('Add a component to an existing mod (item, mob, tile, buff)')
  .action(addCommand);

// Custom renderer command (for testing migrating templates)
program
  .command('custom')
  .description('Render a migrating template file (e.g., migrating/build.gradle.md) with data')
  .option('-t, --template <path>', 'Path to template file (relative to repo root)')
  .option('-o, --out <file>', 'Write rendered output to file')
  .option('-d, --data <json>', 'JSON string with data to render')
  .action(customCommand);

// Locale command (placeholder)
program
  .command('locale')
  .description('Locale-related utilities (work in progress)')
  .action(localeCommand);

// Recipe command (placeholder)
program
  .command('recipe')
  .description('Recipe-related utilities (work in progress)')
  .action(recipeCommand);

// Gradle command (placeholder)
program
  .command('gradle')
  .description('Gradle wrapper / build utilities (work in progress)')
  .action(gradleCommand);

// VSCode command (placeholder)
program
  .command('vscode')
  .description('VSCode project setup utilities (work in progress)')
  .action(vscodeCommand);

program.parse();
