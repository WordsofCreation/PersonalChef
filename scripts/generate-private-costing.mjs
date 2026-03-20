import { mkdir, writeFile } from 'node:fs/promises';
import { generatePrivateRecipeCosting } from './lib/privateCosting.mjs';

const outputPath = new URL('../src/generated/private-recipe-costing.json', import.meta.url);

const data = generatePrivateRecipeCosting();
await mkdir(new URL('../src/generated/', import.meta.url), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

console.log(`Generated ${data.recipes.length} private recipe costing records at ${outputPath.pathname}`);
