import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const entry of ['index.html', 'favicon.svg', 'src']) await cp(entry, `dist/${entry}`, { recursive: true });
console.log('Static site built → dist/');
