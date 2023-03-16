import NewThoughtModal from '@/components/NewThoughtModal.vue';
import { note } from '@/types/note';
import { thought } from '@/types/thought';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { DefineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './auth';
import BackendPaths from './backendPaths';
import { useNoteStore } from './notes';

export const useSearchStore = defineStore('search', () => {
    const authStore = useAuthStore();
    const noteStore = useNoteStore();
    const router = useRouter();

    var statusMessage = ref("");

    async function filterNotes(filter:string): Promise<note[]> {
        let filteredResults = await BackendPaths.Notes.GetNotesByTitle(authStore.jwtToken, filter);

        return filteredResults;
    }

    
    async function noteSelected(noteObj:(note|string)) : Promise<note|void> {
        
        if (typeof noteObj === "string") {
            console.log("Calling the backend to create note: ", noteObj);
            
            let res = await noteStore.createNote({ title: noteObj, thoughts: [], id: "" } as note);

            // I'm pretty sure I should try/catch this
            statusMessage.value = "Successfully created note " + res.title;
            console.log("Created note ", statusMessage);
            return res;
        } else {
            console.log("Selected note: ");
            console.log(noteObj);
            // console.log("Navigating to note: ", noteObj.title);
            router.push({ path: `/note/${noteObj.id}` });
            // router.push({ path: "/note", query: { noteName:(newValue as string) } });
        }
    }

    async function filterThoughts(query:string): Promise<thought[]> {
        let filteredResults = await BackendPaths.Thoughts.GetThoughtsByContent(authStore.jwtToken, query);

        return filteredResults;
    }
    
    async function thoughtSelected(thoughtObj:thought, router: any = null) : Promise<any> {

        if (typeof thoughtObj === "string") {
            return NewThoughtModal;
        } else {
            console.log("Navigating to note containing thought: ", thoughtObj.content);
            router.push({ path: `/note/${thoughtObj.noteId}` });
        }
        return null;
    }

    return {
        filterNotes,
        // fetchThought,
        noteSelected,
        thoughtSelected,
        filterThoughts,
        statusMessage,
    }
})

// make sure to pass the right store definition, `useAuth` in this case.
// if (import.meta.hot) {
//     import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
// }