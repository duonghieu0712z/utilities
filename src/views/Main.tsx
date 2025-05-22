import { HashRouter, Route, Routes } from 'react-router';

import { AppSidebar } from '@/components/app/Sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import Home from './Home';
import ImageComparison from './ImageComparison';
import ImageConverter from './ImageConverter';
import ImageInfo from './ImageInfo';

export default function Main() {
    return (
        <HashRouter>
            <SidebarProvider>
                <AppSidebar />

                <SidebarInset>
                    <header className='flex h-10 shrink-0 items-center border-b px-1'>
                        <SidebarTrigger />
                    </header>

                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='image'>
                            <Route path='info' element={<ImageInfo />} />
                            <Route path='converter' element={<ImageConverter />} />
                            <Route path='comparison' element={<ImageComparison />} />
                        </Route>
                    </Routes>
                </SidebarInset>
            </SidebarProvider>
        </HashRouter>
    );
}
