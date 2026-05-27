<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useFeatures } from '@/composables/use-features';

const featureStore = useFeatures();
const { selectedGroup, selectedFeature } = storeToRefs(featureStore);
</script>

<template>
    <header class="flex h-10 shrink-0 items-center border-b px-2">
        <SidebarTrigger />
        <Separator class="mx-1 data-[orientation=vertical]:h-8" orientation="vertical" />
        <Breadcrumb v-if="selectedGroup && selectedFeature" class="ml-2">
            <BreadcrumbList>
                <BreadcrumbItem>{{ selectedGroup }}</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>{{ selectedFeature.name }}</BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    </header>

    <main class="h-full">
        <component :is="selectedFeature.view" v-if="selectedFeature" />
    </main>
</template>
