<template>
    <div>
        <!-- flexgrid with all the tools -->
        <div class="flex justify-center">
            <!-- Tools grid -->
            <div class="w-[50%] pl-2 flex h-16 items-end" :class="currentToolIdx !== -1 ? '' : 'mt-[160px]'">
                <div
                    v-for="(tool, i) in tools"
                    :key="'tool-btn-' + i"
                    @click="toolSelected(i)"
                    :class="currentToolIdx === i ? 'bg-gray-400 h-10' : 'bg-gray-200 h-8'"
                    class="rounded-t-lg w-32 transition-all ease-in-out duration-150 hover:h-16 flex align-center justify-center items-center cursor-pointer">
                    {{ tool.label }}
                </div>
            </div>
        </div>
        <component v-if="currentToolIdx !== -1" :is="tools[currentToolIdx].component"></component>

    </div>

</template>

<script setup lang="ts">
    import NoteSearchBarVue from "@/components/NoteSearchBar.vue";
    import ThoughtSearchBarVue from "@/components/ThoughtSearchBar.vue";
    import { useNoteStore } from "@/stores/notes";
    import { useSearchStore } from "@/stores/search";
    import { LightningBoltIcon } from '@heroicons/vue/solid';
    import { resolveComponent, ref, markRaw, shallowRef } from "vue";

    const ThoughtSearchBar = shallowRef(ThoughtSearchBarVue);
    const NoteSearchBar = shallowRef(NoteSearchBarVue);
    
    // const ThoughtSearchBar = markRaw(resolveComponent('ThoughtSearchBar') as any);
    // const NoteSearchBar = markRaw(resolveComponent('NoteSearchBar') as any);

    // let noteStore = ref(useNoteStore() as any);
    let noteStore = useNoteStore() as any;
    let searchStore = useSearchStore() as any;

    let currentToolIdx = ref(0);
    let tools = ref([] as any[]);

    // TODO make a component for note search bar
    tools.value.push({ component: ThoughtSearchBar, label: "Thoughts" });
    tools.value.push({ component: NoteSearchBar, label: "Notes" });

    // ! sort of stupid because ctrl+T & ctrl+N are existing shortcuts
    // ! we could use ctrl+K but that's all
    // * in the future you can use /n or /t to switch tabs
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
