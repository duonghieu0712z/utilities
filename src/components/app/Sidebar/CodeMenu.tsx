import { LuCodeXml } from 'react-icons/lu';
import { SiCss3, SiHtml5, SiJavascript } from 'react-icons/si';

import MenuSidebar from './MenuSidebar';

export default function CodeMenu() {
    const data = {
        name: 'HTML - CSS - JS',
        icon: LuCodeXml,
        items: [
            {
                name: 'HTML',
                icon: SiHtml5,
            },
            {
                name: 'CSS',
                icon: SiCss3,
            },
            {
                name: 'JS',
                icon: SiJavascript,
            },
        ],
    };

    return <MenuSidebar {...data} />;
}
