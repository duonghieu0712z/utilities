<script setup lang="ts">
import { loremIpsum, type LoremUnit } from 'lorem-ipsum';
import { ChevronDownIcon, CopyIcon } from 'lucide-vue-next';
import { ref } from 'vue';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Textarea } from '@/components/ui/textarea';

const count = ref(5);
const unit = ref<LoremUnit>('paragraphs');
const text = ref('');

const UNITS: LoremUnit[] = ['paragraphs', 'sentences', 'words'];
</script>

<template>
    <div class="flex h-full flex-col gap-2 p-2">
        <div class="flex w-full gap-2">
            <InputGroup>
                <InputGroupInput :model-value="count" name="count" />
                <InputGroupAddon align="inline-end" class="-mr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger as="div">
                            <Button variant="ghost" class="w-30 justify-end">
                                {{ unit }}
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" as-child>
                            <ButtonGroup
                                class="w-30 min-w-0 p-0.5"
                                orientation="vertical"
                                spacing="spaced"
                            >
                                <DropdownMenuItem v-for="units in UNITS" :key="units" class="p-0">
                                    <Button class="w-full" @click="unit = units" variant="ghost">
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
            <Button variant="outline" size="icon">
                <CopyIcon />
            </Button>
        </div>

        <Textarea
            name="lorem-ipsum"
            :model-value="text"
            class="flex-1 resize-none text-justify text-lg"
            :spellcheck="false"
            readonly
        />
    </div>
</template>
