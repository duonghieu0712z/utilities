use super::info;

#[tauri::command]
pub(crate) fn get_image_info(path: &str) -> Result<info::ImageMetadata, String> {
    info::get_metadata(path).map_err(|err| err.to_string())
}
