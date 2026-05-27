<script setup lang="ts">
import type { LoremUnit } from 'lorem-ipsum';

import { ChevronDownIcon, CopyIcon } from '@lucide/vue';
import { useClipboard } from '@vueuse/core';
import { loremIpsum } from 'lorem-ipsum';
import { ref } from 'vue';

const UNITS: LoremUnit[] = ['paragraphs', 'sentences', 'words'];

const count = ref(5);
const unit = ref<LoremUnit>('paragraphs');
const text = ref('');

const { copy } = useClipboard();
</script>

<template>
    <div class="flex h-full flex-col gap-4 px-12 py-8">
        <div class="flex w-full gap-4">
            <InputGroup>
                <InputGroupInput :model-value="count" name="count" />
                <InputGroupAddon align="inline-end" class="-mr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger as="div">
                            <Button class="justify-end" variant="ghost">
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

            <Button variant="outline" @click="text = loremIpsum({ count, units: unit })">
                Generate
            </Button>
            <Button size="icon" variant="outline" @click="async () => await copy(text)">
                <CopyIcon />
            </Button>
        </div>

        <Textarea
            class="flex-1 resize-none text-justify font-mono text-base"
            :model-value="text"
            name="lorem-ipsum"
            readonly
            :spellcheck="false"
        />
    </div>
</template>
