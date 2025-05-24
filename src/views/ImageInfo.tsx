import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import { extname } from '@tauri-apps/api/path';
import { message, open } from '@tauri-apps/plugin-dialog';
import { stat } from '@tauri-apps/plugin-fs';
import { useCallback, useRef, useState } from 'react';
import { BsDownload } from 'react-icons/bs';

import { useDragDrop } from '@/hooks/use-drag-drop';
import { cn } from '@/lib/utils';
import { ImageMetadata } from '@/types';
import { formatSize, inHtmlElement } from '@/utils';

const IMAGE_EXTENSIONS = ['bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'tiff', 'webp'];

export default function ImageInfo() {
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const [image, setImage] = useState('');
    const [metadata, setMetadata] = useState<ImageMetadata>();

    const [isDragging, setIsDragging] = useState(false);

    const loadImage = useCallback(async (path: string) => {
        try {
            const assetFile = convertFileSrc(path);
            const metadata: ImageMetadata = await invoke('get_image_info', { path });

            setImage(assetFile);
            setMetadata(metadata);
        } catch {
            await message('Error loading image: Invalid image file or unsupported format.', {
                kind: 'error',
                title: 'Error',
            });
        }
    }, []);

    const openImage = useCallback(async () => {
        const file = await open({ filters: [{ name: 'Image', extensions: IMAGE_EXTENSIONS }] });
        if (file) {
            await loadImage(file);
        }
    }, [loadImage]);

    useDragDrop({
        over: (event) => {
            const { x, y } = event.payload.position;
            setIsDragging(inHtmlElement(dropZoneRef.current!, x, y));
        },
        leave: () => setIsDragging(false),
        drop: async (event) => {
            setIsDragging(false);

            const { x, y } = event.payload.position;
            if (!inHtmlElement(dropZoneRef.current!, x, y)) {
                return;
            }

            const path = event.payload.paths[0];
            if (!(await stat(path)).isFile) {
                return;
            }

            if (IMAGE_EXTENSIONS.includes(await extname(path))) {
                await loadImage(path);
            }
        },
    });

    return (
        <main className='flex h-full flex-col'>
            <div
                ref={dropZoneRef}
                className={cn(
                    'group/drag mx-6 mt-6 flex min-h-0 shrink grow basis-0 flex-col items-center justify-center rounded-xs border-2 border-dashed border-zinc-600 hover:cursor-pointer active:border-white',
                    isDragging && 'border-white'
                )}
                onClick={openImage}
            >
                {image ? (
                    <img src={image} alt='preview' className='h-full object-contain hover:cursor-pointer' />
                ) : (
                    <>
                        <BsDownload
                            size={128}
                            className={cn(
                                'mb-1 fill-zinc-600 group-active/drag:fill-white hover:cursor-pointer',
                                isDragging && 'fill-white'
                            )}
                        />
                        <div
                            className={cn(
                                'text-xl font-semibold text-zinc-600 group-active/drag:text-white hover:cursor-pointer',
                                isDragging && 'text-white'
                            )}
                        >
                            Click to open image
                        </div>
                        <div
                            className={cn(
                                'text-zinc-600 group-active/drag:text-white hover:cursor-pointer',
                                isDragging && 'text-white'
                            )}
                        >
                            or
                        </div>
                        <div
                            className={cn(
                                'text-xl font-semibold text-zinc-600 group-active/drag:text-white hover:cursor-pointer',
                                isDragging && 'text-white'
                            )}
                        >
                            Drag and drop image here
                        </div>
                        <div
                            className={cn(
                                'mt-1 text-zinc-600 group-active/drag:text-white hover:cursor-pointer',
                                isDragging && 'text-white'
                            )}
                        >
                            (Supported formats:{' '}
                            {IMAGE_EXTENSIONS.filter((ext) => ext !== 'jpeg')
                                .map((ext) => ext.toUpperCase())
                                .join(', ')
                                .replace(/, ([^,]*)$/, ' or $1')}
                            )
                        </div>
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
