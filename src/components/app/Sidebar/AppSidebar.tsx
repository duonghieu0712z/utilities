import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarSeparator } from '@/components/ui/sidebar';

import CodeMenu from './CodeMenu';
import FooterSidebar from './FooterSidebar';
import ImageMenu from './ImageMenu';

export default function AppSidebar() {
    return (
        <Sidebar collapsible='icon'>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <CodeMenu />
                        <ImageMenu />
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator className='m-0' />
            <FooterSidebar />
        </Sidebar>
    );
}
