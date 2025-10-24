
import { readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

// Remove all dependencies since we're bundling everything

// biome-ignore lint/performance/noDelete: We're intentionally deleting these fields
delete pkg.dependencies;
// biome-ignore lint/performance/noDelete: We're intentionally deleting these fields
delete pkg.devDependencies;

// Keep peerDependencies if you have any
// pkg.peerDependencies stays

writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
console.log('✓ Cleaned dependencies from package.json');