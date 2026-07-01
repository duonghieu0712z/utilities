<script setup lang="ts">
import type { Color } from 'culori';

import { CopyCheckIcon, CopyIcon, PaletteIcon } from '@lucide/vue';
import { clampRgb, converter, formatHex, formatHex8, formatHsl, formatRgb, parse } from 'culori';

import { useClipboardCopy } from '@/composables/use-clipboard-copy';

type ColorFormat = {
    label: string;
    value: string;
};

const input = ref('');
const copiedValue = ref('');
const { copied, copy } = useClipboardCopy();

const toRgb = converter('rgb');
const toOklab = converter('oklab');
const toOklch = converter('oklch');
const toLab = converter('lab');
const toLch = converter('lch');

const parsedColor = computed(() => {
    if (!input.value.trim()) {
        return undefined;
    }

    return parse(input.value);
});

const colorFormats = computed<ColorFormat[]>(() => {
    if (!input.value.trim()) {
        return [];
    }

    if (!parsedColor.value) {
        return [];
    }

    const color = parsedColor.value;
    const srgbColor = clampRgb(toRgb(color));

    return [
        { label: 'HEX', value: formatHex(srgbColor) },
        { label: 'HEX8', value: formatHex8(srgbColor) },
        { label: 'RGB', value: formatRgb(srgbColor) },
        { label: 'HSL', value: formatHsl(srgbColor) },
        { label: 'OKLAB', value: formatOklab(toOklab(color)) },
        { label: 'OKLCH', value: formatOklch(toOklch(color)) },
        { label: 'LAB', value: formatLab(toLab(color)) },
        { label: 'LCH', value: formatLch(toLch(color)) },
    ];
});

const errorMessage = computed(() => {
    if (!input.value.trim() || parsedColor.value) {
        return '';
    }

    return 'Invalid color input.';
});

const pickerColor = computed({
    get() {
        if (!parsedColor.value) {
            return '#3b82f6';
        }

        return formatHex(clampRgb(toRgb(parsedColor.value)));
    },
    set(value: string | number) {
        input.value = String(value);
    },
});

function formatNumber(value: number | undefined, digits = 4) {
    return Number((value ?? 0).toFixed(digits)).toString();
}

function formatPercent(value: number | undefined, digits = 2) {
    return `${formatNumber((value ?? 0) * 100, digits)}%`;
}

function formatHue(value: number | undefined) {
    return formatNumber(value, 2);
}

function formatAlpha(color: Color) {
    if (color.alpha === undefined || color.alpha >= 1) {
        return '';
    }

    return ` / ${formatNumber(color.alpha, 3)}`;
}

function formatOklab(color: Color) {
    return `oklab(${formatPercent(color.l as number)} ${formatNumber(color.a as number)} ${formatNumber(color.b as number)}${formatAlpha(color)})`;
}

function formatOklch(color: Color) {
    return `oklch(${formatPercent(color.l as number)} ${formatNumber(color.c as number)} ${formatHue(color.h as number)}${formatAlpha(color)})`;
}

function formatLab(color: Color) {
    return `lab(${formatNumber(color.l as number, 2)}% ${formatNumber(color.a as number)} ${formatNumber(color.b as number)}${formatAlpha(color)})`;
}

function formatLch(color: Color) {
    return `lch(${formatNumber(color.l as number, 2)}% ${formatNumber(color.c as number)} ${formatHue(color.h as number)}${formatAlpha(color)})`;
}

async function copyColor(value: string) {
    await copy(value);
    copiedValue.value = value;
}
</script>

<template>
    <div class="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col gap-4">
        <div class="grid shrink-0 grid-cols-[auto_minmax(0,1fr)] items-end gap-3">
            <div class="flex flex-col gap-2">
                <Label>Color</Label>
                <div
                    class="border-border h-10 w-16 shrink-0 overflow-hidden rounded-sm border bg-[linear-gradient(45deg,var(--color-muted)_25%,transparent_25%),linear-gradient(-45deg,var(--color-muted)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--color-muted)_75%),linear-gradient(-45deg,transparent_75%,var(--color-muted)_75%)] bg-size-[12px_12px] bg-position-[0_0,0_6px,6px_-6px,-6px_0]"
                >
                    <Input
                        v-model="pickerColor"
                        class="h-full w-full cursor-pointer border-0 p-0 shadow-none [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
                        type="color"
                    />
                </div>
            </div>

            <div class="flex min-w-0 flex-col gap-2">
                <Label>Value</Label>
                <Input
                    v-model="input"
                    :aria-invalid="!!errorMessage || undefined"
                    class="font-code h-10"
                    placeholder="#3b82f6, rgb(59 130 246), oklch(62% 0.18 255)"
                />
            </div>
        </div>

        <div class="border-border min-h-0 flex-1 overflow-hidden rounded-sm border">
            <div
                v-if="colorFormats.length"
                class="divide-border grid h-full min-h-0 grid-rows-8 divide-y overflow-auto"
            >
                <div
                    v-for="format in colorFormats"
                    :key="format.label"
                    class="grid min-h-12 grid-cols-[5rem_minmax(0,1fr)_2.5rem] items-center gap-3 px-3"
                >
                    <span class="text-muted-foreground text-xs font-medium">
                        {{ format.label }}
                    </span>
                    <code class="font-code truncate text-sm">
                        {{ format.value }}
                    </code>
                    <Button size="icon" variant="ghost" @click="copyColor(format.value)">
                        <CopyCheckIcon v-if="copied && copiedValue === format.value" />
                        <CopyIcon v-else />
                    </Button>
                </div>
            </div>

            <div
                v-else
                class="text-muted-foreground flex h-full min-h-0 items-center justify-center p-4"
            >
                <PaletteIcon />
            </div>
        </div>

        <p v-if="errorMessage" class="text-destructive flex shrink-0 items-center gap-2 text-sm">
            <PaletteIcon />
            {{ errorMessage }}
        </p>
    </div>
</template>
