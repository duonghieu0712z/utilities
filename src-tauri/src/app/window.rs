use tauri::{Manager, Window, WindowEvent};

pub fn handle_window_event(window: &Window, event: &WindowEvent) {
    match event {
        WindowEvent::CloseRequested { api, .. } => {
            #[cfg(target_os = "macos")]
            if let Err(error) = window.app_handle().hide() {
                log::error!("Failed to hide app: {error}");
            }

            if let Err(error) = window.hide() {
                log::error!("Failed to hide window: {error}");
            }

            api.prevent_close();
        }
        _ => log::debug!("Window unhandled event {event:?}"),
    }
}
