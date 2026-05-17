<script setup lang="ts">
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import AppSidebar from './AppSidebar.vue';
import MainContent from './MainContent.vue';
</script>

<template>
    <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
            <MainContent />
        </SidebarInset>
    </SidebarProvider>
</template>
