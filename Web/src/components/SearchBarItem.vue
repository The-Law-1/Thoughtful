<template>

    <li
        class="flex justify-between items-center relative cursor-pointer select-none py-2 pl-10 pr-4"
        :class="{
        'bg-teal-600 text-white': active,
        'text-gray-900': !active,
        }"
        >
            {{ displayVal }}
        <span class="hover:text-red-800 text-red-400" v-if="deletable" @click="() => emitDelete()">
            <XMarkIcon class=" h-8 w-8"></XMarkIcon>
        </span>
        <!-- <span
            v-if="selected"
            class="absolute inset-y-0 left-0 flex items-center pl-3"
            :class="{ 'text-white': active, 'text-teal-600': !active }"
            >
            <CheckIcon class="h-5 w-5" aria-hidden="true" />
        </span> -->
    </li>


</template>

<script setup lang="ts">
    import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid';
    import { ref } from 'vue';

    // emits
    const emit = defineEmits<{
        (e: 'deletedItem'): void
    }>();

    let emitDelete = ref(() => {
        emit("deletedItem");
    });


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
        },
        deletable: {
            type: Boolean,
            default: true,
            required: true
        }
    }) 

</script>