<template>
    <main>
        <!-- not exactly required to use the generic component here but it's future-proof I suppose, in case you want to add something else
         -->
        <component v-if="submenuComponent !== null" @close="submenuComponent = null" :is="submenuComponent" :thought="selectedOption"></component>

        <div class="w-full flex justify-around" :class="navBarStore.sidebarOpen ? 'pl-[20rem]' : 'pl-0'">
            <div class="w-[50%] h-20 rounded-lg">
                <div class="bg-white rounded-lg">

                    <GenericCombobox
                        :placeholder="'Search thoughts'"
                        :searchFunction="filterResults"
                        @onSelected="onSelected"
                        @onDeleted="onDeleted"
                        :displayValues="(val:thought) => (val as thought) === null ? '' : val.content"
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
    import { useRouter } from "vue-router";
    import { thought } from "@/types/thought";
    import GenericCombobox from "@/components/GenericCombobox.vue";
    import { useThoughtStore } from "@/stores/thoughts";

    let navBarStore = ref(useNavbarStore());
    let searchStore = useSearchStore();
    let thoughtStore = useThoughtStore();

    let selectedOption = ref("");

    let submenuComponent = shallowRef(null as any);

    const router = useRouter();

    var filterResults = async (searchQuery:string) => {
        console.log("Searching: ", searchQuery);

        var newResults = await searchStore.filterThoughts(searchQuery);
        console.log("Got filteredResults: ", newResults);
        return newResults;
    }

    let onDeleted = async (deletedId: string) => {
        let result = await thoughtStore.deleteThought(deletedId);

        // I think if this fails we get an error anyway
        if (result) {
            console.log("Deleted thought: ", deletedId);
        }
    }

    var onSelected = async (newValue:any) => {
        console.log("Selected new option: ", newValue);

        // let modalSubmenu = await props.onSelectedFunction(newValue, router);
        let modalSubmenu = await searchStore.thoughtSelected(newValue, router);

        // if there's no modalSubmenu, we have been redirected, so just go
        if (!modalSubmenu)
            return;
        
        selectedOption.value = newValue;

        submenuComponent.value = modalSubmenu;
    }
</script>
