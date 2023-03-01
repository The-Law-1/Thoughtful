import NewThoughtModal from '@/components/NewThoughtModal.vue';
import { note } from '@/types/note';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from './auth';
import BackendPaths from './backendPaths';


export const useSearchStore = defineStore('search', () => {
    const authStore = useAuthStore();
    const router = useRouter();

    async function filterNotes(filter:string): Promise<note[]> {
        let filteredResults = await BackendPaths.Notes.GetNotesByTitle(authStore.jwtToken, filter);

        return filteredResults;
    }

    // async function filterThoughts(query:string): Promise<thought[]> {

    // }

    async function noteSelected(noteObj:(note|string)) : Promise<note|void> {

        if (typeof noteObj === "string") {
            console.log("Calling the backend to create note: ", noteObj);

            let createdNote = await BackendPaths.Notes.CreateNote(authStore.jwtToken, { title: noteObj, thoughts: [], id: "" } as note);

            console.log("Created note: ", createdNote);

            return createdNote;
        } else {
            console.log("Selected note: ");
            console.log(noteObj);
            // console.log("Navigating to note: ", noteObj.title);
            // router.push({ path: "/note", query: { noteName:(newValue as string) } });
        }
    }

    async function thoughtSelected(thoughtObj:any, router: any = null) {

        if (typeof thoughtObj === "string") {
            // TODO in this case we want to ask the user what note he would like to add the thought to, so open a modal with another search bar, this time with different functions
            // TODO return the name of your modal, i.e. "NewThoughtModal" which will take care of the rest, just pass it the current query (thought)
            return NewThoughtModal;
        } else {
            console.log("Navigating to note containing thought: ", thoughtObj.content);
            // router.push({ path: "/note", query: { noteName:(newValue as string) } });
        }
        return null;
    }

    return {
        filterNotes,
        // fetchThought,
        noteSelected,
        thoughtSelected
    }
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}