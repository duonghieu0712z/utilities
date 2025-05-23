export function formatSize(size: number) {
    if (size === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log2(size) / 10);
    return `${(size / 1024 ** i).toFixed(2)} ${units[i]}`;
}
