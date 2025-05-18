import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import AppSidebar from './AppSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className='flex h-10 shrink-0 items-center border-b px-1'>
                    <SidebarTrigger />
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
