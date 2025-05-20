import { LuCodeXml } from 'react-icons/lu';
import { SiCss3, SiHtml5, SiJavascript } from 'react-icons/si';

import MenuSidebar from './MenuSidebar';

export default function MenuCode() {
    const data = {
        name: 'HTML - CSS - JS',
        icon: LuCodeXml,
        items: [
            {
                name: 'HTML',
                icon: SiHtml5,
                url: '/',
            },
            {
                name: 'CSS',
                icon: SiCss3,
                url: '/',
            },
            {
                name: 'JS',
                icon: SiJavascript,
                url: '/',
            },
        ],
    };

    return <MenuSidebar {...data} />;
}
