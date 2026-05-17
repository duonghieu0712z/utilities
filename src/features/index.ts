import { ALargeSmallIcon } from 'lucide-vue-next';

import { useFeatures } from '@/composables/use-features';

import LoremIpsum from './LoremIpsum.vue';

export function registerFeatures() {
    const { registerFeature } = useFeatures();

    registerFeature('Generator', 'Lorem Ipsum', ALargeSmallIcon, LoremIpsum);
}
