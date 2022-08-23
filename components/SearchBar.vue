<template>
    <div class="pt-20 w-full flex justify-around" :class="navBarStore.sidebarOpen ? 'pl-[20rem]' : 'pl-0'">
        <div class="w-[50%] h-20 rounded-lg">
            <div class="bg-white rounded-lg">
                <Combobox v-model="selectedOption" nullable>
                    <span>
                        <SearchIcon class="absolute mt-5 w-12 h-12"></SearchIcon>
                    </span>
                    <ComboboxInput
                        class=" pl-12 w-full h-20 text-4xl rounded-lg outline-none border-none"
                        :placeholder="placeholder"
                        :displayValue="(res:any) => displayValues(res)"
                        @change="query = $event.target.value" />
                    <ComboboxOptions
                        class="bg-white w-full max-h-[50vh] rounded-lg mt-1 text-left overflow-y-hidden">

                        <ComboboxOption class="bg-teal-600 text-white" v-if="queryVal && filteredResults.length === 0" :value="queryVal">
                            {{ noResultsMessage }} "{{ query }}"
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

    const props = defineProps({
        noResultsMessage: {
            type: String,
            default: 'No results found for: ',
        },
        placeholder: {
            type: String,
            default: 'Search',
        },
    });

    const emit = defineEmits<{
        (e: 'onSearch', query: string): void
        (e: 'onSelected', query: string): void
    }>()

    let navBarStore = ref(useNavbarStore());
    let searchStore = useSearchStore();
    let noteStore = useNoteStore();

    var filteredResults = ref([] as any[]);

    const queryVal = computed(() => {
        return query.value === '' ? null : query.value;
    })

    let selectedOption = ref("");
    let query = ref('');

    var currentSearchTimeout = null as any;

    const router = useRouter();

    // var navigateToSelected = ref(() => {
    //     router.push({ path: "/note", query: { noteName:(selectedResult.value as string) } });
    // });

    let displayValues = (val:any) => {
        return val;
    }

    var filterResults = async (searchQuery:string) => {
        console.log("Searching: ", searchQuery);

        filteredResults.value = await searchStore.fetchThoughtInAllNotes(searchQuery);

        // TODO emit event "onSearch"
        emit('onSearch', searchQuery);

        // if (selectedResult.value.length > 0) {
        //     filteredResults.value = await searchStore.fetchThoughtFilterResults(searchQuery, selectedResult.value);
        // } else {
        //     filteredResults.value = await searchStore.fetchNoteFilterResults(searchQuery);
        // }
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

    // * selected something new
    watch(selectedOption, async (newValue:any) => {
        if (newValue === null || newValue.length === 0)
            return;

        console.log("Selected new option: ", newValue);

        // TODO emit event "onSelected"
        emit('onSelected', newValue);
        
        // if (filteredResults.value.includes(newValue)) {
        //     console.log("create", newValue);
        //     noteStore.addNote(newValue);
        //     router.push({ path: "/note", query: { noteName:(newValue as string) } });
        // }

        // * select the note for filtering
        // selectedResult.value = newValue;
    });
</script>
