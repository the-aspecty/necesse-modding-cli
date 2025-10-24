# create-necesse-mod — Generate Necesse 1.0+ mods & More

``@necesse-modding/cli``

Interactive CLI tool to Scaffold Necesse 1.0+ mods with modern Gradle (9.1), VSCode setup, and an automatic JDK installation via gradle plugin.

Allows adding items, mobs, tiles, and buffs & more to existing mods via CLI commands.
>More features coming soon!

## Summary

Jump to a section:

- [Quick Start](#quick-start)
- [Features](#features)
- [Modding Best Practices](#modding-best-practices)
- [Mod description, usage, items, mobs, and screenshots](#mod-description-usage-items-mobs-and-screenshots)
- [CLI Usage](#cli-usage)
- [Commands](#commands)
- [Templates](#templates)
- [What Gets Generated](#what-gets-generated)
- [After Generation](#after-generation)
- [Contributing](#contributing)
- [Requirements](#requirements)
- [Common Issues](#common-issues)
- [License](#license)
- [Getting Help](#getting-help)
- [Sponsor / Support](#sponsor--support)

## Quick Start

```bash
# Using npx (no installation required)
npx @necesse-modding/cli@latest

# Or install globally
npm install -g @necesse-modding/cli
@necesse-modding/cli --interactive

# Using Bun (Recommended)
bunx @necesse-modding/cli
```

## Features

✅ **Multiple Templates** - Basic, Item, QOL, and Empty mod templates  
✅ **Component Generators** - Add items, mobs, tiles, and buffs to existing mods  
✅ **Interactive Mode** - Guided setup with prompts  
✅ **VSCode Ready** - Includes configuration and tasks  
✅ **Gradle Build** - Auto-configured build system  
✅ **Cross-Platform** - Windows, macOS, and Linux support  
✅ **Git Init** - Optional repository initialization  


## Modding Best Practices

You can see community driven docs here: https://github.com/the-aspecty/necesse-modding-docs [WIP]
  - They provide a wealth of information on modding best practices, tutorials, and examples.

### Development: If you use vscode
It's critical to install the java extension pack by microsoft

1. Answer vscode and gradle: Y when prompted in the cli.
  a.) if u haven't already, Install the Java Extension Pack by Microsoft. It will be recommended automatically when opening a generated mod for the first time
  b.) If prompted, install the recommended extensions.
2. When opening the project gradle will download dependencies and set up, it's included with a plugin to download the proper jdk for the game automatically (version 8)
3. Wait to java server to start ( you can see it in the status bar at the bottom)
  > it will show a coffee icon with the text "Java: Ready"
4. Everything is ready including intellisense for the necesse api, happy coding!

### Mod Testing and Debugging
- Use the Gradle task `runDevClient` to launch a development instance of Necesse with your mod loaded.
- This allows for quick testing without needing to manually copy files and shows the debug console.
- Create a creative world for easy item/mob testing for example: "TestWorld"
- Create a new character to join the world and test your mod's features. "TestCharacter"
> as creative disables achievements and progression, it's best for testing.


### Naming conventions for mod names
- Avoid adding your name in the mod title, instead use the author field
- Use pascal case for the mod name, example: MyAwesomeMod
- Use lowercase for the mod id, example: myawesomemod
- Avoid special characters in the mod id

## Mod description, usage, items, mobs, and screenshots

Add a short, clear summary that explains what your mod does, then provide details for features, usage, items, mobs, and screenshots. Use the following template and examples; replace placeholders with your mod's real content.

### Short description
A one-sentence summary of the mod.
Example:
Adds new weapons, enemies, and quality-of-life features to expand late-game combat and exploration.

### Features
- Feature 1 — short phrase (e.g., New weapons and armor)
- Feature 2 — short phrase (e.g., Two new hostile mobs)
- Feature 3 — short phrase (e.g., Crafting recipes and loot tables)
- Compatibility notes (Necesse version, other mod dependencies/conflicts)

### Items — obtain & crafting
For every notable item include:
- Name — short description
- How to obtain — crafting, drop, merchant, chest, or command
- Crafting recipe (if applicable)

If your mod uses game configs or custom recipes stored in resources, mention where they live (e.g., src/main/resources/recipes or docs/recipes.md).

### Mobs — spawn, behavior, drops
For each custom mob include:
- Name — short description
- Spawn locations & conditions (biomes, light level, night/day, rare)
- Behavior (aggressive/passive, special attacks, tells)
- Drops (items, chance %, tags)
- Interaction if applicable

Example:
- Cloud Warden
  - Spawn: Biome at night
  - Behavior: Ranged dive attack, teleports when below 30% HP
  - Drops:
   - Sky Shard (100% common)
   - Warden Feather (10% rare)

### Screenshots
Include at least 2–4 screenshots: one hero image, and several detail shots (items, mobs, crafting UI).
- Recommended assets path: .github/images
- Example markdown:
  ```md
  ![Main Screenshot](.github/images/hero.png)
  ![Skyblade in-hand](.github/images/skyblade.png)
  ![Cloud Warden combat](.github/images/cloud-warden.png)
  ```
- Provide alt text and brief captions under each image if useful.

### Localization notes
- Add display names and descriptions to your locale files (e.g., src/main/resources/locale/en.lang).
Example:
```
item.yourmod.skyblade=Skyblade
item.yourmod.skyblade.desc=A swift blade forged from storm iron.
mob.yourmod.cloudwarden.name=Cloud Warden
```

### Changelog / Versioning
Add a Short link to CHANGELOG.md or a small bullet of notable changes per release.

### Publishing and Releases

- Necesse mods are published and installed via Steam workshop.
- Follow the official Necesse documentation for packaging and uploading your mod to the workshop.
- Always publish a github release with the mod jar included when releasing a new version of your mod.


## CLI Usage

### Interactive Mode (Recommended)
```bash
@necesse-modding/cli --interactive
```

### Quick Create
```bash
@necesse-modding/cli "MyAwesomeMod"
```

### With Options
```bash
@necesse-modding/cli "MyMod" \
  --author "YourName" \
  --description "An awesome mod" \
  --mod-id "mymod" \
  --game-dir "/path/to/necesse/game/directory"
```

## Commands

- `new` - Create a new mod project
- `help` - Show help information
- `add` - Add components to existing mod (items, mobs, tiles, buffs)

### Available Options
Note: `new` is the default command. Running `@necesse-modding/cli` with no subcommand will run the `new` flow.

`new` command options:

| Option | Alias | Description |
|--------|-------|-------------|
| `--interactive` | `-i` | Interactive mode with prompts (recommended). When used, additional prompts include template selection, Gradle wrapper inclusion, VSCode config, and git init. |
| `--author <name>` | `-a` | Mod author name |
| `--description <desc>` | `-d` | Mod description |
| `--mod-id <id>` | `-m` | Mod ID (lowercase, defaults to a sanitized mod name) |
| `--game-dir <path>` | `-g` | Path to the Necesse game directory (used to locate Necesse.jar or game files) |
| `--game-version <version>` | | Target Necesse game version (default: `1.0.1`) |
| `--mod-version <version>` | | Mod version (default: `1.0.0`) |
| `--clientside` | `-c` | Mark mod as client-side only (no server-side components) |
| `--output <dir>` | `-o` | Output directory for the generated project (default: `.`) |

Interactive-only prompts (shown when using `--interactive` or when omitting required args):
- Template selection: `basic`, `item`, `qol`, `empty`
- Include Gradle wrapper? (default: `true`) — the generator writes `gradle/wrapper/gradle-wrapper.properties`; run `gradle wrapper` to create `gradlew`/`gradlew.bat` scripts.
- Include VSCode configuration? (default: `true`)
- Initialize git repository? (default: `true`)

`add` command:

Usage: `@necesse-modding/cli add [type]`

- `type` (positional, optional): `item`, `mob`, `tile`, or `buff`. If omitted, the CLI will prompt you to choose.
- After choosing a type the command runs interactive prompts to collect details for the new component (name, stats, rarity, etc.). There are no dedicated long-form CLI flags for `add` at this time — use the interactive flow or pass the positional type.

## Templates

### Basic
Full-featured template with example items and proper structure.
**Best for**: New modders or general-purpose mods

### Item
Focused on weapons, tools, and item creation.
**Best for**: Mods adding new items/equipment

### QOL
Quality of life improvements template.
**Best for**: Gameplay enhancements and tweaks

### Empty
Minimal boilerplate for experienced modders.
**Best for**: Custom implementations

## What Gets Generated

```
YourMod/
├── src/main/java/yourmod/
│   ├── YourmodMod.java
│   └── items/
│       └── ExampleSword.java
├── src/main/resources/
│   ├── locale/en.lang
│   └── items/
├── lib/
├── .vscode/
│   ├── settings.json
│   └── tasks.json
├── build.gradle
├── settings.gradle
├── README.md
└── .gitignore
```

## After Generation

```bash
cd YourModName
gradle build
```

Or open in VSCode:
```bash
code YourModName
```

Press `Ctrl+Shift+B` to build in VSCode!

### Developer docs & Contributing

This README focuses on end-user usage. Developer instructions (setup, build, scripts, CI, and contribution workflow) have been moved to dedicated docs:

- Quick start: `QUICKSTART.md`
- Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Requirements

- **Node.js**: 18+ or Bun to run the CLI
- **Java**: To run Gradle and build mods
- **Gradle**: Latest version (or use Gradle via VSCode Extension)

## Common Issues

### Necesse.jar not found
Provide the correct path to your Necesse installation:
- **Windows**: `C:\Program Files (x86)\Steam\steamapps\common\Necesse\Necesse.jar`
- **macOS**: `~/Library/Application Support/Steam/steamapps/common/Necesse/Necesse.jar`
- **Linux**: `~/.steam/steam/steamapps/common/Necesse/Necesse.jar`

### Gradle not found
Install Gradle: https://gradle.org/install/

## License

MIT

## Getting Help

- 🐛 [Report Issues](https://github.com/yourusername/necesse-cli/issues)
- 🎮 [Necesse Modding Discord](https://discord.gg/7W3cHpkK)

## Sponsor / Support

If you'd like to support development of the tool and mods. Thank you!

- Ko-fi: https://ko-fi.com/aspecty

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/N4N216DNEL)

<!-- ## More mods and tools by Aspecty:
- [wip] -->

## Roadmap
- [ ] More component generators (structures, quests, etc.)
- [ ] Recipe generator with id lists
- [ ] Locale Helper Tool
