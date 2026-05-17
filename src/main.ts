import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import { registerFeatures } from '@/features';

import '@/styles/globals.css';

const app = createApp(App);

app.use(createPinia()).mount('#app');

registerFeatures();
