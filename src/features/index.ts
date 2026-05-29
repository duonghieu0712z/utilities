import { ALargeSmallIcon, FingerprintIcon } from '@lucide/vue';

import { useFeatures } from '@/composables/use-features';

import LoremIpsum from './LoremIpsum.vue';
import Uuid from './Uuid.vue';

export function registerFeatures() {
    const { registerFeature } = useFeatures();

    registerFeature(
        'Generator',
        'Lorem Ipsum',
        'Generate placeholder text in paragraphs, sentences, or words.',
        ALargeSmallIcon,
        LoremIpsum,
    );
    registerFeature(
        'Generator',
        'UUID',
        'Generate UUID values across standard versions, including namespace-based UUIDs.',
        FingerprintIcon,
        Uuid,
    );
}
