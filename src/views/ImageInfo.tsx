import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { useCallback, useState } from 'react';
import { LuImage } from 'react-icons/lu';

export default function ImageInfo() {
    const [image, setImage] = useState('');

    const openImage = useCallback(async () => {
        const file = await open({ filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'webp'] }] });
        if (!file) {
            return;
        }

        const assetFile = convertFileSrc(file);
        setImage(assetFile);

        const res = await invoke('get_metadata', { path: file });
        console.log(file, res);
    }, []);

    return (
        <main className='flex size-full justify-center'>
            <div
                className='m-8 flex h-[400px] w-full items-center justify-center rounded-xs border-2 border-dashed hover:cursor-pointer'
                onClick={openImage}
            >
                {image ? <img src={image} alt={image} className='size-full object-contain' /> : <LuImage size={128} />}
            </div>
        </main>
    );
}
