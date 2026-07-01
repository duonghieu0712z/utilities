<script setup lang="ts">
import { CopyCheckIcon, CopyIcon, FlaskConicalIcon, LinkIcon } from '@lucide/vue';

import { useClipboardCopy } from '@/composables/use-clipboard-copy';

type UrlMode = 'encode' | 'decode';

const SAMPLE_TEXT = 'https://example.com/search?q=hello world&lang=vi';
const SAMPLE_URL = 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Dvi';

const input = ref('');
const output = ref('');
const mode = ref<UrlMode>('encode');
const errorMessage = ref('');
const { copied, copy } = useClipboardCopy();

watchEffect(() => {
    if (!input.value.trim()) {
        errorMessage.value = '';
        output.value = '';

        return;
    }

    try {
        errorMessage.value = '';
        output.value =
            mode.value === 'encode'
                ? encodeURIComponent(input.value)
                : decodeURIComponent(input.value);
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Invalid URL-encoded input.';
        output.value = '';
    }
});

function selectMode(value: UrlMode, selected: boolean) {
    if (selected) {
        mode.value = value;
    }
}

function generateSample() {
    input.value = mode.value === 'encode' ? SAMPLE_TEXT : SAMPLE_URL;
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
            <LinkIcon />
            {{ errorMessage }}
        </p>
    </div>
</template>
