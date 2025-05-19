import { ChevronRight } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

type MenuItem = {
    name: string;
    icon: React.ElementType;
};

type MenuSidebarProps = {
    name: string;
    icon: React.ElementType;
    items: MenuItem[];
};

export default function MenuSidebar({ ...props }: MenuSidebarProps) {
    return (
        <Collapsible key={props.name} defaultOpen className='group/collapsible' asChild>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={props.name}>
                        <props.icon />
                        <div>{props.name}</div>
                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {props.items.map((item) => (
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
