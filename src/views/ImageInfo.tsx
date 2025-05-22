import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { useCallback, useState } from 'react';
import { BsDownload } from 'react-icons/bs';

export default function ImageInfo() {
    const [image, setImage] = useState('');

    const openImage = useCallback(async () => {
        const file = await open({ filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'webp'] }] });
        if (!file) {
            return;
        }

        const assetFile = convertFileSrc(file);
        setImage(assetFile);

        const res = await invoke('get_image_info', { path: file });
        console.log(file, res);
    }, []);

    return (
        <main className='flex size-full justify-center'>
            <div
                className='m-8 flex h-2/3 w-full flex-col items-center justify-center rounded-xs border-2 border-dashed hover:cursor-pointer'
                onClick={openImage}
            >
                {image ? (
                    <img src={image} alt={image} className='h-full object-contain' />
                ) : (
                    <>
                        <BsDownload size={128} className='mb-1' />
                        <div className='text-xl font-bold'>Click to open image</div>
                        <div>or</div>
                        <div className='text-xl font-bold'>Drag and drop image here</div>
                    </>
                )}
            </div>
        </main>
    );
}
