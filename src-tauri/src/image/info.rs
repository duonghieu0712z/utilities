use image::GenericImageView;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ImageMetadata {
    name: String,
    file_size: u64,
    width: u32,
    height: u32,
    format: String,
    color_type: String,
    color_depth: u16,
    channels: u8,
    has_color: bool,
    has_alpha: bool,
}

pub fn get_metadata(path: &str) -> Result<ImageMetadata, Box<dyn std::error::Error>> {
    let reader = image::ImageReader::open(path)?.with_guessed_format()?;
    let format = reader.format().unwrap();

    let img = reader.decode()?;
    let color = img.color();
    let (width, height) = img.dimensions();

    let filename = std::path::Path::new(path)
        .file_name()
        .and_then(|s| s.to_str())
        .unwrap();
    let size = std::fs::metadata(path)?.len();

    let metadata = ImageMetadata {
        name: filename.to_string(),
        file_size: size,
        width: width,
        height: height,
        format: format!("{:?}", format).to_uppercase(),
        color_type: format!("{:?}", color).to_uppercase(),
        color_depth: color.bits_per_pixel(),
        channels: color.channel_count(),
        has_color: color.has_color(),
        has_alpha: color.has_alpha(),
    };
    Ok(metadata)
}
