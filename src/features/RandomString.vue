<script setup lang="ts">
import { CopyCheckIcon, CopyIcon, RefreshCwIcon } from '@lucide/vue';

import { useClipboardCopy } from '@/composables/use-clipboard-copy';

const CHARACTER_SETS = {
    Lowercase: 'abcdefghijklmnopqrstuvwxyz',
    Uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    Numbers: '0123456789',
    Symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
} as const;

type CharacterSetName = keyof typeof CHARACTER_SETS;

const length = ref(24);
const quantity = ref(5);
const enabledSets = ref<Record<CharacterSetName, boolean>>({
    Lowercase: true,
    Uppercase: true,
    Numbers: true,
    Symbols: false,
});
const strings = ref<string[]>([]);
const stringText = computed(() => strings.value.join('\n'));
const { copied, copy } = useClipboardCopy();

const activeSets = computed(() =>
    Object.entries(enabledSets.value)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name as CharacterSetName),
);

function randomIndex(size: number) {
    const limit = Math.floor(256 / size) * size;
    const bytes = new Uint8Array(1);

    do {
        crypto.getRandomValues(bytes);
    } while (bytes[0]! >= limit);

    return bytes[0]! % size;
}

function pickCharacter(characters: string) {
    return characters[randomIndex(characters.length)]!;
}

function shuffleCharacters(characters: string[]) {
    for (let index = characters.length - 1; index > 0; index -= 1) {
        const swapIndex = randomIndex(index + 1);
        const current = characters[index]!;
        characters[index] = characters[swapIndex]!;
        characters[swapIndex] = current;
    }

    return characters;
}

function generateOneString(targetLength: number) {
    const sets = activeSets.value;
    const pool = sets.map((set) => CHARACTER_SETS[set]!).join('');
    const characters: string[] = [];

    if (targetLength >= sets.length) {
        for (const set of sets) {
            characters.push(pickCharacter(CHARACTER_SETS[set]!));
        }
    }

    while (characters.length < targetLength) {
        characters.push(pickCharacter(pool));
    }

    return shuffleCharacters(characters).join('');
}

function generateStrings() {
    const safeLength = Math.max(1, Math.floor(length.value || 1));
    const safeQuantity = Math.max(1, Math.floor(quantity.value || 1));

    strings.value = Array.from({ length: safeQuantity }, () => generateOneString(safeLength));
}

function selectCharacterSet(value: CharacterSetName, selected: boolean) {
    if (!selected && activeSets.value.length === 1 && enabledSets.value[value]) {
        return;
    }

    enabledSets.value[value] = selected;
    generateStrings();
}

async function copyStrings() {
    await copy(stringText.value);
}

watch([length, quantity], generateStrings);
onMounted(generateStrings);
</script>

<template>
    <div class="mx-auto grid w-full max-w-lg gap-4">
        <div class="grid w-full grid-cols-[120px_minmax(0,1fr)] items-center gap-4">
            <Label for="string-length">Length</Label>
            <Input
                id="string-length"
                v-model.number="length"
                :min="1"
                name="string-length"
                type="number"
            />
        </div>

        <div class="grid w-full grid-cols-[120px_minmax(0,1fr)] items-center gap-4">
            <Label for="string-quantity">Quantity</Label>
            <Input
                id="string-quantity"
                v-model.number="quantity"
                :min="1"
                name="string-quantity"
                type="number"
            />
        </div>

        <div class="grid w-full grid-cols-[120px_minmax(0,1fr)] items-center gap-4">
            <Label class="justify-self-start" for="character-set">Characters</Label>
            <div class="grid w-full auto-cols-fr grid-flow-col gap-2">
                <Toggle
                    v-for="(_, name) in CHARACTER_SETS"
                    id="character-set"
                    :key="name"
                    class="w-full"
                    :model-value="enabledSets[name]"
                    variant="outline"
                    @update:model-value="selectCharacterSet(name, $event)"
                >
                    {{ name }}
                </Toggle>
            </div>
        </div>

        <CodeMirrorEditor class="h-64" :model-value="stringText" readonly wrapLine />

        <div class="flex justify-end gap-2">
            <Button size="icon" variant="outline" @click="generateStrings">
                <RefreshCwIcon />
            </Button>
            <Button :disabled="!stringText" size="icon" variant="outline" @click="copyStrings">
                <CopyCheckIcon v-if="copied" />
                <CopyIcon v-else />
            </Button>
        </div>
    </div>
</template>
