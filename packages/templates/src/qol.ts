import type { ModConfig } from '@necesse-modding/types';
import { getCommonFiles } from './common';

export function qolTemplate(config: ModConfig): Record<string, string> {
  const mainClassName = `${config.modId.charAt(0).toUpperCase() + config.modId.slice(1)}Mod`;
  const files = getCommonFiles(config);

  files[`src/main/java/${config.modId}/${mainClassName}.java`] = `package ${config.modId};

import necesse.engine.modLoader.annotations.ModEntry;

@ModEntry
public class ${mainClassName} {
    
    // Called first - register content (items, mobs, tiles, etc.)
    public void init() {
        System.out.println("${config.modName} - QOL improvements loading...");
        
        // Add your QOL features here
        // Examples:
        // - Custom settings
        // - Game tweaks
        
        System.out.println("${config.modName} - QOL features loaded!");
    }
    
    // Called second - load resources
    public void initResources() {
        // Load resources
    }
    
    // Called last - everything is loaded, safe to reference any content
    public void postInit() {
        System.out.println("${config.modName} - QOL post-initialization complete!");
    }
}
`;

  return files;
}
