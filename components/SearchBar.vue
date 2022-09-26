<template>
    <main>
        <component v-if="submenuComponent !== null" :is="submenuComponent" :currentOption="selectedOption"></component>

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
                            <!-- TODO on selected doesn't fire when you click manually -->
                                <SearchBarItem :active="active" :selected="selected" :displayVal="displayValues(searchResult)">

                                </SearchBarItem>
                            </ComboboxOption>
                        </ComboboxOptions>
                    </Combobox>
                </div>
            </div>
        </div>
    </main>
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
    import NewThoughtModal from "@/components/NewThoughtModal.vue";

    const props = defineProps({
        noResultsMessage: {
            type: String,
            default: 'No results found for: ',
        },
        placeholder: {
            type: String,
            default: 'Search',
        },
        onSearchFunction: {
            type: Function,
            default: () => [],
        },
        onSelectedFunction: {
            type: Function,
            default: () => [],
        },
        displayValFunction: {
            type: Function,
            default: () => "",
        }
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

    let submenuComponent = ref(null as any);

    var currentSearchTimeout = null as any;

    const router = useRouter();

    // ! tough on performance to have such a routine function be a prop, but let's trust vue to optimize it
    let displayValues = (val:any) => {
        if (val !== null) {
            // console.log("Calling display value for value: ", val);
            return props.displayValFunction(val);
        } else {
            return "";
        }
    }

    var filterResults = async (searchQuery:string) => {
        console.log("Searching: ", searchQuery);

        filteredResults.value = await props.onSearchFunction(searchQuery);
        console.log("Got filteredResults: ", filteredResults.value);
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

        let modalSubmenu = await props.onSelectedFunction(newValue, router);
        // TODO update a ref with this value
        submenuComponent.value = modalSubmenu;
    });
</script>
