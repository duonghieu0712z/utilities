import type { RefAutoResetReturn } from '@vueuse/core';

import { refAutoReset, useClipboard } from '@vueuse/core';

interface ClipboardCopyReturn<T> {
    copied: RefAutoResetReturn<T>;
    copy: (value: string, copiedValue: T) => Promise<boolean>;
}

interface BooleanClipboardCopyReturn {
    copied: RefAutoResetReturn<boolean>;
    copy: (value: string) => Promise<boolean>;
}

const RESET_DURATION = 800;

export function useClipboardCopy(): BooleanClipboardCopyReturn;
export function useClipboardCopy<T>(resetValue: T): ClipboardCopyReturn<T>;

export function useClipboardCopy<T>(
    resetValue?: T,
): BooleanClipboardCopyReturn | ClipboardCopyReturn<T> {
    const { copy: writeClipboard } = useClipboard();

    if (arguments.length === 0) {
        const copied = refAutoReset(false, RESET_DURATION);

        const copy = async (value: string) => {
            if (!value) {
                return false;
            }

            await writeClipboard(value);
            copied.value = true;

            return true;
        };

        return { copied, copy };
    }

    const copied = refAutoReset(resetValue as T, RESET_DURATION);

    const copy = async (value: string, copiedValue: T) => {
        if (!value) {
            return false;
        }

        await writeClipboard(value);
        copied.value = copiedValue;

        return true;
    };

    return { copied, copy };
}
