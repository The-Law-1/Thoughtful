import { note } from '@/types/note';
import { thought } from '@/types/thought';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from './auth';
import BackendPaths from './backendPaths';


export const useNoteStore = defineStore('notes', () => {
    const authStore = useAuthStore();
    // const router = useRouter();

    // create note
    async function createNote(noteObj: note) : Promise<note> {

        let createdNote = await BackendPaths.Notes.CreateNote(authStore.jwtToken, noteObj);

        return createdNote;
    }

    async function getNoteById(noteId: string): Promise<note> {
        let note = await BackendPaths.Notes.GetNoteById(authStore.jwtToken, noteId);

        return note;
    }

    async function updateNote(noteObj: note, updatedThoughts: thought[]): Promise<note> {
        let updatedNote = await BackendPaths.Notes.UpdateNoteById(authStore.jwtToken, noteObj._id, noteObj, updatedThoughts);

        return updatedNote;
    }

    // delete note
    async function deleteNote(noteId: string) : Promise<note> {

        let deletedNote = await BackendPaths.Notes.DeleteNoteById(authStore.jwtToken, noteId);

        return deletedNote;
    }

    async function exportNote(noteId: string, noteName: string = "note"): Promise<any> {
        let data = await BackendPaths.Notes.ExportNoteHtml(authStore.jwtToken, noteId, noteName);

        if (data) {
            // call the cleanup route
            let cleanupRes = await BackendPaths.Notes.CleanupExports(authStore.jwtToken);
        }

        return data;
    }

    return {
        deleteNote,
        createNote,
        getNoteById,
        updateNote,
        exportNote
    }
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNoteStore, import.meta.hot))
}