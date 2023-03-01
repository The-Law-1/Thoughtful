<template>
    <main>

        <div class="flex text-center items-center flex-col w-full h-[100vh]">
            <!-- basically an input bar saying password in the middle of the page -->
            <form class="w-full flex justify-center" @submit="(evt) => submitPassword(evt)" autocomplete="off">
                <input
                class="text-lg mt-[25vh] p-2 h-12 w-[25%] transition ease-in-out duration-300 text-black focus:border-b-black bg-transparent border-b-2 border-b-gray-500 rounded-md focus:outline-none "
                type="password" placeholder="Password" v-model="password"/>
            </form>
            <!-- bad password alert -->
            <div v-show="failedLogin"
                class=" mt-5 text-red-600">
                You failed to log in. Who are you? Explain yourself
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { useAuthStore } from "@/stores/auth";
    import { useRouter } from 'vue-router';

    let router = useRouter();
    let authStore = useAuthStore();

    let failedLogin = ref(false);

    let password = ref("")

    let submitPassword = ref(async (e:any) => {
        e.preventDefault();
        // redirect to tools page maybe but definitely don't refresh my page
        // alert("You submitted password " + password.value);

        // authStore.testApi();
        let authenticated = await authStore.login(password.value);

        if (authenticated) {
            // redirect to tools page
            router.push("/tools");
            // alert("You are authenticated");
        } else {
            failedLogin.value = true;
            // alert("Bad password");
        }

        // authStore.testStorage("Test value for storage");
    });

</script>