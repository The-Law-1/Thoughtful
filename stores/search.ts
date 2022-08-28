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
        async fetchThought(query:string) : Promise<thought[]> {
            // TODO call the backend to find a thought with the query
            return [ { id: "1", content: "test", noteParent: "note"} ];
        },
        async fetchNote(query:string) : Promise<note[]> {
            // TODO call the backend to find a note with the query

            return [ { id: "1", content: [], name: "note", emoji: ""} ];
        },
        async noteSelected(noteObj:note, router: any = null) {

            if (router) {
                console.log("Navigating to note: ", noteObj.name);
                // router.push({ path: "/note", query: { noteName:(newValue as string) } });
            } else {
                // TODO call the backend to create a new note
                console.log("Calling the backend to create note: ", noteObj.name);
            }
        },
        async thoughtSelected(thoughtObj:thought, router: any = null) {

            if (router) {
                console.log("Navigating to note containing thought: ", thoughtObj.content);
                // router.push({ path: "/note", query: { noteName:(newValue as string) } });
            } else {
                // TODO in this case we want to ask the user what note he would like to add the thought to, so open a modal with another search bar, this time with different functions
                // TODO call the backend to create a new thought
                console.log("Calling the backend to create thought: ", thoughtObj.content);
            }
        }
    },
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}