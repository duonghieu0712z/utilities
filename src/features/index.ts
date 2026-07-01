import { ALargeSmallIcon, BinaryIcon, BracesIcon, FingerprintIcon, HashIcon } from '@lucide/vue';

import { useFeatures } from '@/composables/use-features';

import Base64 from './Base64.vue';
import Hash from './Hash.vue';
import Json from './Json.vue';
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
    registerFeature(
        'Crypto',
        'Hash',
        'Generate message digests from text input in Hex, Base64, or Base64url.',
        HashIcon,
        Hash,
    );
    registerFeature('Codec', 'Base64', 'Encode and decode Base64 text.', BinaryIcon, Base64);
    registerFeature(
        'Formatter',
        'JSON',
        'Format, minify, fold, and copy JSON in a single editor.',
        BracesIcon,
        Json,
    );
}
