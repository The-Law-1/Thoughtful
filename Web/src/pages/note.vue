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
                    v-for="(thought, i) in noteThoughts"
                    @click="() => clickThought(i)"
                    @focusThought="(idx) => focusThought(idx)"
                    @thoughtUpdated="(val) => handleThoughtUpdated(thought._id, val)"
                    @thoughtDeleted="(id) => deleteThought(thought._id)"
                    @thoughtInserted="(idx) => insertThought(idx)"
                    :ref="'thought-' + i"
                    :key="`thoughtkey-${thought._id}-${i}`"
                    :focus-trigger="i === currentThoughtIndex ? focusTrigger : 0"
                    :note-name="note.title"
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
    import { useThoughtStore } from "@/stores/thoughts";

    let navBarStore = ref(useNavbarStore());

    let noteStore = useNoteStore();
    let thoughtStore = useThoughtStore();
    let route = useRoute();
    let note = ref({} as note);

    let noteThoughts = ref([] as any[]);

    let thoughtsToUpdate = ref([] as any[]);

    // helps for inserting thoughts
    let currentThoughtIndex = ref(0);

    // positive value -> focus and place caret randomly
    // negative value -> focus and place caret at the end
    let focusTrigger = ref(0);
    let mouseOverThoughts = ref(false);

    let handleThoughtUpdated = (id:string, val:string) => {
        console.log("Thought updated: ", val);

        let idx = thoughtsToUpdate.value.findIndex(t => t._id === id);
        if (idx >= 0) {
            thoughtsToUpdate.value[idx].content = val;
        } else {
            thoughtsToUpdate.value.push({
                _id: id,
                content: val,
                noteId: note.value._id
            });
        }
    }

    let focusThought = (idx:number) => {
        if (idx >= 0 && idx < note.value.thoughts.length) {

            // next tick cause we wait for the element to be rendered
            nextTick(() => {
                // console.log("focus: Focusing thought at index: ", idx, focusTrigger.value);
                currentThoughtIndex.value = idx;

                // give focustrigger a new negative value
                focusTrigger.value = -Math.abs(focusTrigger.value) - 1;
                // console.log("New focustrigger: ", idx, focusTrigger.value);

            });
        }
    }

    let clickThought = (i:number) => {
        if (currentThoughtIndex.value !== i) {
            console.log("click: Focusing thought at index: ", i);
            currentThoughtIndex.value = i;

            focusTrigger.value = Math.abs(focusTrigger.value) + 1;
        }
    }

    let deleteThought = async (id:string) => {
        thoughtStore.deleteThought(id)
            .then(res => {
                console.log("Thought deleted: ", res);
            });

        let idx = noteThoughts.value.findIndex(t => t._id === id);

        if (idx >= 0) {
            noteThoughts.value.splice(idx, 1);
            note.value.thoughts = noteThoughts.value;

            focusThought(currentThoughtIndex.value - 1);
        }
    }

    let insertThought = async (idx:number) => {

        // this is making our note adding slow as hell, do it asynchronously
        thoughtStore.createThought({
            _id: "",
            content: "",
            noteId: note.value._id
        }).then(res => {
            noteThoughts.value[idx]._id = res._id;
            note.value.thoughts = noteThoughts.value;
            focusThought(idx);
        })
        .catch(err => {
            alert("Failed to create thought");
            console.error(err);
        });
        // let newThought = {
        //     _id: "",
        //     content: "",
        //     noteId: note.value._id
        // }

        // make sure this went through
        noteThoughts.value.splice(idx, 0, {
            _id: "",
            content: "",
            noteId: note.value._id
        });
        note.value.thoughts = noteThoughts.value;

        focusThought(idx);
    }

    let addThoughtElement = async (evt:any) => {
        // if our mouse is below the current thoughts div, add a new thought, and our last thought isn't empty
        if (!mouseOverThoughts.value && noteThoughts.value[noteThoughts.value.length - 1].content.length !== 0) {
            console.log("Adding new thought");

            let newThought = await thoughtStore.createThought({
                _id: "",
                content: "",
                noteId: note.value._id
            });

            // make sure this went through
            if (newThought !== null) {
                noteThoughts.value.push(newThought);

                note.value.thoughts.push(newThought);
                
                focusThought(note.value.thoughts.length - 1);
            } else {
                console.error("Failed to create thought");
            }
        }
        if (!mouseOverThoughts.value && noteThoughts.value[noteThoughts.value.length - 1].content.length === 0) {
            console.log("Thought is empty, not adding new thought");
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

        noteThoughts.value = await thoughtStore.getThoughtsForNote(noteId);

        // listen for keys
        document.addEventListener('keydown', async (e) => {
            if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault(); // present "Save Page" from getting triggered.

                if (note.value.title === "") {
                    alert("You have to enter a name for your note");
                    return;
                }
                // this.saveNote();

                // call notestore and update note
                console.log("Trying to save note: ", note.value);

                // await thoughtStore.updated(thoughtsToUpdate.value);
                note.value.thoughts = noteThoughts.value;

                await noteStore.updateNote(note.value, thoughtsToUpdate.value);
                thoughtsToUpdate.value = [];
            }
        });
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', (evt) => {

        });
    });




</script>