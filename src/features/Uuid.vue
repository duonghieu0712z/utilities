<script setup lang="ts">
import { MAX, NIL, v1, v4, v6, v7 } from 'uuid';

const uuid1 = v1();
const uuid4 = v4();
const uuid6 = v6();
const uuid7 = v7();
</script>

<template>
    <div class="font-code flex flex-col">
        <div>{{ NIL }}</div>
        <div>{{ uuid1 }}</div>
        <div>{{ uuid4 }}</div>
        <div>{{ uuid6 }}</div>
        <div>{{ uuid7 }}</div>
        <div>{{ MAX }}</div>
    </div>
</template>
