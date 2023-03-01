import Backend from "@/stores/backendPaths";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const jwtToken = useStorage<string | null>("jwtTokenThoughtful", null);
    const testValue = useStorage<string | null>("testValue", null);
  
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
        // you want to call the api to verify the token is not expired and it's not some random token
        if (jwtToken.value) {
            let isValid = await Backend.Auth.VerifyToken(jwtToken.value);
            return isValid;
        }
        return false;
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
        // testStorage
    }
});