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
                    :displayValue="(res:any) => displayValues(res)"
                    @change="query = $event.target.value" />
                <ComboboxOptions
                    class="bg-white w-full max-h-[50vh] rounded-lg mt-1 text-left overflow-y-hidden">

                    <ComboboxOption class="bg-teal-600 text-white" v-if="searchMode === 'notes' && queryNote && filteredNotes.length === 0" :value="queryNote">
                        Press enter to create "{{ query }}"
                    </ComboboxOption>

                    <ComboboxOption
                        v-if="searchMode === 'thoughts'"
                        v-for="(thought, i) in filteredThoughts"
                        as="template"
                        v-slot="{ selected, active }"
                        :key="'thought-' + i"
                        :value="thought"
                    >
                        <SearchBarItem :active="active" :selected="selected" :displayVal="`${thought.text} - ${thought.note}`">

                        </SearchBarItem>
                    </ComboboxOption>

                    <ComboboxOption
                        v-if="searchMode === 'notes'"
                        v-for="note in filteredNotes"
                        as="template"
                        v-slot="{ selected, active }"
                        :key="note"
                        :value="note"
                    >
                        <SearchBarItem :active="active" :selected="selected" :displayVal="note">

                        </SearchBarItem>
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
    var fullNotes = noteStore.list;
    var notes = noteStore.getNoteNames;

    const queryNote = computed(() => {
        return query.value === '' ? null : query.value;
    })

    let selected = ref(notes[0])
    let query = ref('');

    let searchMode = ref('notes');

    let filteredThoughts = computed(() => {
        // also return the note name
        let result = [] as any[];

        let searchThreshold = 3;

        if (searchMode.value !== 'thoughts' || query.value === '' || query.value.length < searchThreshold) {
            return result;
        }

        fullNotes.forEach(note => {
            note.content.forEach((thought) => {
                if (thought.toLowerCase().includes(query.value.toLowerCase())) {
                    result.push({ note: note.name, text: thought });
                    return;
                }
                // return thought.includes(query.value);
            });
            if (result.length > 0) {
                return;
            }
        });

        return result;
    });

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

    let displayValues = (val:any) => {
        if (!val)
            return '';
        if (searchMode.value === 'notes') {
            return val;
        }
        return val.text;
    }

    const router = useRouter();

    watch(query, (newVal, oldVal) => {
        let changedMode = false;
        if (newVal === '/notes') {
            searchMode.value = 'notes';
            changedMode = true;
        } else if (newVal === '/thoughts') {
            searchMode.value = 'thoughts';
            changedMode = true;
        }

        if (changedMode) {
            selected.value = "";
            query.value = "";
        }
    });

    watch(noteStore.list, () => {
        notes = noteStore.getNoteNames
    });

    watch(selected, async (newValue:any) => {
        if (newValue === null || newValue.length === 0)
            return;

        if (searchMode.value === 'notes') {
            if (!notes.includes(newValue)) {
                console.log("create", newValue);
                noteStore.addNote(newValue);
            }
            // route object with query parameters
            router.push({ path: "/note", query: { noteName:(newValue as string) } });
        } else if (searchMode.value === 'thoughts') {
            router.push({ path: "/note", query: { noteName: (newValue.note as string) } });
        }
    })
</script>
