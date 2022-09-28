import NewThoughtModal from '@/components/NewThoughtModal.vue';
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

            alert("Searching the backend for a thought by query: " + query);
            // return [ { id: "1", content: "test", noteParent: "note"} ];
            return [];
        },
        async fetchNote(query:string) : Promise<note[]> {
            // TODO call the backend to find a note with the query

            alert("Searching the backend for a note by query: " + query);
            // return [ { id: "1", content: [], name: "note", emoji: ""} ];
            return [];
        },
        // ! noteObj could be a string if we're creating a new one
        async noteSelected(noteObj:any, router: any = null) {

            if (typeof noteObj === "string") {
                // TODO call the backend to create a new note
                console.log("Calling the backend to create note: ", noteObj);
            } else {
                console.log("Navigating to note: ", noteObj.name);
                // router.push({ path: "/note", query: { noteName:(newValue as string) } });
            }
        },
        // ! thoughtObj could be a string if we're creating a new one
        async thoughtSelected(thoughtObj:any, router: any = null) {

            if (typeof thoughtObj === "string") {
                // TODO in this case we want to ask the user what note he would like to add the thought to, so open a modal with another search bar, this time with different functions
                // TODO return the name of your modal, i.e. "NewThoughtModal" which will take care of the rest, just pass it the current query (thought)
                return NewThoughtModal;
            } else {
                console.log("Navigating to note containing thought: ", thoughtObj.content);
                // router.push({ path: "/note", query: { noteName:(newValue as string) } });
            }
            return null;
        },
        async addThoughtToNote(thoughtContent: string, parentNote: string) {

            // TODO call the backend to add the thought to the note
            console.log("Calling the backend to add thought to note: ", thoughtContent, parentNote);
        }
    },
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}