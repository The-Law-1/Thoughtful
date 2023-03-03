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

    // delete thought
    async function deleteThought(thoughtId: string) : Promise<thought> {
        let deletedThought = await BackendPaths.Thoughts.DeleteThoughtById(authStore.jwtToken, thoughtId);
    
        return deletedThought;
    }

    return {
        createThought,
        deleteThought
    }
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useThoughtStore, import.meta.hot))
}