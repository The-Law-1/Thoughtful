import { defineStore, acceptHMRUpdate } from 'pinia';


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
        async fetchThoughtInAllNotes(query:string) {
            return ["Gabriel", "Chris", "Lucy", "Charlie", "Toto"];
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

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}