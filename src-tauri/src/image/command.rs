use super::info;

#[tauri::command]
pub(crate) fn get_image_info(path: &str) -> info::ImageMetadata {
    info::get_metadata(path).unwrap()
}
