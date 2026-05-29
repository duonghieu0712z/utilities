<script setup lang="ts">
import { CopyCheckIcon, CopyIcon, RefreshCwIcon } from '@lucide/vue';
import { useClipboard, useTimeoutFn } from '@vueuse/core';
import { NIL, v1, v4, v6, v7 } from 'uuid';

const UUID_GENERATORS = {
    NIL: () => NIL,
    v1: () => v1(),
    v4: () => v4(),
    v6: () => v6(),
    v7: () => v7(),
};

const generator = ref<keyof typeof UUID_GENERATORS>('v1');
const quantity = ref(1);

const uuids = ref<string[]>([]);
const uuidText = computed(() => uuids.value.join('\n'));

const copied = ref(false);

const { copy } = useClipboard();
const { start: resetCopied } = useTimeoutFn(
    () => {
        copied.value = false;
    },
    800,
    { immediate: false },
);

function generateUuid() {
    const safeQuantity = Math.max(1, Math.floor(quantity.value || 1));
    uuids.value = Array.from({ length: safeQuantity }, () => UUID_GENERATORS[generator.value]());
}

function selectGenerator(value: keyof typeof UUID_GENERATORS, selected: boolean) {
    if (selected) {
        generator.value = value;
        generateUuid();
    }
}

async function copyUuid() {
    if (!uuidText.value) {
        return;
    }

    await copy(uuidText.value);
    copied.value = true;
    resetCopied();
}

onMounted(generateUuid);
</script>

<template>
    <div class="mx-auto grid w-full max-w-lg gap-4">
        <div class="grid w-full grid-cols-[120px_minmax(0,1fr)] items-center gap-4">
            <Label class="justify-self-start">UUID version</Label>
            <div class="grid w-full auto-cols-fr grid-flow-col gap-2">
                <Toggle
                    v-for="(_, key) in UUID_GENERATORS"
                    :key="key"
                    class="w-full"
                    :model-value="generator === key"
                    variant="outline"
                    @update:model-value="selectGenerator(key, $event)"
                >
                    {{ key }}
                </Toggle>
            </div>
        </div>

        <div class="grid w-full grid-cols-[120px_minmax(0,1fr)] items-center gap-4">
            <Label for="quantity">Quantity</Label>
            <Input
                id="quantity"
                v-model.number="quantity"
                :min="1"
                name="quantity"
                type="number"
                @input="generateUuid"
            />
        </div>

        <Textarea
            class="scrollbar font-code h-52 w-full resize-none text-center"
            :model-value="uuidText"
            readonly
            :spellcheck="false"
        />

        <div class="flex justify-end gap-2">
            <Button size="icon" variant="outline" @click="generateUuid">
                <RefreshCwIcon />
            </Button>
            <Button :disabled="!uuidText" size="icon" variant="outline" @click="copyUuid">
                <CopyCheckIcon v-if="copied" />
                <CopyIcon v-else />
            </Button>
        </div>
    </div>
</template>
