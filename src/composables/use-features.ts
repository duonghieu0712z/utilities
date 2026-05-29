import type { LucideIcon } from '@lucide/vue';
import type { Component } from 'vue';

import { defineStore } from 'pinia';
import { markRaw, ref } from 'vue';

interface Feature {
    name: string;
    description: string;
    icon: LucideIcon;
    view: Component;
}

export interface GroupFeature {
    name: string;
    features: Feature[];
}

export const useFeatures = defineStore('features', () => {
    const featureGroups = ref<GroupFeature[]>([]);
    const selectedGroup = ref<string | undefined>(undefined);
    const selectedFeature = ref<Feature | undefined>(undefined);

    const registerFeature = (
        groupName: string,
        featureName: string,
        featureDescription: string,
        icon: LucideIcon,
        view: Component,
    ) => {
        if (!featureGroups.value.some((group) => group.name === groupName)) {
            featureGroups.value.push({ name: groupName, features: [] });
        }

        const group = featureGroups.value.find((group) => group.name === groupName)!;
        if (group.features.some((feature) => feature.name === featureName)) {
            return;
        }

        group.features.push({
            name: featureName,
            description: featureDescription,
            icon,
            view: markRaw(view),
        });
    };

    const selectFeature = (groupName: string, featureName: string) => {
        const group = featureGroups.value.find((group) => group.name === groupName);
        selectedGroup.value = group?.name;
        selectedFeature.value = group?.features.find((feature) => feature.name === featureName);
    };

    return { featureGroups, selectedGroup, selectedFeature, registerFeature, selectFeature };
});
