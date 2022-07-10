<template>
    <div v-show="isSidebarOpen" class="w-[20rem] float-left rounded-lg">
        <!-- <button
            class="float-right focus:outline-none focus:shadow-outline"
            @click="toggleSidebar">
            <ChevronDoubleLeftIcon class="h-5 w-5" aria-hidden="true" />
        </button> -->

        <div class="bg-slate-600 absolute w-[20rem] min-w-[20rem] flex flex-col max-h-[50vh] overflow-y-scroll">
            <NuxtLink
                v-for="note in sideBarItems"
                :to="{ path: '/note', query: { noteName: note } }"
                class="text-white my-1 hover:bg-slate-400 rounded-lg">
                > {{note}}
            </NuxtLink>
            
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useNavbarStore } from '@/stores/navbar';
import { useNoteStore } from '@/stores/notes';
import { MenuIcon, ChevronDoubleLeftIcon } from '@heroicons/vue/solid';

    let navBarStore = useNavbarStore();
    let noteStore = useNoteStore();

    let sideBarItems = computed(() => {
        return noteStore.getNoteNames;
    });
    
    let isSidebarOpen = ref(navBarStore.$state.sidebarOpen);

    watch(() => navBarStore.$state.sidebarOpen, (newValue:boolean) => {
        isSidebarOpen.value = newValue;
    });

    let toggleSidebar = ref(() => {
        isSidebarOpen.value = !isSidebarOpen.value;
        navBarStore.toggleSidebar();
    });

</script>