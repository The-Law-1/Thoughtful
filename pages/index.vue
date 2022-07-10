<template>

    <div>
        <SearchBar></SearchBar>
    </div>

</template>

<script setup lang="ts">
    import { useNoteStore } from "@/stores/notes";

    // return noteStore;
</script>

<script lang="ts">
    // const { $store } = useNuxtApp();
    import { mapActions } from 'pinia';

    export default {
        data() {
            return {
                noteStore: null as any,
            }
        },
        methods: {
            ...mapActions(useNoteStore, ['addNote']),
        },
        mounted () {
            console.log('Index mounted');

            // this.fetchNotes();

            // can't access noteStore, does mounted run before setup ?
            this.noteStore = useNoteStore();
            // console.log(this.noteStore.list);
        }
    }
</script>