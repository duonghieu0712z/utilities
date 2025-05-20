import { HashRouter, Route, Routes } from 'react-router';

import { AppSidebar } from '@/components/app/Sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Home from '@/views/Home';

export default function Main() {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <header className='flex h-10 shrink-0 items-center border-b px-1'>
                    <SidebarTrigger />
                </header>

                <HashRouter>
                    <Routes>
                        <Route path='/' element={<Home />} />
                    </Routes>
                </HashRouter>
            </SidebarInset>
        </SidebarProvider>
    );
}
