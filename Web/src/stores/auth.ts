import Backend from "@/stores/backendPaths";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const jwtToken = useStorage<string | null>("jwtTokenThoughtful", null);
    const testValue = useStorage<string | null>("testValue", null);
  
    const login: (
      password: string,
    ) => Promise<void> = async (password) => {
      const result = await Backend.Auth.Login(password);
      jwtToken.value = result.access_token;
    };

    const testApi: () => Promise<void> = async () => {
        const result = await Backend.HelloWorld.GetHelloWorld();

        console.log(result);
    }

    const verifyLoggedIn: () => boolean = () => {
        // you want to call the api to verify the token is not expired and it's not some random token
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