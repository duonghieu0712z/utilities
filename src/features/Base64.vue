<script setup lang="ts">
import { BinaryIcon, CopyCheckIcon, CopyIcon, FlaskConicalIcon } from '@lucide/vue';

import { useClipboardCopy } from '@/composables/use-clipboard-copy';

type Base64Mode = 'encode' | 'decode';

const SAMPLE_TEXT = 'Hello, Base64!';

const input = ref('');
const output = ref('');
const mode = ref<Base64Mode>('encode');
const errorMessage = ref('');
const { copied, copy } = useClipboardCopy();

function encodeBase64(value: string) {
    const bytes = new TextEncoder().encode(value);
    let binary = '';

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}

function decodeBase64(value: string) {
    const binary = atob(value.replace(/\s+/g, ''));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

watchEffect(() => {
    if (!input.value.trim()) {
        errorMessage.value = '';
        output.value = '';

        return;
    }

    try {
        errorMessage.value = '';
        output.value =
            mode.value === 'encode' ? encodeBase64(input.value) : decodeBase64(input.value);
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Invalid Base64 input.';
        output.value = '';
    }
});

function selectMode(value: Base64Mode, selected: boolean) {
    if (selected) {
        mode.value = value;
    }
}

function generateSample() {
    input.value = SAMPLE_TEXT;
}

async function copyOutput() {
    await copy(output.value);
}
</script>

<template>
    <div class="mx-auto flex min-h-0 w-full flex-1 flex-col gap-4">
        <div class="flex shrink-0 items-center justify-between gap-3">
            <ButtonGroup>
                <Toggle
                    class="w-20"
                    :model-value="mode === 'encode'"
                    variant="outline"
                    @update:model-value="selectMode('encode', $event)"
                >
                    Encode
                </Toggle>
                <Toggle
                    class="w-20"
                    :model-value="mode === 'decode'"
                    variant="outline"
                    @update:model-value="selectMode('decode', $event)"
                >
                    Decode
                </Toggle>
            </ButtonGroup>

            <div class="flex shrink-0 items-center gap-2">
                <Button variant="outline" @click="generateSample">
                    <FlaskConicalIcon />
                    Sample
                </Button>
                <Button :disabled="!output" size="icon" variant="outline" @click="copyOutput">
                    <CopyCheckIcon v-if="copied" />
                    <CopyIcon v-else />
                </Button>
            </div>
        </div>

        <div class="grid min-h-0 flex-1 grid-cols-2 gap-4">
            <CodeMirrorEditor v-model="input" class="min-h-0" wrapLine />

            <CodeMirrorEditor class="min-h-0" :model-value="output" readonly wrapLine />
        </div>

        <p v-if="errorMessage" class="text-destructive flex shrink-0 items-center gap-2 text-sm">
            <BinaryIcon />
            {{ errorMessage }}
        </p>
    </div>
</template>
