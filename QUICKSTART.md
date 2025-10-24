# Quick Start Guide

## For Users

### Install globally
```bash
npm install -g create-necesse-mod
```

### Use with npx (no installation)
```bash
npx create-necesse-mod
```

### Interactive mode
```bash
create-necesse-mod --interactive
```

### Quick create
```bash
create-necesse-mod "MyAwesomeMod" --author "YourName"
```

## For Developers

### Setup
```bash
git clone https://github.com/the-aspecty/necesse-modding-cli.git
cd necesse-modding-cli
bun install
```

### Development
```bash
cd apps/cli
bun run dev
```

### Build
```bash
bun run build
```

### Test locally
```bash
cd apps/cli
bun link
create-necesse-mod --interactive
```

## Templates Available

- **Basic** - Full-featured template with examples
- **Item** - Focused on items and weapons
- **QOL** - Quality of life improvements
- **Empty** - Minimal boilerplate

## What Gets Generated

```
YourMod/
├── src/main/java/yourmod/
│   ├── YourmodMod.java
│   └── items/
├── src/main/resources/
│   └── locale/en.lang
├── .vscode/              # VSCode config
├── build.gradle
├── mod.json
└── README.md
```

## Next Steps After Generation

1. `cd YourModName`
2. `gradle build`
3. Open in VSCode: `code .`
4. Start coding!

## Common Issues

### Necesse.jar not found
Make sure to provide the correct path to your Necesse installation.

**Windows**: `C:\Program Files (x86)\Steam\steamapps\common\Necesse\Necesse.jar`
**macOS**: `~/Library/Application Support/Steam/steamapps/common/Necesse/Necesse.jar`
**Linux**: `~/.steam/steam/steamapps/common/Necesse/Necesse.jar`

### Gradle not found
Install Gradle: https://gradle.org/install/

### Java version issues
Necesse mods require Java. Install from: https://adoptium.net/


