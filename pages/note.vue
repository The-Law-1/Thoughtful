<template>
    <article :class="navBarStore.sidebarOpen ? 'pl-[20rem]' : 'pl-0'"
        class="flex justify-center flex-shrink-0 h-[90vh]">
        <div
            v-if="note"
            style="min-width: calc(200px + 20rem)"
            class="bg-slate-600 text-white rounded-lg text-left w-[900px] cursor-text overflow-y-auto"
            @mousedown="(e:any) => e.preventDefault() /* prevent focus moving */" 
            @click="(evt) => addThoughtElement(evt)">
            <h1 class="m-1 text-5xl font-bold mb-4">{{note.name}}</h1>
            <div
                class="m-2"
                @mouseenter="() => mouseOverThoughts = true"
                @mouseleave="() => mouseOverThoughts = false">
                <Thought
                    v-for="(thought, i) in note.content"
                    @click="() => clickThought(i)"
                    :ref="'thought-'+ i"
                    :key="i"
                    :focus-trigger="i === currentThoughtIndex ? 1 + focusTrigger : 0"
                    :note-name="note.name"
                    :initial-val="thought"
                    :thought-index="i"/>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
    import { useNavbarStore } from "@/stores/navbar";
    import { useNoteStore } from "@/stores/notes";
    import { ref, computed, watch } from 'vue';
    import { useRoute } from "vue-router";
    import Thought from "@/components/Thought.vue";
    import { mapActions } from "pinia";

    // let noteStore = ref(useNoteStore());
    let navBarStore = ref(useNavbarStore());
    // get the note content from api
</script>

<script lang="ts">

    export default {
        name: "Note",

        data() {
            return {
                noteStore: useNoteStore(),
                note: {} as note,
                route: null as any,
                currentThoughtIndex: 0 as Number,
                focusTrigger: 0,
                mouseOverThoughts: false
            }
        },
        methods: {
            ...mapActions(useNoteStore, ["addThought"]),
            clickThought(i:Number) {
                this.currentThoughtIndex = i;
                this.focusTrigger++;
            },
            addThoughtElement(evt:any)
            {
                if (this.mouseOverThoughts) {
                    return;
                }

                // if the last thought is not empty:
                // add an empty thought
                console.log("this.note.content.length", this.note.content);
                console.log("Last content: ", this.note.content[this.note.content.length - 1]);

                if (this.note.content.length === 0) {
                    this.addThought(this.note.name, "");
                }
                if (this.note.content.length > 0 && this.note.content[this.note.content.length - 1].length > 0) {
                    this.addThought(this.note.name, "");
                }

                this.currentThoughtIndex = this.note.content.length - 1;
                this.focusTrigger++;
            },
        },
        mounted() {
            this.route = useRoute();

            let noteName = this.route.query.noteName as string;

            console.log("Got notename: ", noteName);

            this.note = this.noteStore.getNote(noteName) as note;
            if (this.note.content.length === 0)
                this.addThought(this.note.name, "");

            this.currentThoughtIndex = this.note.content.length - 1;
        },
        watch: {
            // * watch for thoughts (update/delete/create)
            noteStore: {
                handler(newVal) {
                    this.note = newVal.getNote(this.note.name) as note;
                    // console.log("Updated store: ", this.note);

                    // focus last thought
                    if (this.note && this.note.content.length > 0) {
                        this.currentThoughtIndex = this.note.content.length - 1;
                        this.focusTrigger++;
                    }
                },
                deep: true,
            },
            $route: function(newRouteVal: any) {
                // if we are on page note:
                if (newRouteVal.path === "/note") {
                    console.log("New note name: ", newRouteVal.query.noteName);
                    this.route = newRouteVal;
                    let newNoteName = newRouteVal.query.noteName as string;
                    this.note = this.noteStore.getNote(newNoteName) as note;
                }
            }
        },

    };

</script>