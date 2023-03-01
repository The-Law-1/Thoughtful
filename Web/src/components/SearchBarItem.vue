<template>

    <li
        class="relative cursor-default select-none py-2 pl-10 pr-4"
        :class="{
        'bg-teal-600 text-white': active,
        'text-gray-900': !active,
        }"
        >
        <span
            class="block truncate"
            :class="{ 'font-medium': selected, 'font-normal': !selected }"
            >
            {{ displayVal }}
        </span>
        <span
            v-if="selected"
            class="absolute inset-y-0 left-0 flex items-center pl-3"
            :class="{ 'text-white': active, 'text-teal-600': !active }"
            >
            <CheckIcon class="h-5 w-5" aria-hidden="true" />
        </span>
    </li>


</template>

<script setup lang="ts">
    import { CheckIcon } from '@heroicons/vue/24/solid';


    const props = defineProps({
        selected: {
            type: Boolean,
            default: false,
            required: true
        },
        active: {
            type: Boolean,
            default: false,
            required: true
        },
        displayVal: {
            type: String,
            default: '',
            required: true
        }
    }) 

</script>