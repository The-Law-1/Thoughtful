<template>
    <div>
        <!-- TODO make individual components which don't need this many props (thoughtsearchbar + notesearchbar)
            you can still use the <component is="..."> approach but they should be able to stand alone and not have an insane object to initialize them
            it'll also make the searchbar components more concise and this index page more readable -->
        <!-- <component v-if="currentToolIdx !== -1" :is="tools[currentToolIdx].component"
            :noResultsMessage="tools[currentToolIdx].noResultsPlaceholder"
            :placeholder="tools[currentToolIdx].placeholder"
            :onSearchFunction="tools[currentToolIdx].onSearch"
            :onSelectedFunction="tools[currentToolIdx].onSelected"
            :displayValFunction="tools[currentToolIdx].displayFunc">
        </component> -->

        <component v-if="currentToolIdx !== -1" :is="tools[currentToolIdx].component"></component>

        <!-- flexgrid with all the tools -->
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

    const ThoughtSearchBar = markRaw(resolveComponent('ThoughtSearchBar') as any);
    const NoteSearchBar = markRaw(resolveComponent('NoteSearchBar') as any);

    // let noteStore = ref(useNoteStore() as any);
    let noteStore = useNoteStore() as any;
    let searchStore = useSearchStore() as any;

    let currentToolIdx = ref(0);
    let tools = ref([] as any[]);

    // TODO make a component for note search bar
    tools.value.push({ component: ThoughtSearchBar, label: "Thoughts" });
    tools.value.push({ component: NoteSearchBar, label: "Notes" });

    // tools.value.push({ hotkey: 'T', icon: "", label: "Thoughts", displayFunc: (thoughtObj: thought) => thoughtObj.content, onSearch: searchStore.fetchThought, onSelected: searchStore.thoughtSelected, noResultsPlaceholder: "Press enter to create thought: ", placeholder: "Search thoughts", enabled: false, component: SearchBar });
    // browse notes
    // tools.value.push({ hotkey: 'N', icon: "", label: "Notes", displayFunc: (noteObj: note) => noteObj.name, onSearch: searchStore.fetchNote, onSelected: searchStore.noteSelected, noResultsPlaceholder: "Press enter to create note: ", placeholder: "Search notes", enabled: false, component: SearchBar });


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