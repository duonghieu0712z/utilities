use tauri::{
    AppHandle, Manager, Result, Wry,
    menu::{Menu, MenuEvent, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
};

pub fn create_tray(app: &AppHandle) -> Result<TrayIcon> {
    let name = &app.package_info().name;
    let icon = app.default_window_icon().unwrap().clone();
    let menu = create_tray_menu(app)?;

    let tray = TrayIconBuilder::new()
        .icon(icon)
        .title(name)
        .tooltip(name)
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(handle_menu_event)
        .on_tray_icon_event(handle_tray_event)
        .build(app)?;

    Ok(tray)
}

fn create_tray_menu(app: &AppHandle) -> Result<Menu<Wry>> {
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
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
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
        _ => log::debug!("Tray unhandled event {event:?}"),
    }
}
