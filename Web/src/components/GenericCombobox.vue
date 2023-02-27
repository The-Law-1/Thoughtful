<template>

    <main>
        <Combobox v-model="selectedOption" nullable>
            <span>
                <SearchIcon class="absolute mt-5 w-12 h-12"></SearchIcon>
            </span>
            <ComboboxInput
                autocomplete="off"
                class=" pl-12 w-full h-20 text-4xl rounded-lg outline-none border-none"
                :placeholder="placeholder"
                :displayValue="(res:any) => displayValues(res)"
                @change="query = $event.target.value" />
            <ComboboxOptions
                class="bg-white w-full max-h-[50vh] rounded-lg mt-1 text-left overflow-y-hidden">

                <ComboboxOption class="bg-teal-600 text-white" v-if="queryVal && filteredResults.length === 0" :value="queryVal">
                    Press enter to create: "{{ query }}"
                </ComboboxOption>

                <ComboboxOption
                    v-for="(searchResult, i) in filteredResults"
                    as="template"
                    v-slot="{ selected, active }"
                    :key="'search-result-' + i"
                    :value="searchResult"
                >
                    <SearchBarItem :active="active" :selected="selected" :displayVal="displayValues(searchResult)">

                    </SearchBarItem>
                </ComboboxOption>
            </ComboboxOptions>
        </Combobox>

    </main>

</template>

<script lang="ts" setup>
    import { ref, computed, watch, shallowRef } from 'vue';
    import {
        Combobox,
        ComboboxInput,
        ComboboxButton,
        ComboboxOptions,
        ComboboxOption,
        TransitionRoot,
        } from '@headlessui/vue'
    import { SearchIcon, CheckIcon, SelectorIcon, XIcon } from '@heroicons/vue/solid';

    var props = defineProps({
        searchFunction: {
            type: Function,
            default: null,
            required: true
        },
        displayValues: {
            type: Function,
            default: null,
            required: true
        },
        placeholder: {
            type: String,
            default: "Search",
            required: false
        }
    });

    // emits
    const emit = defineEmits<{
        (e: 'onSelected', query: string): void
    }>();

    let query = ref('');
    let filteredResults = ref([] as any[]);

    let selectedOption = ref(null as any);

    const queryVal = computed(() => {
        return query.value === '' ? null : query.value;
    });

    var currentSearchTimeout = null as any;

    watch(query, (newVal, oldVal) => {
        if (newVal.length > 0) {
            if (currentSearchTimeout !== null) {
                clearTimeout(currentSearchTimeout);
            }

            currentSearchTimeout = setTimeout(async () => {
                filteredResults.value = await props.searchFunction(newVal);

                currentSearchTimeout = null;
            }, 400);
        }
    });

    // * selected something new
    watch(selectedOption, async (newValue:any) => {
        if (newValue === null || newValue.length === 0)
            return;

        emit("onSelected", newValue);
    });

</script>