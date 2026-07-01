<script setup lang="ts">
import type { ClassValue } from 'vue';

import { Compartment, EditorState } from '@codemirror/state';
import { useDark } from '@vueuse/core';
import { basicSetup, EditorView } from 'codemirror';

import { cn } from '@/lib/utils';

import { EditorLanguage } from '.';
import {
    getLanguageExtension,
    getReadonlyExtensions,
    getTabExtension,
    getThemeExtensions,
    getWrappingExtension,
} from './utils';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        class?: ClassValue;
        language?: EditorLanguage;
        readonly?: boolean;
        tabSize?: number;
        wrapLine?: boolean;
    }>(),
    {
        language: EditorLanguage.TEXT,
        readonly: false,
        tabSize: 2,
        lineWrapping: false,
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const editorRef = useTemplateRef<HTMLDivElement>('editorRef');
let view: EditorView | null = null;
let syncingFromParent = false;

const isDark = useDark();

const languageCompartment = new Compartment();
const readonlyCompartment = new Compartment();
const themeCompartment = new Compartment();
const wrappingCompartment = new Compartment();
const tabCompartment = new Compartment();

watch(
    () => props.modelValue,
    (value) => {
        if (!view) {
            return;
        }

        const currentValue = view.state.doc.toString();
        if (value === currentValue) {
            return;
        }

        syncingFromParent = true;
        view.dispatch({
            changes: {
                from: 0,
                to: view.state.doc.length,
                insert: value,
            },
        });
        syncingFromParent = false;
    },
);

watch(
    () => props.language,
    (language) => {
        if (!view) {
            return;
        }

        view.dispatch({
            effects: languageCompartment.reconfigure(getLanguageExtension(language)),
        });
    },
);

watch(
    () => props.readonly,
    (readonly) => {
        if (!view) {
            return;
        }

        view.dispatch({
            effects: readonlyCompartment.reconfigure(getReadonlyExtensions(readonly)),
        });
    },
);

watch(
    () => isDark.value,
    (dark) => {
        if (!view) {
            return;
        }

        view.dispatch({
            effects: themeCompartment.reconfigure(getThemeExtensions(dark)),
        });
    },
);

watch(
    () => props.wrapLine,
    (wrapLine) => {
        if (!view) {
            return;
        }

        view.dispatch({
            effects: wrappingCompartment.reconfigure(getWrappingExtension(wrapLine)),
        });
    },
);

watch(
    () => props.tabSize,
    (tabSize) => {
        if (!view) {
            return;
        }

        view.dispatch({
            effects: tabCompartment.reconfigure(getTabExtension(tabSize)),
        });
    },
);

onMounted(() => {
    if (!editorRef.value) {
        return;
    }

    const state = EditorState.create({
        doc: props.modelValue,
        extensions: [
            basicSetup,
            languageCompartment.of(getLanguageExtension(props.language)),
            readonlyCompartment.of(getReadonlyExtensions(props.readonly)),
            themeCompartment.of(getThemeExtensions(isDark.value)),
            wrappingCompartment.of(getWrappingExtension(props.wrapLine)),
            tabCompartment.of(getTabExtension(props.tabSize)),
            EditorView.updateListener.of((update) => {
                if (!update.docChanged || syncingFromParent) {
                    return;
                }

                const value = update.state.doc.toString();
                emit('update:modelValue', value);
            }),
        ],
    });

    view = new EditorView({
        state,
        parent: editorRef.value,
    });
});

onBeforeUnmount(() => {
    if (view) {
        view.destroy();
        view = null;
    }
});
</script>

<template>
    <div
        :class="
            cn(
                'placeholder:text-muted-foreground dark:bg-input/30 flex min-h-0 w-full rounded-sm bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none',
                'focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[1.5px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                'disabled:cursor-not-allowed disabled:opacity-50',
                '[&_.cm-scroller]:scrollbar [&_.cm-content]:font-code [&_.cm-content]:cursor-text',
                'overflow-hidden',
                props.class,
            )
        "
    >
        <div ref="editorRef" class="h-full min-h-0 overflow-hidden"></div>
    </div>
</template>

<style lang="css" scoped></style>
