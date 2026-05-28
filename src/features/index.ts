import { ALargeSmallIcon, FingerprintIcon } from '@lucide/vue';

import { useFeatures } from '@/composables/use-features';

import LoremIpsum from './LoremIpsum.vue';
import Uuid from './Uuid.vue';

export function registerFeatures() {
    const { registerFeature } = useFeatures();

    registerFeature('Generator', 'Lorem Ipsum', ALargeSmallIcon, LoremIpsum);
    registerFeature('Generator', 'UUID', FingerprintIcon, Uuid);
}
