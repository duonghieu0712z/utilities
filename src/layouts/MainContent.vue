<script setup lang="ts">
import { storeToRefs } from 'pinia';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useFeatures } from '@/composables/use-features';

const featureStore = useFeatures();
const { selectedGroup, selectedFeature } = storeToRefs(featureStore);
</script>

<template>
    <header class="flex h-10 shrink-0 items-center border-b px-1">
        <SidebarTrigger />
        <Separator orientation="vertical" class="mx-1 data-[orientation=vertical]:h-8" />
        <Breadcrumb v-if="selectedGroup && selectedFeature" class="ml-2">
            <BreadcrumbList>
                <BreadcrumbItem>{{ selectedGroup }}</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>{{ selectedFeature.name }}</BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    </header>

    <main class="h-full">
        <component v-if="selectedFeature" :is="selectedFeature.view" />
    </main>
</template>
