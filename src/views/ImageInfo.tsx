import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { useCallback, useState } from 'react';
import { BsDownload } from 'react-icons/bs';

import { ImageMetadata } from '@/types';
import { formatSize } from '@/utils';

export default function ImageInfo() {
    const [image, setImage] = useState('');
    const [metadata, setMetadata] = useState<ImageMetadata>();

    const openImage = useCallback(async () => {
        const file = await open({ filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'webp'] }] });
        if (!file) {
            return;
        }

        const assetFile = convertFileSrc(file);
        setImage(assetFile);

        const metadata: ImageMetadata = await invoke('get_image_info', { path: file });
        setMetadata(metadata);
    }, []);

    return (
        <main className='flex h-full flex-col'>
            <div
                className='mx-6 mt-6 flex min-h-0 shrink grow basis-0 flex-col items-center justify-center rounded-xs border-2 border-dashed border-white hover:cursor-pointer'
                onClick={openImage}
            >
                {image ? (
                    <img src={image} alt='preview' className='h-full object-contain' />
                ) : (
                    <>
                        <BsDownload size={128} className='mb-1' />
                        <div className='text-xl font-semibold'>Click to open image</div>
                        <div>or</div>
                        <div className='text-xl font-semibold'>Drag and drop image here</div>
                    </>
                )}
            </div>

            <div className='flex h-32'>
                {metadata && (
                    <div className='mx-6 my-2 grid w-full grid-cols-4 gap-x-4 text-sm'>
                        {/* Row 1 */}
                        <div className='text-right font-semibold'>File name:</div>
                        <div>{metadata.fileName}</div>
                        <div className='text-right font-semibold'>Color type:</div>
                        <div>{metadata.colorType}</div>

                        {/* Row 2 */}
                        <div className='text-right font-semibold'>File size:</div>
                        <div>{formatSize(metadata.fileSize)}</div>
                        <div className='text-right font-semibold'>Color depth:</div>
                        <div>{metadata.colorDepth}</div>

                        {/* Row 3 */}
                        <div className='text-right font-semibold'>Dimensions:</div>
                        <div>
                            {metadata.width} x {metadata.height}
                        </div>
                        <div className='text-right font-semibold'>Channels:</div>
                        <div>{metadata.channels}</div>

                        {/* Row 4 */}
                        <div className='text-right font-semibold'>Format:</div>
                        <div>{metadata.format}</div>
                        <div className='text-right font-semibold'>Has color:</div>
                        <div>{metadata.hasColor.toString()}</div>

                        {/* Row 5 */}
                        <div></div>
                        <div></div>
                        <div className='text-right font-semibold'>Has alpha:</div>
                        <div>{metadata.hasAlpha.toString()}</div>
                    </div>
                )}
            </div>
        </main>
    );
}
