import Logo from '@/assets/logo.svg?react';
import { SidebarFooter, SidebarMenuButton } from '@/components/ui/sidebar';

export default function FooterSidebar() {
    return (
        <SidebarFooter>
            <SidebarMenuButton>
                <Logo width={24} height={24} viewBox='0 0 512 512' />
                <div className='flex w-full items-baseline justify-between'>
                    <div className='text-left'>Utilities</div>
                    <div className='text-right text-[10px]'>v{__APP_VERSION__}</div>
                </div>
            </SidebarMenuButton>
        </SidebarFooter>
    );
}
