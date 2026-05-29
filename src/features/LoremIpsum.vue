<script setup lang="ts">
import type { LoremUnit } from 'lorem-ipsum';

import { ChevronDownIcon, CopyCheckIcon, CopyIcon } from '@lucide/vue';
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
    text.value = loremIpsum({ count: count.value, units: unit.value });
}

async function copyText() {
    if (!text.value) {
        return;
    }

    await copy(text.value);
    copied.value = true;
    resetCopied();
}
</script>

<template>
    <div class="flex h-full flex-col gap-6">
        <div class="flex w-full gap-4">
            <InputGroup>
                <InputGroupInput
                    v-model.number="count"
                    class="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    min="1"
                    name="count"
                    type="number"
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
                                    <Button class="w-full" variant="ghost" @click="unit = units">
                                        {{ units }}
                                    </Button>
                                </DropdownMenuItem>
                            </ButtonGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </InputGroupAddon>
            </InputGroup>

            <Button variant="outline" @click="generateText">Generate</Button>
            <Button :disabled="!text" size="icon" variant="outline" @click="copyText">
                <CopyCheckIcon v-if="copied" />
                <CopyIcon v-else />
            </Button>
        </div>

        <Textarea
            class="font-code scrollbar flex-1 resize-none"
            :model-value="text"
            name="lorem-ipsum"
            readonly
            :spellcheck="false"
        />
    </div>
</template>
