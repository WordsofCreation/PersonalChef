import { defineConfig } from 'astro/config';

const repositoryName = 'PersonalChef';
const githubPagesBase = `/${repositoryName}/`;

export default defineConfig({
  site: 'https://YOUR-GITHUB-USERNAME.github.io',
  base: githubPagesBase,
  output: 'static',
  outDir: './docs'
});
