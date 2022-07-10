<template>
    <div class="pt-20 w-full flex justify-around" :class="navBarStore.sidebarOpen ? 'pl-[20rem]' : 'pl-0'">
        <div class="w-[50%] h-20 bg-white rounded-lg">
            <!-- ! don't use this anymore, it has awful performance -->
            <Combobox v-model="selected" nullable>
                <span>
                    <SearchIcon class="absolute mt-5 w-12 h-12"></SearchIcon>
                </span>
                <ComboboxInput
                    class=" pl-12 w-full h-20 text-4xl rounded-lg outline-none border-none"
                    :displayValue="(note:any) => note"
                    @change="query = $event.target.value" />
                <ComboboxOptions
                    class="bg-white w-full max-h-[50vh] rounded-lg mt-1 text-left overflow-y-hidden">
                    <ComboboxOption class="bg-teal-600 text-white" v-if="queryNote && filteredNotes.length === 0" :value="queryNote">
                        Press enter to create "{{ query }}"
                    </ComboboxOption>

                    <ComboboxOption
                        v-for="note in filteredNotes"
                        as="template"
                        v-slot="{ selected, active }"
                        :key="note"
                        :value="note"
                    >
                        <li
                            class="relative cursor-default select-none py-2 pl-10 pr-4"
                            :class="{
                            'bg-teal-600 text-white': active,
                            'text-gray-900': !active,
                            }"
                            >
                            <span
                                class="block truncate"
                                :class="{ 'font-medium': selected, 'font-normal': !selected }"
                                >
                                {{ note }}
                            </span>
                            <span
                                v-if="selected"
                                class="absolute inset-y-0 left-0 flex items-center pl-3"
                                :class="{ 'text-white': active, 'text-teal-600': !active }"
                                >
                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                        </li>
                    </ComboboxOption>
                </ComboboxOptions>
            </Combobox>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useNoteStore } from "@/stores/notes";
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
    import { SearchIcon, CheckIcon, SelectorIcon } from '@heroicons/vue/solid';
    import { useRouter } from "vue-router";

    // const notes = [
    //     { id: 1, name: 'Wade Cooper' },
    //     { id: 2, name: 'Arlene Mccoy' },
    //     { id: 3, name: 'Devon Webb' },
    //     { id: 4, name: 'Tom Cook' },
    //     { id: 5, name: 'Tanya Fox' },
    //     { id: 6, name: 'Hellen Schmidt' },
    // ]

    let navBarStore = ref(useNavbarStore());

    let noteStore = useNoteStore();
    var notes = noteStore.getNoteNames;

    const queryNote = computed(() => {
        return query.value === '' ? null : query.value;
    })

    let selected = ref(notes[0])
    let query = ref('')

    let filteredNotes = computed(() =>
    query.value === ''
        ? notes
        : notes.filter((note) =>
            note
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.value.toLowerCase().replace(/\s+/g, ''))
        )
    );

    const router = useRouter();

    watch(noteStore.list, () => {
        notes = noteStore.getNoteNames
    });

    watch(selected, async (newValue:string) => {
        if (newValue === null)
            return;

        if (!notes.includes(newValue)) {
            console.log("create", newValue);
            noteStore.addNote(newValue);
        }
        // route object with query parameters
        router.push({ path: "/note", query: { noteName: newValue } });
    })
</script>
