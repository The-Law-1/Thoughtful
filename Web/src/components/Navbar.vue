<template>
    <div class="flex">
        <!-- * I don't love the sidebar -->
        <Sidebar v-show="isSidebarOpen"/>
        <!-- <button
            class="focus:outline-none focus:shadow-outline"
            @click="toggleSidebar"
            >
            <div class="hover:bg-blue-200 hover:bg-opacity-30 rounded-sm">
                <Bars3Icon v-if="!isSidebarOpen" class="h-5 w-5" aria-hidden="true" />
                <ChevronDoubleLeftIcon ftIcon v-else class="h-5 w-5" aria-hidden="true" />
            </div>
        </button> -->
        <router-link to="/" class="hover:bg-blue-200 hover:bg-opacity-30 rounded-sm">
            <HomeIcon class="h-5 w-5" aria-hidden="true" />
        </router-link>
    </div>
</template>

<script setup lang="ts">
    import { ChevronDoubleLeftIcon, Bars3Icon, HomeIcon } from "@heroicons/vue/24/solid";
    import Sidebar from "@/components/Sidebar.vue";
    import { ref, watch, onMounted } from 'vue';
    import { useNavbarStore } from '@/stores/navbar';
    import { useNoteStore } from "@/stores/notes";

    let noteStore = useNoteStore();

    onMounted(async () => {
        await noteStore.fetchNotes();
    });

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