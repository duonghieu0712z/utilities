use tauri::{AppHandle, Manager, RunEvent};

pub fn handle_run_event(app: &AppHandle, event: RunEvent) {
    match event {
        RunEvent::Reopen { .. } => restore_main_window(app),
        _ => {}
    }
}

pub(super) fn restore_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        if let Err(error) = window.unminimize() {
            log::error!("Failed to unminimize window: {error}");
        }

        if let Err(error) = window.show() {
            log::error!("Failed to show window: {error}");
        }

        if let Err(error) = window.set_focus() {
            log::error!("Failed to focus window: {error}");
        }
    }
}
