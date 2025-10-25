import * as path from 'node:path';
import { BaseGenerator, type GeneratorOptions } from './BaseGenerator.js';

export interface TileGeneratorOptions extends GeneratorOptions {
  name: string;
  isSolid?: boolean;
  toolType?: 'pickaxe' | 'axe' | 'shovel';
  dropsSelf?: boolean;
}

export class TileGenerator extends BaseGenerator {
  async generate(options: TileGeneratorOptions): Promise<void> {
    const className = `${this.toClassName(options.name)}Tile`;
    const tileId = this.toId(options.name);

    // Generate Java class
    const javaContent = this.generateJavaClass(className, tileId, options);
    const javaPath = path.join(this.context.srcDir, 'tiles', `${className}.java`);
    await this.writeFile(javaPath, javaContent);

    // Generate locale entry
    await this.addLocaleEntry(tileId, options.name);

    console.log(`✅ Generated tile: ${className}`);
    console.log(`   Java: ${javaPath}`);
    console.log(`   Don't forget to:`);
    console.log(`   1. Add texture at: resources/tiles/${tileId}.png`);
    console.log(`   2. Register in your mod's init method`);
  }

  private generateJavaClass(
    className: string,
    tileId: string,
    options: TileGeneratorOptions
  ): string {
    const toolType = options.toolType || 'pickaxe';

    return `package ${this.context.packageName}.tiles;

import necesse.level.maps.levelData.LevelData;
import necesse.level.maps.Tile;
import necesse.level.gameObject.GameObject;
import necesse.gfx.gameTexture.GameTexture;

public class ${className} extends Tile {
    
    public ${className}() {
        super("${tileId}");
        this.isSolid = ${options.isSolid !== false};
        this.roomProperties.canPlaceWallpapers = false;
    }
    
    @Override
    public void loadTextures() {
        super.loadTextures();
        // Load your custom texture here
    }
    
    @Override
    public boolean canPlaceOnLiquid() {
        return false;
    }
    
    @Override
    public int getToolType() {
        return ${toolType === 'pickaxe' ? 'PICKAXE' : toolType === 'axe' ? 'AXE' : 'SHOVEL'};
    }
    
    @Override
    public void drawPreview(Level level, int tileX, int tileY, GameTexture texture) {
        super.drawPreview(level, tileX, tileY, texture);
    }
}
`;
  }

  private async addLocaleEntry(tileId: string, displayName: string): Promise<void> {
    const localePath = path.join(this.context.resourcesDir, 'locale', 'en.lang');
    const entry = `tile.${tileId}=${displayName}\n`;

    try {
      const exists = await this.fileExists(localePath);
      if (exists) {
        const content = await require('node:fs/promises').readFile(localePath, 'utf-8');
        if (!content.includes(`tile.${tileId}=`)) {
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
