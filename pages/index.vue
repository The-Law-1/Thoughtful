<template>
    <div>
        <!-- flexgrid with all the tools -->
        <component v-if="currentToolIdx !== -1" :is="tools[currentToolIdx].component">
        </component>
        <div class="flex justify-center">
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
    import { LightningBoltIcon } from '@heroicons/vue/solid';
    import { resolveComponent, ref, markRaw } from "vue";

    const SearchBar = markRaw(resolveComponent('SearchBar') as any);

    // TODO bring everything into setup because I can't access SearchBar!
    let noteStore = ref(useNoteStore() as any);
    let currentToolIdx = ref(-1 as number);
    let tools = ref([] as any[]);
    // TODO you might want to store this in the backend ?
    // TODO icons will have to be installed locally and store the path, can't be bothered to install a heroicons package
    // browse thoughts,
    tools.value.push({ icon: "", label: "Thoughts", onSearch: null, onSelected: null, noResultsPlaceholder: "Not found in thoughts, create: ", placeholder: "Search thoughts", enabled: false, component: SearchBar });
    // browse notes
    tools.value.push({ icon: "", label: "Notes", onSearch: null, onSelected: null, noResultsPlaceholder: "Not found in notes, create: ", placeholder: "Search notes", enabled: false, component: SearchBar });

    // * can you access this in the html ? Or does it need to be ref() ?
    var toolSelected = (idx: number) => {
        currentToolIdx.value = idx;
        // console.log("Current tool selected: ", tools.value[idx].label);
    }

</script>

<script lang="ts">
</script>