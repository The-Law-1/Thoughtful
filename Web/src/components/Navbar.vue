<template>
    <div class="flex">
        <Sidebar v-show="isSidebarOpen"/>
        <button
            class="focus:outline-none focus:shadow-outline"
            @click="toggleSidebar"
            >
            <div class="hover:bg-blue-200 hover:bg-opacity-30 rounded-sm">
                <MenuIcon v-if="!isSidebarOpen" class="h-5 w-5" aria-hidden="true" />
                <ChevronDoubleLeftIcon ftIcon v-else class="h-5 w-5" aria-hidden="true" />
            </div>
        </button>
        <router-link to="/" class="hover:bg-blue-200 hover:bg-opacity-30 rounded-sm">
            <HomeIcon class="h-5 w-5" aria-hidden="true" />
        </router-link>
    </div>
</template>

<script setup lang="ts">
    import { MenuIcon, HomeIcon, ChevronDoubleLeftIcon } from '@heroicons/vue/solid';
    import { ref, watch } from 'vue';
    import { useNavbarStore } from '@/stores/navbar';
    import { useNoteStore } from "@/stores/notes";

    let noteStore = useNoteStore();
    await noteStore.fetchNotes();

    let navBarStore = useNavbarStore();

    let isSidebarOpen = ref(navBarStore.$state.sidebarOpen);
    watch(() => navBarStore.$state.sidebarOpen, (newValue:boolean) => {
        isSidebarOpen.value = newValue;
    });


    let toggleSidebar = ref(() => {
        isSidebarOpen.value = !isSidebarOpen.value;
        navBarStore.toggleSidebar();
    });
</script>