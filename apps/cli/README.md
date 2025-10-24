# create-necesse-mod

🎮 CLI tool to quickly generate Necesse mod templates with best practices and VSCode support.

## Installation

### Global Installation (Recommended)
```bash
npm install -g create-necesse-mod
```

### Using npx (No Installation)
```bash
npx create-necesse-mod
```

## Usage

### Interactive Mode (Recommended)
```bash
create-necesse-mod --interactive
```

### Quick Start
```bash
create-necesse-mod "My Awesome Mod"
```

### With Options
```bash
create-necesse-mod "My Mod" \
  --author "YourName" \
  --description "An awesome Necesse mod" \
  --mod-id "mymod" \
  --game-dir "/path/to/necesse/game/directory"
```

## Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--interactive` | `-i` | Interactive mode with prompts |
| `--author <name>` | `-a` | Mod author name |
| `--description <desc>` | `-d` | Mod description |
| `--mod-id <id>` | `-m` | Mod ID (lowercase) |
| `--game-dir <path>` | `-g` | Path to the Necesse game directory |
| `--game-version <version>` | | Target Necesse game version (default: `1.0.1`) |
| `--mod-version <version>` | | Mod version (default: `1.0.0`) |
| `--clientside` | `-c` | Mark mod as client-side only |
| `--output <dir>` | `-o` | Output directory |

## Templates

- **Basic**: Full-featured starting template with example items
- **Item**: Focus on weapons, tools, and items
- **QOL**: Quality of life improvements template
- **Empty**: Minimal setup for advanced users

## Features

✅ Multiple project templates  
✅ VSCode configuration included  
✅ Gradle build system ready  
✅ Auto-copy to Necesse mods folder  
✅ Git initialization  
✅ Example code included  
✅ Cross-platform support  

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

## License

MIT
