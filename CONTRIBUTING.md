# Contributing to create-necesse-mod

Thanks for helping out — contributions keep this project healthy and useful for the Necesse community.

This document explains how to get the project running locally, the project layout, and best practices for contributing changes (templates, generators, docs, and CI).

## Current project status (summary)

- The CLI scaffolds Necesse 1.0+ mods using modern Gradle (9.1) templates.
- Gradle wrapper support is optional: the generator writes `gradle/wrapper/gradle-wrapper.properties` when requested; contributors should run `gradle wrapper` locally to generate platform scripts (`gradlew`, `gradlew.bat`).
- Templates were updated for Necesse 1.0+ conventions (lifecycle methods `init/initResources/postInit`, `ModifierValue` usage, and `src/main/resources/locale` localization files).
- VSCode recommended extensions and tasks are included in templates to simplify onboarding.
- The CLI supports `new` (project scaffolding) and `add` subcommands (add items, mobs, tiles, buffs to existing mods).

## Development setup

1. Clone the repository:

```powershell
git clone https://github.com/yourusername/necesse-modding-cli.git
cd necesse-modding-cli
```

2. Install dependencies (Bun is recommended but Node/npm/yarn will work if you prefer):

```powershell
bun install
```

3. Build the CLI:

```powershell
bun run build
```

4. Link the CLI for local testing (optional):

```powershell
cd apps/cli
bun link
```

Notes:
- Use the `bun` commands above if you have Bun installed. If you're using npm: replace `bun run ...` with `npm run ...`.

## Project layout

```
necesse-modding-cli/
├── apps/
│   └── cli/              # Main CLI application and templates
│       ├── src/
│       ├── dist/         # Built output
│       └── package.json
├── packages/             # Shared packages (core, templates, types, etc.)
└── package.json          # Workspace root
```

The templates and generator code live under `packages/templates` and `packages/core` in the monorepo; the CLI in `apps/cli` consumes those packages.

## Development workflow

### Run locally (development)

```powershell
cd apps/cli
bun run dev
```

This runs the CLI in watch/dev mode for quick iteration.

### Build

```powershell
bun run build
```

### Lint/Format/Typecheck

```powershell
# Format code
bun run format

# Typecheck + lint
bun run check
```

## Working on templates and generators

If you're adding a template or changing generator behavior:

1. Edit or add template files under `packages/templates/src` (see existing templates: `basic`, `item`, `qol`, `empty`).
2. Template functions should return a `Record<string, string>` mapping relative file paths to file contents.
3. Update `packages/templates/src/index.ts` to export new templates.
4. If you change shared helper behavior, update `packages/core/src` accordingly and add unit tests where useful.

Example template shape (TypeScript):

```typescript
import type { ModConfig } from 'packages/types';
import { getCommonFiles } from './common';

export function myTemplate(config: ModConfig): Record<string, string> {
  const files = getCommonFiles(config);
  files['src/main/java/yourmod/Example.java'] = `// example`;
  return files;
}
```

### Add-command generators

The CLI's `add` command supports adding components to an existing mod (item, mob, tile, buff). To extend or modify `add`:

- Look in `apps/cli/src/commands/add.ts` (or `packages/core` helpers) for the interactive prompts and file-write logic.
- Keep `add` idempotent where possible (do not overwrite existing files without prompting).

## Code style and commits

- Use TypeScript for new code.
- Follow the repository style (Biome/Prettier/ESLint where configured).
- Commit messages should follow Conventional Commits (feat/fix/docs/chore/refactor).

## Testing and verification

Before opening a PR:

1. Run unit tests (if added) and the build: `bun run build`.
2. Run `bun run check` to typecheck and lint.
3. Test generator output by running the CLI and scaffolding a sample mod:

```powershell
# local linked CLI from apps/cli
create-necesse-mod --interactive
```

4. If including the Gradle wrapper properties, run `gradle wrapper` inside the generated project to produce `gradlew` scripts and then try `./gradlew build` (or `gradlew.bat build` on Windows).

## Pull request process

1. Fork the repository and create a feature branch: `git checkout -b feat/my-feature`.
2. Make changes and add tests where appropriate.
3. Run the build and checks locally.
4. Commit and push to your fork, open a PR describing the change and linking issues if any.

## Frequently asked items

- Where is the Gradle wrapper? The CLI writes `gradle/wrapper/gradle-wrapper.properties` when requested; we intentionally avoid shipping generated platform scripts (`gradlew`, `gradlew.bat`) in the repository. Contributors should run `gradle wrapper` locally when testing generated projects.
- Which Gradle version do templates target? Gradle 9.1 (distribution referenced in the wrapper properties).
- Which Java version? Templates configure compatibility for Java 8 to match the supported runtime; check `packages/templates/src/common.ts` for specifics.

## Getting help

If you hit issues or have questions:

- Open an issue on GitHub
- Join the Necesse Modding Discord linked in the README

Thank you for contributing!

