import { defineStore } from 'pinia';

// ! this whole store could become obsolete, it's meant for local demo

export const useNoteStore = defineStore('notes', {
  state: () => {
    return { 
        list: [] as note []
    }
  },
  getters: {
    getNoteNames: (state) => state.list.map((note) => note.name),
    getNote: (state) => (name: string) => state.list.find((note) => note.name === name),
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    generateRandomID() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
    addNote(title:string = "") {
        this.$state.list.push({id: this.generateRandomID(), name: title, content: [], emoji: ""});
    },
    removeNote(noteName:string) {
        let noteIdx = this.$state.list.findIndex((note) => note.name === noteName);
        if (noteIdx > -1) {
            this.$state.list.splice(noteIdx, 1);
        }
    },
    insertThought(noteName:string, index:number, thought:string) {
        let note = this.$state.list.find((note) => note.name === noteName);
        if (note) {
            let newThought = {content: thought, id: this.generateRandomID(), noteParent: noteName};
            if (index === note.content.length) {
                note.content.push(newThought);
            } else {
                note.content.splice(index, 0, newThought);
            }
        }
    },
    addThought(noteName:string, thought:string) {
        let note = this.$state.list.find((note) => note.name === noteName);
        if (note) {
            let newThought = {content: thought, id: this.generateRandomID(), noteParent: noteName};

            note.content.push(newThought);
        }
    },
    updateThought(noteName:string, thoughtIdx:number, thought:string) {
        let note = this.$state.list.find((note) => note.name === noteName);
        if (note && note.content[thoughtIdx]) {
            note.content[thoughtIdx].content = thought;
        }
    },
    removeThought(noteName:string, thoughtIdx:number) {
        let note = this.$state.list.find((note) => note.name === noteName);
        if (note) {
            note.content.splice(thoughtIdx, 1);
        }
    },
    async fetchNotes() {
        // let placeHolders = await $fetch("https://jsonplaceholder.typicode.com/posts");
        let placeHolders = await $fetch("https://jsonplaceholder.typicode.com/users");

        if (placeHolders) {
            (placeHolders as any[]).forEach(placeHolder => {
                this.$state.list.push({ id: this.generateRandomID(), name: placeHolder.company.name, content: [], emoji: "" });
            });
        }
    }
  },
})