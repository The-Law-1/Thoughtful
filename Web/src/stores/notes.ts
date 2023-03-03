import { note } from '@/types/note';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from './auth';
import BackendPaths from './backendPaths';


export const useNoteStore = defineStore('notes', () => {
    const authStore = useAuthStore();
    const router = useRouter();

    // create note 

    // delete note
    async function deleteNote(noteId: string) : Promise<note> {

        let deletedNote = await BackendPaths.Notes.DeleteNoteById(authStore.jwtToken, noteId);

        return deletedNote;
    }

    return {
        deleteNote
    }
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNoteStore, import.meta.hot))
}