<template>
    <div class="pt-20 w-full flex justify-around" :class="navBarStore.sidebarOpen ? 'pl-[20rem]' : 'pl-0'">
        <div class="w-[50%] h-20 rounded-lg">
            <div v-if="selectedNote.length > 0" class="flex bg-slate-400 justify-between rounded-lg">
                <div
                    class="text-3xl opacity-50 cursor-pointer hover:underline"
                    @click="() => navigateToSelected()">
                    In {{ selectedNote }}:
                </div>
                <span class="cursor-pointer" @click="() => selectedNote = ''" >
                    <XIcon class="w-6 h-6"></XIcon>
                </span>
            </div>
            <div class="bg-white rounded-lg">
                <Combobox v-model="selected" nullable>
                    <span>
                        <SearchIcon class="absolute mt-5 w-12 h-12"></SearchIcon>
                    </span>
                    <ComboboxInput
                        class=" pl-12 w-full h-20 text-4xl rounded-lg outline-none border-none"
                        :displayValue="(res:any) => displayValues(res)"
                        @change="query = $event.target.value" />
                    <ComboboxOptions
                        class="bg-white w-full max-h-[50vh] rounded-lg mt-1 text-left overflow-y-hidden">

                        <ComboboxOption class="bg-teal-600 text-white" v-if="queryNote && filteredResults.length === 0" :value="queryNote">
                            Press enter to create "{{ query }}"
                        </ComboboxOption>

                        <ComboboxOption
                            v-for="(searchResult, i) in filteredResults"
                            as="template"
                            v-slot="{ selected, active }"
                            :key="'thought-' + i"
                            :value="searchResult"
                        >
                            <SearchBarItem :active="active" :selected="selected" :displayVal="`${searchResult}`">

                            </SearchBarItem>
                        </ComboboxOption>
                    </ComboboxOptions>
                </Combobox>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useNoteStore } from "@/stores/notes";
    import { useSearchStore } from "@/stores/search";
    import { useNavbarStore } from "@/stores/navbar";
    import { ref, computed, watch } from 'vue'
    import {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
    TransitionRoot,
    } from '@headlessui/vue'
    import { SearchIcon, CheckIcon, SelectorIcon, XIcon } from '@heroicons/vue/solid';
    import { useRouter } from "vue-router";

    let navBarStore = ref(useNavbarStore());
    let searchStore = useSearchStore();
    let noteStore = useNoteStore();

    var filteredResults = ref([] as any[]);

    const queryNote = computed(() => {
        return query.value === '' ? null : query.value;
    })

    let selected = ref("");
    let selectedNote = ref("");
    let query = ref('');

    var currentSearchTimeout = null as any;

    const router = useRouter();

    var navigateToSelected = ref(() => {
        router.push({ path: "/note", query: { noteName:(selectedNote.value as string) } });
    });

    let displayValues = (val:any) => {
        return val;
    }

    var filterResults = async (searchQuery:string) => {
        console.log("Searching: ", searchQuery);

        if (selectedNote.value.length > 0) {
            filteredResults.value = await searchStore.fetchThoughtFilterResults(searchQuery, selectedNote.value);
        } else {
            filteredResults.value = await searchStore.fetchNoteFilterResults(searchQuery);
        }
    }

    watch(query, (newVal, oldVal) => {
        if (newVal.length > 0) {
            if (currentSearchTimeout !== null) {
                clearTimeout(currentSearchTimeout);
            }

            currentSearchTimeout = setTimeout(async () => {
                filterResults(newVal);

                currentSearchTimeout = null;
            }, 400);
        }
    });

    watch(selected, async (newValue:any) => {
        if (newValue === null || newValue.length === 0)
            return;

        if (filteredResults.value.includes(newValue)) {
            console.log("create", newValue);
            noteStore.addNote(newValue);
            router.push({ path: "/note", query: { noteName:(newValue as string) } });
        }

        // * select the note for filtering
        selectedNote.value = newValue;

    });
</script>
