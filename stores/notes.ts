import { defineStore } from 'pinia';

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
    addNote(title:string = "") {
        this.$state.list.push({name: title, content: [], emoji: ""});
    },
    removeNote(noteName:string) {
        let noteIdx = this.$state.list.findIndex((note) => note.name === noteName);
        if (noteIdx > -1) {
            this.$state.list.splice(noteIdx, 1);
        }
    },

    addThought(noteName:string, thought:string) {
        let note = this.$state.list.find((note) => note.name === noteName);
        if (note) {
            note.content.push(thought);
        }
    },
    updateThought(noteName:string, thoughtIdx:number, thought:string) {
        let note = this.$state.list.find((note) => note.name === noteName);
        if (note) {
            console.log("Set thought to :", thought);

            note.content[thoughtIdx] = thought;
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
                this.$state.list.push({ name: placeHolder.company.name, content: [], emoji: "" });
            });
        }
    }
  },
})