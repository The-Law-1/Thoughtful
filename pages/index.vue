<template>
    <div>
        <!-- flexgrid with all the tools -->
        <component v-if="currentToolIdx !== -1" :is="tools[currentToolIdx].component"
            :noResultsMessage="tools[currentToolIdx].noResultsPlaceholder"
            :placeholder="tools[currentToolIdx].placeholder"
            :onSearchFunction="tools[currentToolIdx].onSearch"
            :onSelectedFunction="tools[currentToolIdx].onSelected"
            :displayValFunction="tools[currentToolIdx].displayFunc">
        </component>
        <div class="flex justify-center">
            <!-- Tools grid -->
            <div class="w-[50%] flex justify-around pt-20" :class="currentToolIdx !== -1 ? '' : 'mt-[160px]'">
                <div
                    v-for="(tool, i) in tools"
                    :key="'tool-btn-' + i"
                    @click="toolSelected(i)"
                    class="rounded-lg w-32 h-16 flex align-center justify-center items-center bg-gray-200 hover:bg-gray-300 cursor-pointer">
                    {{ tool.label }}
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
    import { useNoteStore } from "@/stores/notes";
    import { useSearchStore } from "@/stores/search";
    import { LightningBoltIcon } from '@heroicons/vue/solid';
    import { resolveComponent, ref, markRaw } from "vue";

    const SearchBar = markRaw(resolveComponent('SearchBar') as any);

    // let noteStore = ref(useNoteStore() as any);
    let noteStore = useNoteStore() as any;
    let searchStore = useSearchStore() as any;

    let currentToolIdx = ref(-1 as number);
    let tools = ref([] as any[]);
    // TODO you might want to store this in the backend ?
    // ! we need a better way to store this, backend, frontend idk but this is really bad
    // TODO icons will have to be installed locally and store the path, can't be bothered to install a heroicons package
    // browse thoughts,
    tools.value.push({ hotkey: 'T', icon: "", label: "Thoughts", displayFunc: (thoughtObj: thought) => thoughtObj.content, onSearch: searchStore.fetchThought, onSelected: searchStore.thoughtSelected, noResultsPlaceholder: "Not found in thoughts, create: ", placeholder: "Search thoughts", enabled: false, component: SearchBar });
    // browse notes
    tools.value.push({ hotkey: 'N', icon: "", label: "Notes", displayFunc: (noteObj: note) => noteObj.name, onSearch: searchStore.fetchNote, onSelected: searchStore.noteSelected, noResultsPlaceholder: "Not found in notes, create: ", placeholder: "Search notes", enabled: false, component: SearchBar });


    // ! sort of stupid because ctrl+T & ctrl+N are existing shortcuts
    // ! we could use ctrl+K but that's all
    var handleHotkeys = (evt: any) => {
        // * you need to prevent default for the event to prevent the browser from doing its own thing
        console.log("Can handle hotkeys here. Ctrl key is: " + evt.ctrlKey);
    }
    window.addEventListener("keypress", handleHotkeys);

    var toolSelected = (idx: number) => {
        currentToolIdx.value = idx;
        // console.log("Current tool selected: ", tools.value[idx].label);
    }

</script>

<script lang="ts">
</script>