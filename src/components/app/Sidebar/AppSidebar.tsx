import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarSeparator } from '@/components/ui/sidebar';

import CodeGroup from './CodeGroup';
import FooterSidebar from './FooterSidebar';

export default function AppSidebar() {
    return (
        <Sidebar collapsible='icon'>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <CodeGroup />
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator className='m-0' />
            <FooterSidebar />
        </Sidebar>
    );
}
