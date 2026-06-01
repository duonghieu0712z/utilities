use tauri::{
    AppHandle, Manager, Result, Wry,
    menu::{Menu, MenuEvent, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
};

pub fn create_tray(app: &AppHandle) -> Result<()> {
    let name = &app.package_info().name;
    let icon = app
        .default_window_icon()
        .expect("default window icon must be configured")
        .clone();
    let menu = create_tray_menu(app)?;

    TrayIconBuilder::new()
        .icon(icon)
        .icon_as_template(true)
        .tooltip(name)
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(handle_menu_event)
        .on_tray_icon_event(handle_tray_event)
        .build(app)?;

    Ok(())
}

fn create_tray_menu(app: &AppHandle) -> Result<Menu<Wry>> {
    let name = &app.package_info().name;
    let quit = MenuItem::with_id(app, "quit", format!("Quit {name}"), true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&quit])?;

    Ok(menu)
}

fn handle_menu_event(app: &AppHandle, event: MenuEvent) {
    match event.id.as_ref() {
        "quit" => app.exit(0),
        _ => log::debug!("Tray menu item {:?} not handled", event.id),
    }
}

fn handle_tray_event(tray: &TrayIcon, event: TrayIconEvent) {
    match event {
        TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } => {
            let app = tray.app_handle();

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
        _ => log::debug!("Tray unhandled event {event:?}"),
    }
}
