import { Event } from '@tauri-apps/api/event';
import { DragDropEvent, getCurrentWebview } from '@tauri-apps/api/webview';
import { useEffect } from 'react';

type EventCallbackAsync<T> = (event: Event<T>) => void | Promise<void>;

interface DragDropCallbacks {
    enter?: EventCallbackAsync<Extract<DragDropEvent, { type: 'enter' }>>;
    over?: EventCallbackAsync<Extract<DragDropEvent, { type: 'over' }>>;
    drop?: EventCallbackAsync<Extract<DragDropEvent, { type: 'drop' }>>;
    leave?: EventCallbackAsync<Extract<DragDropEvent, { type: 'leave' }>>;
}

export function useDragDrop(callbacks: DragDropCallbacks) {
    useEffect(() => {
        const unlisten = getCurrentWebview().onDragDropEvent(async (event) => {
            await callbacks[event.payload.type]?.(event as any);
        });

        return () => {
            unlisten.then((cb) => cb());
        };
    });
}
