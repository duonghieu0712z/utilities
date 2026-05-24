#!/usr/bin/env node

import { parsePositionals, readJson, updateFile } from './utils.js';

function parseArgs() {
    const args = parsePositionals(process.argv.slice(2));
    if (args.length !== 1 || args[0].startsWith('--')) {
        throw new Error('Usage: node scripts/bump-version.js VERSION');
    }

    return {
        version: args[0],
    };
}

async function readCurrent() {
    const packageJson = await readJson('package.json');

    return {
        version: packageJson.version,
    };
}

async function main() {
    const options = parseArgs();
    await readCurrent();

    await updateFile('package.json', [[/^(\s*"version":\s*")[^"]+(")/m, `$1${options.version}$2`]]);
    await updateFile('src-tauri/tauri.conf.json', [
        [/^(\s*"version":\s*")[^"]+(")/m, `$1${options.version}$2`],
    ]);
    await updateFile('src-tauri/Cargo.toml', [
        [/^version = "[^"]+"/m, `version = "${options.version}"`],
    ]);
}

try {
    await main();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
