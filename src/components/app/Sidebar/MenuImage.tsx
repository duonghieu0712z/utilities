import { Image } from 'lucide-react';
import { HiArrowPathRoundedSquare } from 'react-icons/hi2';
import { MdCompare } from 'react-icons/md';

import MenuSidebar from './MenuSidebar';

export default function MenuImage() {
    const data = {
        name: 'Image',
        icon: Image,
        items: [
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
