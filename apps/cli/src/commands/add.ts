import inquirer from 'inquirer';
import { cyan, green, red, bold, yellow } from 'colorette';
import ora from 'ora';
import { getModContext, type ModContext } from '@necesse-modding/utils';
import {
  ItemGenerator,
  MobGenerator,
  BuffGenerator,
  TileGenerator,
  type ItemGeneratorOptions,
  type MobGeneratorOptions,
  type BuffGeneratorOptions,
  type TileGeneratorOptions,
} from '@necesse-modding/generators';

export async function addCommand(componentType?: string) {
  console.log(bold(cyan('\n➕ Add Component to Mod\n')));

  // Detect if we're in a mod directory
  const spinner = ora('Detecting mod directory...').start();

  let context: ModContext;
  try {
    context = await getModContext();
    spinner.succeed(green(`Found mod: ${context.modName} (${context.modId})`));
  } catch (error) {
    spinner.fail(red('Not in a Necesse mod directory'));
    console.log(yellow('\n💡 Tip: Navigate to your mod directory or create a new mod first:'));
    console.log('   create-necesse-mod new MyMod\n');
    process.exit(1);
  }

  // If component type not provided, ask for it
  let selectedType = componentType;
  if (!selectedType) {
    const { type } = await inquirer.prompt<{ type: string }>([
      {
        type: 'list',
        name: 'type',
        message: 'What component do you want to add?',
        choices: [
          { name: '⚔️  Item (weapon, armor, tool, etc.)', value: 'item' },
          { name: '👾 Mob (enemy, NPC)', value: 'mob' },
          { name: '🔲 Tile (block, terrain)', value: 'tile' },
          { name: '✨ Buff (status effect)', value: 'buff' },
        ],
      },
    ]);
    selectedType = type;
  }

  // Generate based on component type
  switch (selectedType) {
    case 'item':
      await addItem(context);
      break;
    case 'mob':
      await addMob(context);
      break;
    case 'tile':
      await addTile(context);
      break;
    case 'buff':
      await addBuff(context);
      break;
    default:
      console.log(red(`Unknown component type: ${selectedType}`));
      console.log('Available types: item, mob, tile, buff');
      process.exit(1);
  }
}

async function addItem(context: ModContext) {
  console.log(bold('\n📦 Create New Item\n'));

  const answers = await inquirer.prompt<ItemGeneratorOptions>([
    {
      type: 'input',
      name: 'name',
      message: 'Item name:',
      validate: (input: string) => input.length > 0 || 'Item name is required',
    },
    {
      type: 'list',
      name: 'type',
      message: 'Item type:',
      choices: [
        { name: 'Weapon', value: 'weapon' },
        { name: 'Tool', value: 'tool' },
        { name: 'Armor', value: 'armor' },
        { name: 'Consumable', value: 'consumable' },
        { name: 'Material/Generic', value: 'material' },
      ],
    },
    {
      type: 'list',
      name: 'rarity',
      message: 'Rarity:',
      choices: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
    {
      type: 'number',
      name: 'damage',
      message: 'Damage:',
      default: 10,
      when: (answers: Partial<ItemGeneratorOptions>) => answers.type === 'weapon',
    },
    {
      type: 'number',
      name: 'armorValue',
      message: 'Armor value:',
      default: 5,
      when: (answers: Partial<ItemGeneratorOptions>) => answers.type === 'armor',
    },
    {
      type: 'number',
      name: 'stackSize',
      message: 'Stack size:',
      default: 1,
    },
  ]);

  const generator = new ItemGenerator(context);
  await generator.generate(answers);
}

async function addMob(context: ModContext) {
  console.log(bold('\n👾 Create New Mob\n'));

  const answers = await inquirer.prompt<MobGeneratorOptions>([
    {
      type: 'input',
      name: 'name',
      message: 'Mob name:',
      validate: (input: string) => input.length > 0 || 'Mob name is required',
    },
    {
      type: 'number',
      name: 'health',
      message: 'Health:',
      default: 100,
    },
    {
      type: 'number',
      name: 'damage',
      message: 'Damage:',
      default: 10,
    },
    {
      type: 'number',
      name: 'speed',
      message: 'Speed:',
      default: 30,
    },
    {
      type: 'confirm',
      name: 'isBoss',
      message: 'Is this a boss mob?',
      default: false,
    },
  ]);

  const generator = new MobGenerator(context);
  await generator.generate(answers);
}

async function addTile(context: ModContext) {
  console.log(bold('\n🔲 Create New Tile\n'));

  const answers = await inquirer.prompt<TileGeneratorOptions>([
    {
      type: 'input',
      name: 'name',
      message: 'Tile name:',
      validate: (input: string) => input.length > 0 || 'Tile name is required',
    },
    {
      type: 'confirm',
      name: 'isSolid',
      message: 'Is this a solid tile?',
      default: true,
    },
    {
      type: 'list',
      name: 'toolType',
      message: 'Tool required to mine:',
      choices: ['pickaxe', 'axe', 'shovel'],
      default: 'pickaxe',
    },
    {
      type: 'confirm',
      name: 'dropsSelf',
      message: 'Does it drop itself when mined?',
      default: true,
    },
  ]);

  const generator = new TileGenerator(context);
  await generator.generate(answers);
}

async function addBuff(context: ModContext) {
  console.log(bold('\n✨ Create New Buff\n'));

  const answers = await inquirer.prompt<BuffGeneratorOptions>([
    {
      type: 'input',
      name: 'name',
      message: 'Buff name:',
      validate: (input: string) => input.length > 0 || 'Buff name is required',
    },
    {
      type: 'confirm',
      name: 'isDebuff',
      message: 'Is this a debuff (negative effect)?',
      default: false,
    },
    {
      type: 'number',
      name: 'duration',
      message: 'Default duration (seconds):',
      default: 10,
    },
  ]);

  const generator = new BuffGenerator(context);
  await generator.generate(answers);
}
