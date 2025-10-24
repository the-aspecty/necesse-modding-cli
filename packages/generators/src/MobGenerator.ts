import * as path from 'node:path';
import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js';

export interface MobGeneratorOptions extends GeneratorOptions {
  name: string;
  health: number;
  damage: number;
  speed?: number;
  isBoss?: boolean;
}

export class MobGenerator extends BaseGenerator {
  async generate(options: MobGeneratorOptions): Promise<void> {
    const className = this.toClassName(options.name);
    const mobId = this.toId(options.name);

    // Generate Java class
    const javaContent = this.generateJavaClass(className, mobId, options);
    const javaPath = path.join(this.context.srcDir, 'mobs', `${className}.java`);
    await this.writeFile(javaPath, javaContent);

    // Generate locale entry
    await this.addLocaleEntry(mobId, options.name);

    console.log(`✅ Generated mob: ${className}`);
    console.log(`   Java: ${javaPath}`);
    console.log(`   Don't forget to:`);
    console.log(`   1. Add texture at: resources/mobs/${mobId}.png`);
    console.log(`   2. Register in your mod's init method`);
  }

  private generateJavaClass(
    className: string,
    mobId: string,
    options: MobGeneratorOptions
  ): string {
    return `package ${this.context.packageName}.mobs;

import necesse.entity.mobs.hostile.HostileMob;
import necesse.entity.mobs.ai.behaviours.FollowOwnerBehaviour;
import necesse.entity.mobs.MobDrawable;
import necesse.gfx.camera.GameCamera;
import necesse.level.maps.Level;

public class ${className} extends HostileMob {
    
    public ${className}() {
        super(${options.health});
        this.setSpeed(${options.speed || 30.0}f);
        this.setArmor(0);
        this.collision = new Rectangle(-10, -7, 20, 14);
        this.hitBox = new Rectangle(-14, -12, 28, 24);
    }
    
    @Override
    public void init() {
        super.init();
        // Add AI behaviors here
    }
    
    @Override
    public void draw(GameCamera camera, MobDrawable drawable) {
        super.draw(camera, drawable);
    }
    
    @Override
    public int getDefaultDamage() {
        return ${options.damage};
    }
}
`;
  }

  private async addLocaleEntry(mobId: string, displayName: string): Promise<void> {
    const localePath = path.join(this.context.resourcesDir, 'locale', 'en.lang');
    const entry = `mob.${mobId}=${displayName}\n`;

    try {
      const exists = await this.fileExists(localePath);
      if (exists) {
        const content = await require('node:fs/promises').readFile(localePath, 'utf-8');
        if (!content.includes(`mob.${mobId}=`)) {
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
