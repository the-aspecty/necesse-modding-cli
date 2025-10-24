import * as path from 'node:path';
import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js';

export interface BuffGeneratorOptions extends GeneratorOptions {
  name: string;
  isDebuff?: boolean;
  duration?: number;
}

export class BuffGenerator extends BaseGenerator {
  async generate(options: BuffGeneratorOptions): Promise<void> {
    const className = `${this.toClassName(options.name)}Buff`;
    const buffId = this.toId(options.name);

    // Generate Java class
    const javaContent = this.generateJavaClass(className, buffId, options);
    const javaPath = path.join(this.context.srcDir, 'buffs', `${className}.java`);
    await this.writeFile(javaPath, javaContent);

    // Generate locale entry
    await this.addLocaleEntry(buffId, options.name);

    console.log(`✅ Generated buff: ${className}`);
    console.log(`   Java: ${javaPath}`);
    console.log(`   Don't forget to:`);
    console.log(`   1. Add texture at: resources/buffs/${buffId}.png`);
    console.log(`   2. Register in your mod's init method`);
  }

  private generateJavaClass(
    className: string,
    buffId: string,
    options: BuffGeneratorOptions
  ): string {
    const baseClass = options.isDebuff ? 'Buff' : 'Buff';

    return `package ${this.context.packageName}.buffs;

import necesse.entity.mobs.buffs.Buff;
import necesse.entity.mobs.buffs.BuffModifiers;
import necesse.entity.mobs.Mob;

public class ${className} extends ${baseClass} {
    
    public ${className}() {
        this.isImportant = ${options.isDebuff ? 'true' : 'false'};
        this.canCancel = ${options.isDebuff ? 'false' : 'true'};
    }
    
    @Override
    public void init(Mob mob, BuffEventSubscriber subscriber) {
        super.init(mob, subscriber);
    }
    
    @Override
    public void onUpdate(Mob mob) {
        super.onUpdate(mob);
        // Add buff effects here
    }
    
    @Override
    public void getModifiers(BuffModifiers modifiers) {
        super.getModifiers(modifiers);
        // Modify mob stats here
        // e.g., modifiers.speed += 0.2f;
    }
}
`;
  }

  private async addLocaleEntry(buffId: string, displayName: string): Promise<void> {
    const localePath = path.join(this.context.resourcesDir, 'locale', 'en.lang');
    const entry = `buff.${buffId}=${displayName}\n`;

    try {
      const exists = await this.fileExists(localePath);
      if (exists) {
        const content = await require('node:fs/promises').readFile(localePath, 'utf-8');
        if (!content.includes(`buff.${buffId}=`)) {
          await require('node:fs/promises').appendFile(localePath, entry);
        }
      } else {
        await this.writeFile(localePath, entry);
      }
    } catch (error) {
      console.warn('Could not update locale file. Please add manually:', entry);
    }
  }
}
