import { readFile, writeFile } from 'node:fs/promises';

export function parseOptions(args) {
    const options = {};
    const normalizedArgs = args.filter((arg) => arg !== '--');

    for (let index = 0; index < normalizedArgs.length; index += 1) {
        const arg = normalizedArgs[index];
        if (!arg.startsWith('--')) {
            throw new Error(`Unexpected argument: ${arg}`);
        }

        const key = arg.slice(2);
        const value = normalizedArgs[index + 1];
        if (!value || value.startsWith('--')) {
            throw new Error(`Missing value for --${key}`);
        }

        options[key] = value;
        index += 1;
    }

    return options;
}

export function parsePositionals(args) {
    return args.filter((arg) => arg !== '--');
}

export function replaceAll(content, replacements) {
    return replacements.reduce((updatedContent, [search, replacement]) => {
        if (search instanceof RegExp) {
            return updatedContent.replace(search, replacement);
        }

        return updatedContent.replaceAll(search, replacement);
    }, content);
}

export async function readJson(path) {
    return JSON.parse(await readFile(path, 'utf8'));
}

export async function writeJson(path, value) {
    await writeFile(path, `${JSON.stringify(value, null, 4)}\n`);
    console.log(`Updated ${path}`);
}

export async function writeText(path, value) {
    await writeFile(path, value);
    console.log(`Updated ${path}`);
}

export async function updateFile(path, replacements) {
    const content = await readFile(path, 'utf8');
    const updatedContent = replaceAll(content, replacements);
    await writeFile(path, updatedContent);
    console.log(`Updated ${path}`);
}
