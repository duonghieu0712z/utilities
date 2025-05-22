import { HiArrowPathRoundedSquare } from 'react-icons/hi2';
import { LuImage, LuInfo } from 'react-icons/lu';
import { MdCompare } from 'react-icons/md';

import MenuSidebar from './MenuSidebar';

export default function MenuImage() {
    const data = {
        name: 'Image',
        icon: LuImage,
        items: [
            {
                name: 'Information',
                icon: LuInfo,
                url: '/image/info',
            },
            {
                name: 'Converter',
                icon: HiArrowPathRoundedSquare,
                url: '/image/converter',
            },
            {
                name: 'Comparison',
                icon: MdCompare,
                url: '/image/comparison',
            },
        ],
    };

    return <MenuSidebar {...data} />;
}
