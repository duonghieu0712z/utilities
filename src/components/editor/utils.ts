import type { DecorationSet, ViewUpdate } from '@codemirror/view';

import { indentWithTab } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';
import { indentUnit } from '@codemirror/language';
import { EditorState, RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView, keymap, ViewPlugin } from '@codemirror/view';

import { EditorLanguage } from '.';

export function getLanguageExtension(language: EditorLanguage) {
    switch (language) {
        case EditorLanguage.JSON:
            return json();
        case EditorLanguage.TEXT:
            return [];
    }
}

export function getReadonlyExtensions(readonly: boolean) {
    return [EditorView.editable.of(!readonly), EditorState.readOnly.of(readonly)];
}

export function getThemeExtensions(dark: boolean) {
    const subtleBackground = dark ? 'oklch(1 0 0 / 6%)' : 'oklch(0 0 0 / 4%)';
    const selectionBackground = dark ? 'oklch(0.62 0.2 255 / 34%)' : 'oklch(0.68 0.18 255 / 28%)';
    const searchBackground = dark ? 'oklch(0.78 0.18 70 / 38%)' : 'oklch(0.82 0.17 75 / 45%)';
    const indentGuideColor = dark ? 'oklch(1 0 0 / 14%)' : 'oklch(0 0 0 / 12%)';

    return EditorView.theme({
        '&': {
            backgroundColor: 'transparent',
            color: 'var(--foreground)',
            height: '100%',
        },
        '&.cm-focused': {
            outline: 'none',
        },
        '.cm-content': {
            caretColor: 'var(--foreground)',
            minHeight: '100%',
            padding: 0,
        },
        '.cm-indent-guide': {
            backgroundImage: `linear-gradient(to right, ${indentGuideColor}, ${indentGuideColor})`,
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1px 100%',
        },
        '.cm-scroller': {
            overflow: 'auto',
            padding: '4px',
        },
        '.cm-cursor': {
            borderLeftColor: 'var(--foreground)',
        },
        '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': {
            backgroundColor: selectionBackground,
        },
        '.cm-gutters': {
            backgroundColor: 'transparent',
            borderRight: 'none',
            color: 'var(--muted-foreground)',
        },
        '.cm-activeLine, .cm-activeLineGutter': {
            backgroundColor: 'transparent',
        },
        '&.cm-focused .cm-activeLine, &.cm-focused .cm-activeLineGutter': {
            backgroundColor: subtleBackground,
        },
        '.cm-placeholder': {
            color: 'var(--muted-foreground)',
        },
        '.cm-matchingBracket': {
            backgroundColor: subtleBackground,
            color: 'var(--foreground)',
        },
        '.cm-nonmatchingBracket': {
            backgroundColor: 'var(--destructive)',
            color: 'var(--primary-foreground)',
        },
        '.cm-searchMatch': {
            backgroundColor: searchBackground,
        },
        '.cm-searchMatch.cm-searchMatch-selected': {
            backgroundColor: selectionBackground,
        },
        '.cm-tooltip, .cm-panels': {
            backgroundColor: 'var(--popover)',
            borderColor: 'var(--border)',
            color: 'var(--popover-foreground)',
        },
    });
}

function buildIndentGuides(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>();
    const indentGuide = Decoration.mark({ class: 'cm-indent-guide' });
    const tabSize = view.state.tabSize;

    for (const { from, to } of view.visibleRanges) {
        for (let position = from; position <= to;) {
            const line = view.state.doc.lineAt(position);
            const text = line.text;
            let column = 0;

            for (let index = 0; index < text.length; index += 1) {
                const character = text[index];

                if (character === ' ') {
                    column += 1;
                } else if (character === '\t') {
                    column += tabSize - (column % tabSize);
                } else {
                    break;
                }

                if (column % tabSize === 1) {
                    builder.add(line.from + index, line.from + index + 1, indentGuide);
                }
            }

            position = line.to + 1;
        }
    }

    return builder.finish();
}

export function getIndentGuideExtension() {
    return ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;

            constructor(view: EditorView) {
                this.decorations = buildIndentGuides(view);
            }

            update(update: ViewUpdate) {
                if (
                    update.docChanged ||
                    update.viewportChanged ||
                    update.startState.tabSize !== update.state.tabSize
                ) {
                    this.decorations = buildIndentGuides(update.view);
                }
            }
        },
        {
            decorations: (value) => value.decorations,
        },
    );
}

export function getWrappingExtension(enabled: boolean) {
    return enabled ? EditorView.lineWrapping : [];
}

export function getTabExtension(tabSize: number) {
    const unit = ' '.repeat(tabSize);
    return [indentUnit.of(unit), EditorState.tabSize.of(tabSize), keymap.of([indentWithTab])];
}
