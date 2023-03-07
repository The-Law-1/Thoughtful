import { thought } from "@/types/thought";
import { acceptHMRUpdate, defineStore } from "pinia";
import { useAuthStore } from "./auth";
import BackendPaths from "./backendPaths";

export const useThoughtStore = defineStore('thoughts', () => {
    const authStore = useAuthStore();

    // create thought
    async function createThought(thoughtObj: thought) : Promise<thought> {
        // if the noteId is empty, it will create a note automatically
        let createdThought = await BackendPaths.Thoughts.CreateThought(authStore.jwtToken, thoughtObj);
    
        return createdThought;
    }

    async function createThoughtWithNoteTitle(thoughtObj: thought, noteTitle: string): Promise<thought> {
        // if the noteTitle doesn't find any note, it creates a note with the title
        let createdThought = await BackendPaths.Thoughts.CreateThoughtOnNote(authStore.jwtToken, thoughtObj, noteTitle);
    
        return createdThought;
    }

    async function getThoughtsForNote(noteId: string): Promise<thought[]> {
        let thoughts = await BackendPaths.Thoughts.GetThoughtsForNote(authStore.jwtToken, noteId);
    
        return thoughts;
    }

    // delete thought
    async function deleteThought(thoughtId: string) : Promise<thought> {
        let deletedThought = await BackendPaths.Thoughts.DeleteThoughtById(authStore.jwtToken, thoughtId);
    
        return deletedThought;
    }

    return {
        createThought,
        deleteThought,
        createThoughtWithNoteTitle,
        getThoughtsForNote
    }
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useThoughtStore, import.meta.hot))
}