import Backend from "@/stores/backendPaths";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const jwtToken = useStorage<string | null>("jwtTokenThoughtful", null);
    const testValue = useStorage<string | null>("testValue", null);

    const jwtPayload = computed(() => {
        if (jwtToken.value === null) return null;
    
        const splitted = jwtToken.value.split(".");
        if (splitted.length < 2) return null;
    
        return JSON.parse(window.atob(splitted[1])) /*as JwtPayload*/;
    });
    
    
    const login: (
      password: string,
    ) => Promise<boolean> = async (password) => {
        try {            
            const result = await Backend.Auth.Login(password);

            let jsonValue = JSON.parse(result);
            jwtToken.value = jsonValue.access_token;
    
            console.log("Successfully logged in " + result);
            // console.log("Access token " + jsonValue.access_token);

            return true;
        } catch (e) {
            console.log("Bad password");
            jwtToken.value = null;
            return false;
        }
        return false;
    };

    const testApi: () => Promise<void> = async () => {
        const result = await Backend.HelloWorld.GetHelloWorld();

        console.log(result);
    }

    const verifyLoggedIn: () => Promise<boolean> = async () => {

        // console.log(jwtPayload.value);

        // * this should work, I guess we'll find out tomorrow
        if (jwtPayload.value && jwtPayload.value.exp < Date.now() / 1000) {
            jwtToken.value = null;
            return false;
        }
        return true;
    }

    // const testStorage: (
    //     testValue: string
    // ) => void = (newVal) => {
    //     testValue.value = newVal;
    // }

    return {
        jwtToken,
        login,
        testApi,
        verifyLoggedIn,
        jwtPayload,
        // testStorage
    }
});