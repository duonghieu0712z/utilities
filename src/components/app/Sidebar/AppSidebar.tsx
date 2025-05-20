import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarSeparator } from '@/components/ui/sidebar';

import FooterSidebar from './FooterSidebar';
import MenuCode from './MenuCode';
import MenuImage from './MenuImage';

export default function AppSidebar() {
    return (
        <Sidebar collapsible='icon'>
            <SidebarContent className='overflow-x-hidden'>
                <SidebarGroup>
                    <SidebarMenu>
                        <MenuCode />
                        <MenuImage />
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator className='m-0' />
            <FooterSidebar />
        </Sidebar>
    );
}
