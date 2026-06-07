<script setup lang="ts">
import type { GroupFeature } from '@/composables/use-features';

import { ChevronRightIcon } from '@lucide/vue';
import { storeToRefs } from 'pinia';

import { useFeatures } from '@/composables/use-features';

defineProps<GroupFeature>();

const featureStore = useFeatures();
const { selectedGroup, selectedFeature } = storeToRefs(featureStore);
const { selectFeature } = featureStore;
</script>

<template>
    <Collapsible class="group/collapsible" default-open>
        <SidebarGroup>
            <SidebarGroupLabel as-child>
                <CollapsibleTrigger>
                    {{ name }}
                    <ChevronRightIcon
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
                    />
                </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="feature in features" :key="feature.name">
                            <SidebarMenuButton
                                :is-active="
                                    selectedGroup === name && selectedFeature?.name === feature.name
                                "
                                @click="selectFeature(name, feature.name)"
                            >
                                <component :is="feature.icon" data-icon="inline-start" />
                                {{ feature.name }}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </CollapsibleContent>
        </SidebarGroup>
    </Collapsible>
</template>
