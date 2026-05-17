<script setup lang="ts">
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { useFeatures } from '@/composables/use-features';

import FeatureGroup from './FeatureGroup.vue';

const { featureGroups } = useFeatures();
</script>

<template>
    <Sidebar>
        <SidebarContent>
            <FeatureGroup
                v-for="group in featureGroups"
                :key="group.name"
                :name="group.name"
                :features="group.features"
            />
        </SidebarContent>
    </Sidebar>
</template>
