<template>
    <article :class="navBarStore.sidebarOpen ? 'pl-[20rem]' : 'pl-0'"
        class="flex justify-center flex-shrink-0 h-[90vh]">
        <div
            v-if="note"
            style="min-width: calc(200px + 20rem)"
            class="bg-paper text-black rounded-lg text-left w-[900px] cursor-text overflow-y-auto"
            @click="(evt) => addThoughtElement(evt)">
            <!-- NOTE NAME -->
            <input contenteditable="true" placeholder="You have to enter a name friend"
                class="placeholder:text-slate-400 w-full bg-transparent h-20 text-black p-1 text-7xl outline-none shadow-none font-bold mb-4"
                v-model="note.title">
            <div
                class="m-2"
                @mouseenter="() => mouseOverThoughts = true"
                @mouseleave="() => mouseOverThoughts = false">
                <Thought
                    v-for="(thought, i) in note.thoughts"
                    @click="() => clickThought(i)"
                    @focusThought="(idx) => focusThought(idx)"
                    :ref="'thought-' + i"
                    :key="`thoughtkey-${thought._id}-${i}`"
                    :focus-trigger="i === currentThoughtIndex ? 1 + focusTrigger : 0"
                    :note-name="note.title"
                    :thought-id="thought._id"
                    :thought-index="i"
                    v-model="thought.content"/>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
    import { useNavbarStore } from "@/stores/navbar";
    import { useNoteStore } from "@/stores/notes";
    import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
    import { useRoute } from "vue-router";
    import Thought from "@/components/Thought.vue";
    import { mapActions } from "pinia";
    import { note } from "@/types/note";

    let navBarStore = ref(useNavbarStore());

    let noteStore = useNoteStore();
    let route = useRoute();
    let note = ref({} as note);
    let currentThoughtIndex = ref(0);
    let focusTrigger = ref(0);
    let mouseOverThoughts = ref(false);

    let focusThought = (idx:number) => {
        if (idx >= 0 && idx < note.value.thoughts.length) {

            // next tick cause we wait for the element to be rendered
            nextTick(() => {
                console.log("focus: Focusing thought at index: ", idx);
                currentThoughtIndex.value = idx;
                focusTrigger.value++;
            })
        }
    }

    let clickThought = (i:number) => {
        if (currentThoughtIndex.value !== i) {
            console.log("click: Focusing thought at index: ", i);
            currentThoughtIndex.value = i;
            focusTrigger.value++;
        }
    }

    let addThoughtElement = (evt:any) => {
        // if our mouse is below the current thoughts div, add a new thought
        if (!mouseOverThoughts.value) {
            console.log("Adding new thought");
            note.value.thoughts.push({
                _id: "",
                content: "",
                noteId: note.value._id
            });
            focusThought(note.value.thoughts.length - 1);
        }
    }

    watch(() => route.params.noteId, (noteId) => {
        // note.value = noteStore.getNoteById(noteId);
    });

    onMounted(async () => {
        let noteId = route.params.noteId as string;
        console.log("noteId: ", noteId);
        note.value = await noteStore.getNoteById(noteId);

        console.log(note.value.thoughts);

        // listen for keys
        document.addEventListener('keydown', (e) => {
            if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault(); // present "Save Page" from getting triggered.

                // this.saveNote();

                // call notestore and update note
                console.log("Trying to save note: ", note.value);
                noteStore.updateNote(note.value);
            }
        });
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', (evt) => {

        });
    });




</script>