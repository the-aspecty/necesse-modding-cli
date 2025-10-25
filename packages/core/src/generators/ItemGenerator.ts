import * as path from 'node:path';
import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js';

export interface ItemGeneratorOptions extends GeneratorOptions {
  name: string;
  type: 'weapon' | 'tool' | 'armor' | 'consumable' | 'material';
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  damage?: number;
  armorValue?: number;
  toolTier?: number;
  stackSize?: number;
}

export class ItemGenerator extends BaseGenerator {
  async generate(options: ItemGeneratorOptions): Promise<void> {
    const className = this.toClassName(options.name);
    const itemId = this.toId(options.name);

    // Generate Java class
    const javaContent = this.generateJavaClass(className, itemId, options);
    const javaPath = path.join(this.context.srcDir, 'items', `${className}.java`);
    await this.writeFile(javaPath, javaContent);

    // Generate locale entry
    await this.addLocaleEntry(itemId, options.name);

    // Create texture placeholder
    await this.createTexturePlaceholder(itemId);

    console.log(`✅ Generated item: ${className}`);
    console.log(`   Java: ${javaPath}`);
    console.log(`   Don't forget to:`);
    console.log(`   1. Add texture at: resources/items/${itemId}.png`);
    console.log(`   2. Register in your mod's init method`);
  }

  private generateJavaClass(
    className: string,
    itemId: string,
    options: ItemGeneratorOptions
  ): string {
    const rarity = options.rarity || 'common';
    const rarityEnum = rarity.charAt(0).toUpperCase() + rarity.slice(1);

    let itemType = 'Item';
    let imports = ['necesse.inventory.item.Item', 'necesse.inventory.item.ItemRarity'];

    switch (options.type) {
      case 'weapon':
        itemType = 'ToolItem';
        imports = [
          'necesse.inventory.item.toolItem.ToolItem',
          'necesse.inventory.item.toolItem.ToolType',
          'necesse.inventory.item.ItemRarity',
        ];
        break;
      case 'tool':
        itemType = 'ToolItem';
        imports = [
          'necesse.inventory.item.toolItem.ToolItem',
          'necesse.inventory.item.toolItem.ToolType',
          'necesse.inventory.item.ItemRarity',
        ];
        break;
      case 'armor':
        itemType = 'ArmorItem';
        imports = [
          'necesse.inventory.item.armorItem.ArmorItem',
          'necesse.inventory.item.ItemRarity',
          'necesse.entity.mobs.PlayerMob',
        ];
        break;
      case 'consumable':
        itemType = 'ConsumableItem';
        imports = [
          'necesse.inventory.item.consumableItem.ConsumableItem',
          'necesse.inventory.item.ItemRarity',
        ];
        break;
    }

    let classContent = `package ${this.context.packageName}.items;

${imports.map((imp) => `import ${imp};`).join('\n')}

public class ${className} extends ${itemType} {
    
    public ${className}() {
        super(${options.stackSize || 1});
        this.rarity = ItemRarity.${rarityEnum.toUpperCase()};
`;

    if (options.type === 'weapon' && options.damage) {
      classContent += `        this.damage = ${options.damage};
        this.attackSpeed = 1000; // Adjust as needed
`;
    }

    if (options.type === 'armor' && options.armorValue) {
      classContent += `        this.armorValue = ${options.armorValue};
`;
    }

    classContent += `    }
    
    @Override
    public String getTranslatedTypeName() {
        return "item";
    }
}
`;

    return classContent;
  }

  private async addLocaleEntry(itemId: string, displayName: string): Promise<void> {
    const localePath = path.join(this.context.resourcesDir, 'locale', 'en.lang');
    const entry = `item.${itemId}=${displayName}\n`;

    try {
      const exists = await this.fileExists(localePath);
      if (exists) {
        const content = await require('node:fs/promises').readFile(localePath, 'utf-8');
        if (!content.includes(`item.${itemId}=`)) {
          await require('node:fs/promises').appendFile(localePath, entry);
        }
      } else {
        await this.writeFile(localePath, entry);
      }
    } catch (error) {
      console.warn('Could not update locale file. Please add manually:', entry);
    }
  }

  private async createTexturePlaceholder(itemId: string): Promise<void> {
    const texturePath = path.join(this.context.resourcesDir, 'items', `${itemId}.png`);
    const textureDir = path.dirname(texturePath);

    try {
      await require('node:fs/promises').mkdir(textureDir, { recursive: true });
      // We won't create an actual image, just remind the user
    } catch (error) {
      // Ignore errors
    }
  }
}
