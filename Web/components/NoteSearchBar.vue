<template>
    <main>

        <div class="pt-20 w-full flex justify-around" :class="navBarStore.sidebarOpen ? 'pl-[20rem]' : 'pl-0'">
            <div class="w-[50%] h-20 rounded-lg">
                <div class="bg-white rounded-lg">

                    <GenericCombobox
                        :placeholder="'Search notes'"
                        :searchFunction="filterResults"
                        @optionSelected="onSelected"
                        :displayValues="(val:note) => (val as note) === null ? '' : val.name"
                        >
                    </GenericCombobox>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
    import { useNoteStore } from "@/stores/notes";
    import { useSearchStore } from "@/stores/search";
    import { useNavbarStore } from "@/stores/navbar";
    import { ref, computed, watch, shallowRef } from 'vue';

    let navBarStore = ref(useNavbarStore());
    let searchStore = useSearchStore();

    var filterResults = async (searchQuery:string) => {
        console.log("Searching: ", searchQuery);

        var newResults = await searchStore.fetchNote(searchQuery);
        console.log("Got filteredResults: ", newResults);
        return newResults;
    }

    var onSelected = async (newValue:any) => {
        console.log("Selected new option: ", newValue);

        await searchStore.noteSelected(newValue);
    }
</script>
