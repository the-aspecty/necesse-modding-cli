import type { ModConfig } from '@necesse-modding/types';
import { getCommonFiles } from './common';

export function basicTemplate(config: ModConfig): Record<string, string> {
  const mainClassName = `${config.modId.charAt(0).toUpperCase() + config.modId.slice(1)}Mod`;
  const files = getCommonFiles(config);

  files[`src/main/java/${config.modId}/${mainClassName}.java`] = `package ${config.modId};

import necesse.engine.modLoader.annotations.ModEntry;
import necesse.engine.registries.ItemRegistry;
import necesse.inventory.recipe.Ingredient;
import necesse.inventory.recipe.Recipe;
import necesse.inventory.recipe.Recipes;
import necesse.engine.registries.RecipeTechRegistry;
import ${config.modId}.items.ExampleSword;

@ModEntry
public class ${mainClassName} {
    
    // Called first - register content (items, mobs, tiles, etc.)
    public void init() {
        System.out.println("${config.modName} is loading...");
        
  // Register items (modern API)
  ItemRegistry.registerItem("examplesword", new ExampleSword());
        
        System.out.println("${config.modName} loaded successfully!");
    }
    
    // Called second - load resources (images, sounds, etc...)
    public void initResources() {

    }
    
    // Called last - everything is loaded, safe to reference any content
    public void postInit() {

        // Add crafting recipe
        Recipes.registerModRecipe(new Recipe(
            "examplesword",                      
            1,                                
            RecipeTechRegistry.IRON_ANVIL,   
            new Ingredient[]{                 
                new Ingredient("ironbar", 5),    
                new Ingredient("anystone", 10)    
            }
        ));
        System.out.println("${config.modName} post-initialization complete!");
    }
}
`;

  files[`src/main/java/${config.modId}/items/ExampleSword.java`] = `package ${config.modId}.items;

import necesse.inventory.item.Item;
import necesse.inventory.item.toolItem.swordToolItem.SwordToolItem;

public class ExampleSword extends SwordToolItem {
    
    public ExampleSword() {
        // Constructor: (enchantCost, lootTableCategory)
        super(500, null);
        
        // Set item rarity
        this.rarity = Item.Rarity.COMMON;
        
        // Attack speed in milliseconds (300 is standard for swords)
        this.attackAnimTime.setBaseValue(300);
        
        // Attack damage (base and upgraded values)
        this.attackDamage.setBaseValue(25.0F).setUpgradedValue(1.0F, 80.0F);
        
        // Attack range in pixels
        this.attackRange.setBaseValue(60);
        
        // Knockback strength
        this.knockback.setBaseValue(100);
        
        // Enable for raid events
        this.canBeUsedForRaids = true;
    }
}
`;

  files['src/main/resources/locale/en.lang'] = `[item]
examplesword=Example Sword
examplesworddesc=A powerful example weapon
`;

  return files;
}
