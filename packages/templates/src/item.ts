import type { ModConfig } from '@necesse-modding/types';
import { basicTemplate } from './basic';

export function itemTemplate(config: ModConfig): Record<string, string> {
  const files = basicTemplate(config);
  const mainClassName = `${config.modId.charAt(0).toUpperCase() + config.modId.slice(1)}Mod`;

  // Update main class to register bow as well
  files[`src/main/java/${config.modId}/${mainClassName}.java`] = `package ${config.modId};

import necesse.engine.modLoader.annotations.ModEntry;
import necesse.engine.registries.ItemRegistry;
import necesse.inventory.recipe.Ingredient;
import necesse.inventory.recipe.Recipe;
import necesse.inventory.recipe.Recipes;
import necesse.engine.registries.RecipeTechRegistry;
import ${config.modId}.items.ExampleSword;
import ${config.modId}.items.ExampleBow;

@ModEntry
public class ${mainClassName} {
    
    // Called first - register content (items, mobs, tiles, etc.)
    public void init() {
        System.out.println("${config.modName} is loading...");
        
    // Register items (modern API)
    ItemRegistry.registerItem("examplesword", new ExampleSword());
    ItemRegistry.registerItem("examplebow", new ExampleBow());
        
        System.out.println("${config.modName} loaded successfully!");
    }
    
    // Called second - load resources, assets and data (images, sounds, json)
    public void initResources() {
        // Use this for loading resources only. Recipe registration has moved to postInit().
    }
    
    // Called last - everything is loaded, safe to reference any content
    public void postInit() {
        // Add crafting recipes in postInit so all items/registries are available
        Recipes.registerModRecipe(new Recipe(
            "examplesword",                      
            1,                                
            RecipeTechRegistry.IRON_ANVIL,   
            new Ingredient[]{                 
                new Ingredient("ironbar", 5),    
                new Ingredient("anystone", 10)    
            }
        ));
        
        Recipes.registerModRecipe(new Recipe(
            "examplebow",                      
            1,                                
            RecipeTechRegistry.WORKBENCH,   
            new Ingredient[]{                 
                new Ingredient("wood", 20),    
                new Ingredient("anystone", 5)    
            }
        ));

        System.out.println("${config.modName} post-initialization complete!");
    }
}
`;

  // Add bow item example
  files[`src/main/java/${config.modId}/items/ExampleBow.java`] = `package ${config.modId}.items;

import necesse.inventory.item.Item;
import necesse.inventory.item.toolItem.bowToolItem.BowToolItem;

public class ExampleBow extends BowToolItem {
    
    public ExampleBow() {
        // Constructor: (enchantCost, lootTableCategory)
        super(500, null);
        
        // Item rarity
        this.rarity = Item.Rarity.UNCOMMON;
        
        // Attack speed in milliseconds
        this.attackAnimTime.setBaseValue(1000);
        
        // Arrow velocity
        this.velocity.setBaseValue(200);
        
        // Attack damage
        this.attackDamage.setBaseValue(20.0F).setUpgradedValue(1.0F, 60.0F);
    }
}
`;

  files['src/main/resources/locale/en.lang'] = `[item]
examplesword=Example Sword
examplebow=Example Bow

[itemdesc]
examplesword=A powerful example weapon
examplebow=A ranged weapon example
`;

  return files;
}
