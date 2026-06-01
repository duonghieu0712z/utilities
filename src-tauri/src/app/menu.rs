use tauri::{
    AppHandle, Result, Wry,
    image::Image,
    menu::{
        AboutMetadata, AboutMetadataBuilder, HELP_SUBMENU_ID, MenuBuilder, MenuEvent, MenuItem,
        MenuItemBuilder, PredefinedMenuItem, Submenu, SubmenuBuilder, WINDOW_SUBMENU_ID,
    },
};

pub fn create_menu(app: &AppHandle) -> Result<()> {
    let menu = MenuBuilder::new(app)
        .items(&[
            #[cfg(target_os = "macos")]
            &create_app_menu(app)?,
            &create_edit_menu(app)?,
            #[cfg(target_os = "macos")]
            &create_view_menu(app)?,
            &create_window_menu(app)?,
            &create_help_menu(app)?,
        ])
        .build()?;

    app.set_menu(menu)?;
    app.on_menu_event(handle_menu_event);

    Ok(())
}

#[cfg(target_os = "macos")]
fn create_app_menu(app: &AppHandle) -> Result<Submenu<Wry>> {
    let name = &app.package_info().name;
    let menu = SubmenuBuilder::new(app, name)
        .about_with_text(format!("About {name}"), Some(create_about_metadata()?))
        .item(&create_updates_menu_item(app)?)
        .separator()
        .item(&create_settings_menu_item(app)?)
        .separator()
        .services()
        .separator()
        .hide_with_text(format!("Hide {name}"))
        .hide_others()
        .show_all()
        .separator()
        .quit_with_text(format!("Quit {name}"))
        .build()?;

    Ok(menu)
}

fn create_edit_menu(app: &AppHandle) -> Result<Submenu<Wry>> {
    let menu = SubmenuBuilder::new(app, "Edit")
        .undo()
        .redo()
        .separator()
        .cut()
        .copy()
        .paste()
        .select_all()
        .build()?;

    Ok(menu)
}

#[cfg(target_os = "macos")]
fn create_view_menu(app: &AppHandle) -> Result<Submenu<Wry>> {
    let menu = SubmenuBuilder::new(app, "View").fullscreen().build()?;

    Ok(menu)
}

fn create_window_menu(app: &AppHandle) -> Result<Submenu<Wry>> {
    let menu = Submenu::with_id_and_items(app, WINDOW_SUBMENU_ID, "Window", true, &[
        &PredefinedMenuItem::minimize(app, None)?,
        &PredefinedMenuItem::maximize(app, None)?,
        #[cfg(target_os = "macos")]
        &PredefinedMenuItem::separator(app)?,
        #[cfg(target_os = "macos")]
        &PredefinedMenuItem::bring_all_to_front(app, None)?,
        #[cfg(target_os = "macos")]
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::close_window(app, None)?,
    ])?;

    Ok(menu)
}

#[cfg(target_os = "macos")]
fn create_help_menu(app: &AppHandle) -> Result<Submenu<Wry>> {
    let menu = SubmenuBuilder::new(app, "Help")
        .id(HELP_SUBMENU_ID)
        .build()?;

    Ok(menu)
}

#[cfg(not(target_os = "macos"))]
fn create_help_menu(app: &AppHandle) -> Result<Submenu<Wry>> {
    let name = &app.package_info().name;
    let menu = SubmenuBuilder::new(app, "Help")
        .about_with_text(format!("About {name}"), Some(create_about_metadata()?))
        .item(&create_updates_menu_item(app)?)
        .separator()
        .item(&create_settings_menu_item(app)?)
        .separator()
        .quit_with_text(format!("Quit {name}"))
        .build()?;

    Ok(menu)
}

fn create_about_metadata() -> Result<AboutMetadata<'static>> {
    let icon = Image::from_bytes(include_bytes!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/icons/icon.png"
    )))?;
    let about = AboutMetadataBuilder::new().icon(Some(icon)).build();

    Ok(about)
}

pub(super) fn create_updates_menu_item(app: &AppHandle) -> Result<MenuItem<Wry>> {
    MenuItemBuilder::with_id("updates", "Check for Updates...").build(app)
}

pub(super) fn create_settings_menu_item(app: &AppHandle) -> Result<MenuItem<Wry>> {
    MenuItemBuilder::with_id("settings", "Settings...")
        .accelerator("CmdOrCtrl+,")
        .build(app)
}

fn handle_menu_event(_: &AppHandle, event: MenuEvent) {
    match event.id.as_ref() {
        "updates" => log::debug!("Check for updates menu item clicked"),
        "settings" => log::debug!("Settings menu item clicked"),
        _ => log::debug!("Menu item {:?} not handled", event.id),
    }
}
