<script setup lang="ts">
import type { LoremUnit } from 'lorem-ipsum';

import { ChevronDownIcon, CopyCheckIcon, CopyIcon, RefreshCwIcon } from '@lucide/vue';
import { useClipboard, useTimeoutFn } from '@vueuse/core';
import { loremIpsum } from 'lorem-ipsum';

const UNITS: LoremUnit[] = ['paragraphs', 'sentences', 'words'];

const count = ref(5);
const unit = ref<LoremUnit>('paragraphs');
const text = ref('');
const copied = ref(false);

const { copy } = useClipboard();
const { start: resetCopied } = useTimeoutFn(
    () => {
        copied.value = false;
    },
    800,
    { immediate: false },
);

function generateText() {
    const safeCount = Math.max(1, Math.floor(count.value || 1));
    text.value = loremIpsum({ count: safeCount, units: unit.value });
}

function selectUnit(value: LoremUnit) {
    unit.value = value;
    generateText();
}

async function copyText() {
    if (!text.value) {
        return;
    }

    await copy(text.value);
    copied.value = true;
    resetCopied();
}

onMounted(generateText);
</script>

<template>
    <div class="mx-auto flex h-full w-full flex-col gap-4">
        <div class="flex w-full gap-4">
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

        <Textarea
            class="font-code scrollbar field-sizing-fixed flex-1 resize-none"
            :model-value="text"
            name="lorem-ipsum"
            readonly
            :spellcheck="false"
        />
    </div>
</template>
