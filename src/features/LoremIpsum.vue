<script setup lang="ts">
import type { LoremUnit } from 'lorem-ipsum';

import { ChevronDownIcon, CopyCheckIcon, CopyIcon, RefreshCwIcon } from '@lucide/vue';
import { loremIpsum } from 'lorem-ipsum';

import { useClipboardCopy } from '@/composables/use-clipboard-copy';

const UNITS: LoremUnit[] = ['paragraphs', 'sentences', 'words'];

const count = ref(5);
const unit = ref<LoremUnit>('paragraphs');
const text = ref('');
const { copied, copy } = useClipboardCopy();

function generateText() {
    const safeCount = Math.max(1, Math.floor(count.value || 1));
    text.value = loremIpsum({ count: safeCount, units: unit.value });
}

function selectUnit(value: LoremUnit) {
    unit.value = value;
    generateText();
}

async function copyText() {
    await copy(text.value);
}

onMounted(generateText);
</script>

<template>
    <div class="mx-auto flex min-h-0 w-full flex-1 flex-col gap-4">
        <div class="flex w-full shrink-0 gap-2">
            <InputGroup>
                <InputGroupInput
                    v-model.number="count"
                    :min="1"
                    name="count"
                    type="number"
                    @input="generateText"
                />
                <InputGroupAddon align="inline-end" class="-mr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger as="div">
                            <Button
                                class="justify-end hover:bg-transparent dark:hover:bg-transparent"
                                variant="ghost"
                            >
                                {{ unit }}
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" as-child>
                            <ButtonGroup
                                class="w-30 min-w-0 p-0.5"
                                orientation="vertical"
                                spacing="spaced"
                            >
                                <DropdownMenuItem v-for="units in UNITS" :key="units" class="p-0">
                                    <Button
                                        class="w-full"
                                        variant="ghost"
                                        @click="selectUnit(units)"
                                    >
                                        {{ units }}
                                    </Button>
                                </DropdownMenuItem>
                            </ButtonGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </InputGroupAddon>
            </InputGroup>

            <Button size="icon" variant="outline" @click="generateText">
                <RefreshCwIcon />
            </Button>
            <Button :disabled="!text" size="icon" variant="outline" @click="copyText">
                <CopyCheckIcon v-if="copied" />
                <CopyIcon v-else />
            </Button>
        </div>

        <CodeMirrorEditor class="flex-1" :model-value="text" readonly wrapLine />
    </div>
</template>
