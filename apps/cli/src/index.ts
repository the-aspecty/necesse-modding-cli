#!/usr/bin/env node
import { Command, Argument } from 'commander';
import { newCommand } from './commands/new.js';
import { addCommand } from './commands/add.js';

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
  .option('--game-version <gameVersion>', 'Target game version', '1.0.1')
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

program.parse();
