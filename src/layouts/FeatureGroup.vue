<script setup lang="ts">
import { ChevronRightIcon } from 'lucide-vue-next';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useFeatures, type GroupFeature } from '@/composables/use-features';

defineProps<GroupFeature>();

const { selectFeature } = useFeatures();
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
                            <SidebarMenuButton @click="selectFeature(name, feature.name)">
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
