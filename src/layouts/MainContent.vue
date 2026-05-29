<script setup lang="ts">
import { Laptop2Icon, MoonIcon, SunIcon } from '@lucide/vue';
import { useColorMode, useCycleList } from '@vueuse/core';
import { storeToRefs } from 'pinia';

import { useFeatures } from '@/composables/use-features';

const featureStore = useFeatures();
const { selectedGroup, selectedFeature } = storeToRefs(featureStore);

const { store: themeStore } = useColorMode();
const { state: themeState, next: nextTheme } = useCycleList(['auto', 'light', 'dark'] as const, {
    initialValue: themeStore.value,
});

watchEffect(() => (themeStore.value = themeState.value));
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

        <Button
            aria-label="Change color theme"
            class="ml-auto"
            size="icon"
            variant="outline"
            @click="nextTheme()"
        >
            <SunIcon v-if="themeStore === 'light'" />
            <MoonIcon v-else-if="themeStore === 'dark'" />
            <Laptop2Icon v-else />
        </Button>
    </header>

    <div class="flex-1 px-12 py-8">
        <component :is="selectedFeature.view" v-if="selectedFeature" />
    </div>
</template>
