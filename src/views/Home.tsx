import Logo from '@/assets/logo.svg?react';

export default function Home() {
    return (
        <main className='flex h-full flex-col items-center justify-center'>
            <Logo width={100} height={100} viewBox='0 0 512 512' />
            <div className='mt-2 text-4xl font-bold'>Utilities App</div>
            <div className='text-xs'>Version: {__APP_VERSION__}</div>
        </main>
    );
}
