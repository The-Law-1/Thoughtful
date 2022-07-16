import { defineStore } from 'pinia';


export const useSearchStore = defineStore('search', {
    state: () => {
      return { 
      }
    },
    getters: {

    },
    actions: {
        async fetchSearchCommands() {
            // * Get the search commands from the server

            return [
                "notes",
                "thoughts"
            ];
        },
        async fetchNoteFilterResults(query:string) {
            // let placeHolders = await $fetch("https://jsonplaceholder.typicode.com/posts");
            let placeHolders = await $fetch("https://jsonplaceholder.typicode.com/users");
            let finalRes = [];

            finalRes = (placeHolders as any[]).map((placeHolder:any) => placeHolder.company.name);
            return finalRes;
        },
        async fetchThoughtFilterResults(searchTerm:string, note:string = "") {
            let placeHolders = await $fetch("https://jsonplaceholder.typicode.com/users");
            let finalRes = [];

            finalRes = (placeHolders as any[]).map((placeHolder:any) => placeHolder.company.name);
            return finalRes;
        },
      
    },
  })