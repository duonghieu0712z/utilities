<script setup lang="ts">
import AppContent from './AppContent.vue';
import AppSidebar from './AppSidebar.vue';
</script>

<template>
    <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
            <AppContent />
        </SidebarInset>
    </SidebarProvider>
</template>
