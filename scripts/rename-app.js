#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

import { parseOptions, readJson, updateFile, writeJson, writeText } from './utils.js';

function parseArgs() {
    const options = parseOptions(process.argv.slice(2));

    if (!options.name || !options.id) {
        throw new Error(
            'Usage: node scripts/rename-app.js --name "App Name" --id "com.example.app" [--author "Author Name"]',
        );
    }

    return options;
}

function toKebabCase(value) {
    return value
        .trim()
        .replace(/['"]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

function toSnakeCase(value) {
    return toKebabCase(value).replaceAll('-', '_');
}

function replaceOne(content, pattern, replacement, description) {
    if (!pattern.test(content)) {
        throw new Error(`Could not update ${description}`);
    }

    return content.replace(pattern, replacement);
}

async function readCurrent() {
    const packageJson = await readJson('package.json');
    const tauriConfig = await readJson('src-tauri/tauri.conf.json');
    const cargoToml = await readFile('src-tauri/Cargo.toml', 'utf8');

    const crateName = cargoToml.match(/^name = "([^"]+)"/m)?.[1];
    const crateLibName = cargoToml.match(/^\[lib\]\s+[\s\S]*?^name = "([^"]+)"/m)?.[1];
    const author = cargoToml.match(/^authors = \["([^"]+)"\]/m)?.[1];

    if (
        !packageJson.name ||
        !tauriConfig.productName ||
        !tauriConfig.identifier ||
        !crateName ||
        !crateLibName ||
        !author
    ) {
        throw new Error('Could not read current project identity');
    }
}

async function main() {
    const options = parseArgs();
    await readCurrent();
    const appName = options.name.trim();
    const appId = options.id.trim();
    const author = options.author?.trim();
    const packageName = options.package?.trim() || toKebabCase(appName);
    const crateName = toKebabCase(packageName);
    const crateLibName = `${toSnakeCase(crateName)}_lib`;

    const packageJson = await readJson('package.json');
    packageJson.name = packageName;
    if (author) {
        packageJson.author = author;
    }

    await writeJson('package.json', packageJson);

    await updateFile('index.html', [[/<title>.*<\/title>/, `<title>${appName}</title>`]]);

    const tauriConfig = await readJson('src-tauri/tauri.conf.json');
    tauriConfig.productName = appName;
    tauriConfig.identifier = appId;
    tauriConfig.app.windows = tauriConfig.app.windows.map((window) => ({
        ...window,
        title: window.title ? appName : window.title,
    }));
    if (author) {
        tauriConfig.bundle.publisher = author;
    }

    await writeJson('src-tauri/tauri.conf.json', tauriConfig);

    let cargoToml = await readFile('src-tauri/Cargo.toml', 'utf8');
    cargoToml = replaceOne(
        cargoToml,
        /^name = "([^"]+)"/m,
        `name = "${crateName}"`,
        'Cargo package name',
    );
    cargoToml = replaceOne(
        cargoToml,
        /^description = "([^"]+)"/m,
        `description = "${appName}"`,
        'Cargo description',
    );
    if (author) {
        cargoToml = replaceOne(
            cargoToml,
            /^authors = \[[^\]]*\]/m,
            `authors = ["${author}"]`,
            'Cargo authors',
        );
    }
    cargoToml = replaceOne(
        cargoToml,
        /^(\[lib\]\s+[\s\S]*?^name = )"([^"]+)"/m,
        `$1"${crateLibName}"`,
        'Cargo lib name',
    );
    await writeText('src-tauri/Cargo.toml', cargoToml);

    await updateFile('src-tauri/src/main.rs', [
        [/^[a-zA-Z0-9_]+_lib::run\(\);$/m, `${crateLibName}::run();`],
    ]);

    await updateFile('.github/workflows/release.yml', [
        [/^(\s*releaseName:\s*).*$/m, `$1${appName} v__VERSION__`],
    ]);
}

try {
    await main();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
