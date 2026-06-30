<script setup lang="ts">
import { CopyCheckIcon, CopyIcon } from '@lucide/vue';

import { useClipboardCopy } from '@/composables/use-clipboard-copy';

const HASH_ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;
const OUTPUT_ENCODINGS = ['Hex', 'Base64', 'Base64url'] as const;

type HashAlgorithm = (typeof HASH_ALGORITHMS)[number];
type OutputEncoding = (typeof OUTPUT_ENCODINGS)[number];

interface HashResult {
    algorithm: HashAlgorithm;
    value: string;
}

const text = ref('');
const encoding = ref<OutputEncoding>('Hex');
const results = ref<HashResult[]>([]);
const { copied: copiedAlgorithm, copy } = useClipboardCopy<HashAlgorithm | undefined>(undefined);
let generation = 0;

async function digestNative(algorithm: AlgorithmIdentifier, data: Uint8Array) {
    const buffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(buffer).set(data);

    return new Uint8Array(await crypto.subtle.digest(algorithm, buffer));
}

function formatHex(bytes: Uint8Array) {
    return Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

function formatBase64(bytes: Uint8Array) {
    let binary = '';

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}

function formatBase64url(bytes: Uint8Array) {
    return formatBase64(bytes).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function formatDigest(bytes: Uint8Array, outputEncoding: OutputEncoding) {
    if (outputEncoding === 'Base64') {
        return formatBase64(bytes);
    }

    if (outputEncoding === 'Base64url') {
        return formatBase64url(bytes);
    }

    return formatHex(bytes);
}

async function generateHashes() {
    const generationId = ++generation;
    const outputEncoding = encoding.value;
    const data = new TextEncoder().encode(text.value);

    const hashResults = await Promise.all(
        HASH_ALGORITHMS.map(async (algorithm) => ({
            algorithm,
            value: formatDigest(await digestNative(algorithm, data), outputEncoding),
        })),
    );

    if (generationId === generation) {
        results.value = hashResults;
    }
}

function selectEncoding(value: OutputEncoding, selected: boolean) {
    if (selected) {
        encoding.value = value;
    }
}

async function copyHash(result: HashResult) {
    await copy(result.value, result.algorithm);
}

watch([text, encoding], () => void generateHashes(), { immediate: true });
</script>

<template>
    <div class="mx-auto grid w-full max-w-2xl gap-4">
        <Textarea
            v-model="text"
            class="scrollbar font-code field-sizing-fixed h-40 w-full resize-none"
            name="hash-input"
            placeholder="Input text"
            :spellcheck="false"
        />

        <div class="grid w-full grid-cols-[120px_minmax(0,1fr)] items-center gap-4">
            <Label class="justify-self-start" for="encoding">Encoding</Label>
            <div class="grid w-full auto-cols-fr grid-flow-col gap-2">
                <Toggle
                    v-for="outputEncoding in OUTPUT_ENCODINGS"
                    id="encoding"
                    :key="outputEncoding"
                    class="w-full"
                    :model-value="encoding === outputEncoding"
                    variant="outline"
                    @update:model-value="selectEncoding(outputEncoding, $event)"
                >
                    {{ outputEncoding }}
                </Toggle>
            </div>
        </div>

        <div class="grid gap-2">
            <div
                v-for="result in results"
                :key="result.algorithm"
                class="border-input grid min-h-0 grid-cols-[88px_minmax(0,1fr)_32px] items-center gap-3 rounded-[10px] border p-1"
            >
                <span
                    class="bg-muted text-muted-foreground rounded-sm px-2 py-1 text-center text-sm font-medium"
                >
                    {{ result.algorithm }}
                </span>
                <code class="font-code min-w-0 truncate text-sm">{{ result.value }}</code>
                <Button size="icon" variant="ghost" @click="copyHash(result)">
                    <CopyCheckIcon v-if="copiedAlgorithm === result.algorithm" />
                    <CopyIcon v-else />
                </Button>
            </div>
        </div>
    </div>
</template>
