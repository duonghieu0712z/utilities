import { ChevronRight } from 'lucide-react';
import { LuCodeXml } from 'react-icons/lu';
import { SiCss3, SiHtml5, SiJavascript } from 'react-icons/si';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export default function CodeGroup() {
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

    return (
        <Collapsible key={data.name} defaultOpen className='group/collapsible' asChild>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={data.name}>
                        <data.icon />
                        <div>{data.name}</div>
                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {data.items.map((item) => (
                            <SidebarMenuSubItem key={item.name}>
                                <SidebarMenuSubButton>
                                    <item.icon />
                                    <div>{item.name}</div>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}
