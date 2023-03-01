<template>
    <main>
        <Combobox v-model="selectedOption" nullable>
            <span>
                <MagnifyingGlassIcon class="absolute mt-3 w-12 h-12"></MagnifyingGlassIcon>
            </span>
            <ComboboxInput
                autocomplete="off"
                class="focus:outline-none transition ease-in-out duration-300 text-black focus:border-b-gunmetal bg-transparent border-b-2 border-b-gray-200  pl-12 w-full h-20 text-4xl rounded-lg"
                :placeholder="placeholder"
                :displayValue="(res:any) => displayValues(res)"
                @change="query = $event.target.value" />
            <ComboboxOptions
                v-if="!buffering"
                class="bg-white w-full max-h-[50vh] rounded-lg mt-1 text-left overflow-y-hidden">

                <ComboboxOption v-slot="{ selected, active }" v-if="queryVal" :value="queryVal">
                    <SearchBarItem :active="active" :selected="selected" :displayVal="'Press enter to create ' + query" :deletable="false"></SearchBarItem> 
                </ComboboxOption>

                <ComboboxOption
                    v-for="(searchResult, i) in filteredResults"
                    as="template"
                    v-slot="{ selected, active }"
                    :key="'search-result-' + i"
                    :value="searchResult"
                >
                    <SearchBarItem
                        @deleted-item="() => deleteItem(searchResult)"
                        :active="active" :selected="selected" :displayVal="displayValues(searchResult)" :deletable="true">

                    </SearchBarItem>
                </ComboboxOption>
            </ComboboxOptions>
        </Combobox>

        <div v-show="buffering">
            <ArrowPathIcon class="animate-spin h-5 w-5"></ArrowPathIcon>
        </div>
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
    import { MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/vue/24/solid";
    import SearchBarItem from "@/components/SearchBarItem.vue";

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

    let deleteItem = ref((item: any) => {
        console.log(item);
        // this is probably only db items but just to be safe
        if (item._id) {
            alert("Trying to delete item " + item._id);
        } else {
            alert("Invalid delete");
        }
    })

    var currentSearchTimeout = null as any;
    let buffering = ref(false);

    watch(query, (newVal, oldVal) => {
        if (newVal.length > 0) {
            if (currentSearchTimeout !== null) {
                clearTimeout(currentSearchTimeout);
            }

            buffering.value = true;
            currentSearchTimeout = setTimeout(async () => {
                filteredResults.value = await props.searchFunction(newVal);
                buffering.value = false;

                currentSearchTimeout = null;
            }, 400);
        }
    });

    // * selected something new
    watch(selectedOption, async (newValue:any) => {
        console.log("Selected a new option: " + newValue);

        if (newValue === null || newValue.length === 0)
            return;

        emit("onSelected", newValue);
    });

</script>