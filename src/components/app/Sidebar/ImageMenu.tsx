import { Image } from 'lucide-react';
import { MdCompare } from 'react-icons/md';
import { SiConvertio } from 'react-icons/si';

import MenuSidebar from './MenuSidebar';

export default function ImageMenu() {
    const data = {
        name: 'Image',
        icon: Image,
        items: [
            {
                name: 'Converter',
                icon: SiConvertio,
            },
            {
                name: 'Comparison',
                icon: MdCompare,
            },
        ],
    };

    return <MenuSidebar {...data} />;
}
