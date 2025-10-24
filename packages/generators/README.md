# Necesse CLI - Component Generators

This package provides generators for creating Necesse mod components programmatically.

## Features

- **Item Generator** - Create weapons, armor, tools, consumables, and materials
- **Mob Generator** - Generate custom enemies and NPCs
- **Tile Generator** - Create blocks and terrain tiles
- **Buff Generator** - Generate status effects and debuffs

## Usage

The generators are used internally by the CLI's `add` command, but can also be used programmatically:

```typescript
import { ItemGenerator } from '@necesse-modding/generators';
import { getModContext } from '@necesse-modding/utils';

const context = await getModContext();
const generator = new ItemGenerator(context);

await generator.generate({
  name: 'Legendary Sword',
  type: 'weapon',
  damage: 50,
  rarity: 'legendary',
  stackSize: 1
});
```

## Component Types

### Items
- **Weapons** - Swords, bows, staffs, etc.
- **Tools** - Pickaxes, axes, shovels
- **Armor** - Helmets, chest pieces, boots
- **Consumables** - Potions, food items
- **Materials** - Crafting materials and resources

### Mobs
- Custom enemies with configurable health, damage, and speed
- Boss mobs
- NPCs

### Tiles
- Solid blocks
- Terrain types
- Custom mining requirements

### Buffs
- Positive status effects
- Debuffs
- Duration-based effects

## Base Generator

All generators extend the `BaseGenerator` class which provides:
- Name formatting utilities (PascalCase, camelCase, lowercase ID)
- File writing helpers
- File existence checks
