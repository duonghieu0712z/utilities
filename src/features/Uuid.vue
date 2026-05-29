<script setup lang="ts">
import { CopyCheckIcon, CopyIcon, RefreshCwIcon } from '@lucide/vue';
import { useClipboard, useTimeoutFn } from '@vueuse/core';
import { NIL, v1, v3, v4, v5, v6, v7, validate } from 'uuid';

const UUID_GENERATORS = {
    NIL: () => NIL,
    v1: () => v1(),
    v3: (name: string, namespace: string) => v3(name, namespace),
    v4: () => v4(),
    v5: (name: string, namespace: string) => v5(name, namespace),
    v6: () => v6(),
    v7: () => v7(),
} as const;

const UUID_NAMESPACES = {
    DNS: v3.DNS,
    URL: v3.URL,
    OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
    X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
} as const;

const NAMESPACE_OPTIONS = {
    ...UUID_NAMESPACES,
    Custom: '',
};

const generator = ref<keyof typeof UUID_GENERATORS>('v4');
const quantity = ref(1);
const name = ref('');
const namespace = ref<keyof typeof NAMESPACE_OPTIONS>('DNS');
const namespaceValue = ref(UUID_NAMESPACES.DNS);

const uuids = ref<string[]>([]);
const uuidText = computed(() => uuids.value.join('\n'));
const requiresNamespace = computed(() => generator.value === 'v3' || generator.value === 'v5');
const namespaceError = computed(() => {
    if (!requiresNamespace.value || validate(namespaceValue.value.trim())) {
        return '';
    }

    return 'Namespace must be a valid UUID.';
});

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
    const safeNamespace = namespaceValue.value.trim();

    if (namespaceError.value) {
        return;
    }

    uuids.value = Array.from({ length: safeQuantity }, () => {
        if (generator.value === 'v3') {
            return UUID_GENERATORS.v3(name.value, safeNamespace);
        }

        if (generator.value === 'v5') {
            return UUID_GENERATORS.v5(name.value, safeNamespace);
        }

        return UUID_GENERATORS[generator.value]();
    });
}

function selectGenerator(value: keyof typeof UUID_GENERATORS, selected: boolean) {
    if (selected) {
        generator.value = value;
        generateUuid();
    }
}

function selectNamespace(value: keyof typeof NAMESPACE_OPTIONS, selected: boolean) {
    if (selected) {
        namespace.value = value;

        if (value !== 'Custom') {
            namespaceValue.value = UUID_NAMESPACES[value];
        }

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
            <Label class="justify-self-start" for="version">UUID version</Label>
            <div class="grid w-full auto-cols-fr grid-flow-col gap-2">
                <Toggle
                    v-for="(_, key) in UUID_GENERATORS"
                    id="version"
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

        <template v-if="requiresNamespace">
            <div class="grid w-full grid-cols-[120px_minmax(0,1fr)] items-center gap-4">
                <Label for="name-value">Name</Label>
                <Input
                    id="name-value"
                    v-model="name"
                    name="name-value"
                    type="text"
                    @input="generateUuid"
                />
            </div>

            <div class="grid w-full grid-cols-[120px_minmax(0,1fr)] items-center gap-4">
                <Label class="justify-self-start" for="namespace">Namespace</Label>
                <div class="grid w-full auto-cols-fr grid-flow-col gap-2">
                    <Toggle
                        v-for="(_, key) in NAMESPACE_OPTIONS"
                        id="namespace"
                        :key="key"
                        class="w-full"
                        :model-value="namespace === key"
                        variant="outline"
                        @update:model-value="selectNamespace(key, $event)"
                    >
                        {{ key }}
                    </Toggle>
                </div>
            </div>

            <div class="grid w-full grid-cols-[120px_minmax(0,1fr)] items-start gap-4">
                <div />
                <div class="grid gap-2">
                    <Input
                        v-model="namespaceValue"
                        :aria-invalid="!!namespaceError"
                        class="font-code"
                        :disabled="namespace !== 'Custom'"
                        name="namespace"
                        type="text"
                        @input="generateUuid"
                    />
                    <p v-if="namespaceError" class="text-destructive text-sm">
                        {{ namespaceError }}
                    </p>
                </div>
            </div>
        </template>

        <Textarea
            id="uuid"
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
