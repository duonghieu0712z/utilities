import { Image } from 'lucide-react';
import { MdCompare } from 'react-icons/md';
import { SiConvertio } from 'react-icons/si';

import MenuSidebar from './MenuSidebar';

export default function MenuImage() {
    const data = {
        name: 'Image',
        icon: Image,
        items: [
            {
                name: 'Converter',
                icon: SiConvertio,
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
