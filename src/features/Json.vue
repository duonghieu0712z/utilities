<script setup lang="ts">
import { BracesIcon, CopyCheckIcon, CopyIcon, FlaskConicalIcon } from '@lucide/vue';

import { EditorLanguage } from '@/components/editor';
import { useClipboardCopy } from '@/composables/use-clipboard-copy';

type JsonTabSize = 2 | 4;
type JsonMode = 'format' | 'minify';

const SAMPLE_JSON = JSON.stringify(
    {
        name: 'Sample Data',
        description: 'This is a sample JSON object',
        items: [
            {
                id: 1,
                name: 'Item 1',
                price: 10.99,
                active: true,
            },
            {
                id: 2,
                name: 'Item 2',
                price: 25.5,
                active: false,
            },
        ],
    },
    null,
    2,
);

const input = ref('');
const output = ref('');
const mode = ref<JsonMode>('format');
const tabSize = ref<JsonTabSize>(2);
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
        const value = JSON.parse(input.value);

        output.value =
            mode.value === 'format'
                ? JSON.stringify(value, null, tabSize.value)
                : JSON.stringify(value);
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Invalid JSON.';
        output.value = '';
    }
});

function selectTabSize(value: JsonTabSize, selected: boolean) {
    if (selected) {
        tabSize.value = value;
    }
}

function selectMode(value: JsonMode, selected: boolean) {
    if (selected) {
        mode.value = value;
    }
}

function generateSample() {
    input.value = SAMPLE_JSON;
}

async function copyJson() {
    await copy(output.value);
}
</script>

<template>
    <div class="mx-auto flex min-h-0 w-full flex-1 flex-col gap-4">
        <div class="flex shrink-0 items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-2">
                <ButtonGroup>
                    <Toggle
                        class="w-20"
                        :model-value="mode === 'format'"
                        variant="outline"
                        @update:model-value="selectMode('format', $event)"
                    >
                        Format
                    </Toggle>
                    <Toggle
                        class="w-20"
                        :model-value="mode === 'minify'"
                        variant="outline"
                        @update:model-value="selectMode('minify', $event)"
                    >
                        Minify
                    </Toggle>
                </ButtonGroup>

                <ButtonGroup>
                    <Toggle
                        v-for="value in [2, 4] as JsonTabSize[]"
                        :key="value"
                        class="w-10"
                        :model-value="tabSize === value"
                        variant="outline"
                        @update:model-value="selectTabSize(value, $event)"
                    >
                        {{ value }}
                    </Toggle>
                </ButtonGroup>
            </div>

            <div class="flex shrink-0 items-center gap-2">
                <Button variant="outline" @click="generateSample">
                    <FlaskConicalIcon />
                    Sample
                </Button>
                <Button :disabled="!output" size="icon" variant="outline" @click="copyJson">
                    <CopyCheckIcon v-if="copied" />
                    <CopyIcon v-else />
                </Button>
            </div>
        </div>

        <div class="grid min-h-0 flex-1 grid-cols-2 gap-4">
            <CodeMirrorEditor
                v-model="input"
                :aria-invalid="!!errorMessage || undefined"
                class="min-h-0"
                :language="EditorLanguage.JSON"
                :tab-size="tabSize"
                wrapLine
            />

            <CodeMirrorEditor
                class="min-h-0"
                :language="EditorLanguage.JSON"
                :model-value="output"
                readonly
                :tab-size="tabSize"
                wrapLine
            />
        </div>

        <p v-if="errorMessage" class="text-destructive flex shrink-0 items-center gap-2 text-sm">
            <BracesIcon />
            {{ errorMessage }}
        </p>
    </div>
</template>
