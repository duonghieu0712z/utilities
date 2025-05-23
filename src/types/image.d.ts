export interface ImageMetadata {
    fileName: string;
    fileSize: number;
    width: number;
    height: number;
    format: string;
    colorType: string;
    colorDepth: number;
    channels: number;
    hasColor: boolean;
    hasAlpha: boolean;
}
