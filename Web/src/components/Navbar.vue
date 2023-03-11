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

        <router-link v-if="loggedIn" to="/tools" class="hover:bg-blue-200 hover:bg-opacity-30 rounded-sm">
            <CloudIcon class="h-5 w-5" aria-hidden="true" />
        </router-link>

        <button
            class="focus:outline-none focus:shadow-outline"
            v-if="loggedIn && noteId.length > 0"
            @click="() => noteStore.exportNote(noteId)"
            >
            <div class="hover:bg-blue-200 hover:bg-opacity-30 rounded-sm" >
                <ArrowDownTrayIcon class="h-5 w-5" aria-hidden="true" />
            </div>
        </button>
    </div>
</template>

<script setup lang="ts">
    import { ChevronDoubleLeftIcon, Bars3Icon, HomeIcon, CloudIcon, ArrowDownTrayIcon } from "@heroicons/vue/24/solid";
    import Sidebar from "@/components/Sidebar.vue";
    import { ref, watch, onMounted } from 'vue';
    import { useNavbarStore } from '@/stores/navbar';
    import { useNoteStore } from "@/stores/notes";
    import { useAuthStore } from "@/stores/auth";
    import { useRoute } from "vue-router";

    let noteStore = useNoteStore();
    let authStore = useAuthStore();
    let loggedIn = ref(false);
    let route = useRoute();

    let noteId = ref("");

    onMounted(async () => {
        // await noteStore.fetchNotes();

        loggedIn.value = await authStore.verifyLoggedIn();
    });

    // on route change
    watch(() => route.path, async (newValue:string) => {
        // startswith /note
        if (newValue.startsWith("/note")) {
            console.log("Route changed to note: ", route.params.noteId)
            noteId.value = route.params.noteId as string;
        } else {
            console.log("Route changed to note: ", route.path)
            noteId.value = "";
        }
    });

    let navBarStore = useNavbarStore();

    let isSidebarOpen = ref(navBarStore.$state.sidebarOpen);
    watch(() => navBarStore.$state.sidebarOpen, (newValue:boolean) => {
        isSidebarOpen.value = newValue;
    });

    watch(() => authStore.jwtToken, async (newValue:string) => {
        loggedIn.value = await authStore.verifyLoggedIn();
    });


    let toggleSidebar = ref(() => {
        isSidebarOpen.value = !isSidebarOpen.value;
        navBarStore.toggleSidebar();
    });
</script>