<script setup lang="ts">
import { useFeatures } from '@/composables/use-features';

import FeatureGroup from './FeatureGroup.vue';

const { featureGroups } = useFeatures();
</script>

<template>
    <Sidebar>
        <SidebarContent class="gap-0">
            <FeatureGroup
                v-for="group in featureGroups"
                :key="group.name"
                :features="group.features"
                :name="group.name"
            />
        </SidebarContent>
    </Sidebar>
</template>
