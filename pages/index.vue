<template>
    <div>
        <!-- flexgrid with all the tools -->
        <component v-if="currentToolIdx !== -1" :is="tools[currentToolIdx].component">
        </component>
        <div class="flex">
            <div
                v-for="(tool, i) in tools"
                :key="'tool-btn-' + i"
                @click="toolSelected(i)"
                class="w-20 bg-gray-200 hover:bg-gray-300 cursor-pointer">
                >
                {{ tool.label }}
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
    import { useNoteStore } from "@/stores/notes";
    import { LightningBoltIcon } from '@heroicons/vue/solid';

    const SearchBar = resolveComponent('SearchBar');

    // TODO bring everything into setup because I can't access SearchBar!

    // return noteStore;
</script>

<script lang="ts">
    // const { $store } = useNuxtApp();
    import { mapActions } from 'pinia';
    import { resolveComponent } from "vue";

    export default {
        data() {
            return {
                noteStore: null as any,
                currentToolIdx: 0,
                tools: [
                    // TODO you might want to store this in the backend ?
                    // TODO icons will have to be installed locally and store the path, can't be bothered to install a heroicons package
                    // browse thoughts,
                    { icon: "", label: "Thoughts", onSearch: null, onSelected: null, noResultsPlaceholder: "Not found in thoughts, create: ", placeholder: "Search thoughts", enabled: false, component: SearchBar },
                    // browse notes
                    { icon: "", label: "Notes", onSearch: null, onSelected: null, noResultsPlaceholder: "Not found in notes, create: ", placeholder: "Search notes", enabled: false, component: SearchBar },

                ] as any[],
            }
        },
        methods: {
            ...mapActions(useNoteStore, ['addNote']),

            async toolSelected(i:number) {
                this.currentToolIdx = i;
            }
        },
        mounted () {
            console.log('Index mounted');

            // this.fetchNotes();

            // TODO set up onSearch and onSelected for each tool, (seems wrong but I dunno how to do it better. Also the functions are usually one liners calling the store) 

            // can't access noteStore, does mounted run before setup ?
            this.noteStore = useNoteStore();
            // console.log(this.noteStore.list);
        }
    }
</script>