use tauri::{
    AppHandle, Result, Wry,
    menu::{Menu, MenuBuilder},
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
};

use super::{
    event::restore_main_window,
    menu::{create_settings_menu_item, create_updates_menu_item},
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
        .on_tray_icon_event(handle_tray_event)
        .build(app)?;

    Ok(())
}

fn create_tray_menu(app: &AppHandle) -> Result<Menu<Wry>> {
    let name = &app.package_info().name;
    let menu = MenuBuilder::new(app)
        .item(&create_updates_menu_item(app)?)
        .item(&create_settings_menu_item(app)?)
        .separator()
        .quit_with_text(format!("Quit {name}"))
        .build()?;

    Ok(menu)
}

fn handle_tray_event(tray: &TrayIcon, event: TrayIconEvent) {
    match event {
        TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } => {
            let app = tray.app_handle();
            restore_main_window(app);
        }
        _ => log::debug!("Tray unhandled event {event:?}"),
    }
}
