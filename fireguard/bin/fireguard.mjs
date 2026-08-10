#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mainPath = resolve(here, '../src/main.ts');
const child = spawn(process.execPath, ['--import', 'tsx', mainPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
});
child.on('exit', (code) => {
  process.exit(code ?? 1);
});
