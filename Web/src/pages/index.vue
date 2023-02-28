<template>
    <div class="flex items-center flex-col w-full h-[100vh]">
        <div class="text-9xl mt-[30vh] w-[50%] text-center">
            <!-- Thoughtful -->
            <span v-for="(letter, i) in thoughtfulLetters" :key="'letter-' + i" class="animate-fade_in">
                {{ letter }}
            </span>
        </div>
        <div v-if="showGetStarted" class="text-4xl animate-fade_in p-2 rounded-lg hover:cursor-pointer select-none bg-gunmetal text-white"
            @click="() => getStarted()">
            Get started
        </div>
    </div>

</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';

    let authStore = useAuthStore();
    let thoughtfulLetters = ref([]);
    let showGetStarted = ref(false);
    let router = useRouter();

    let animateFadeInTxt = (fullText: string) => {
        // loop over each letter in the text
        for (let i = 0; i < fullText.length; i++) {
            // add each letter to the array

            // add a small timeout
            setTimeout(() => {
                // add the letter to the array
                thoughtfulLetters.value.push(fullText[i]);
            }, 100 * i);
        }
    };

    let userLoggedIn = authStore.verifyLoggedIn();

    // click getstarted
    let getStarted = ref(() => {
        // import authStore
        if (userLoggedIn === true) {
            //redirect to tools
            router.push("/tools");
        } else {
            router.push("/login");
        }
    });

    onMounted(() => {
        let welcomeText = "Thoughtful";
        setTimeout(() => {
            animateFadeInTxt(welcomeText);
        }, 200);
        setTimeout(() => {
            showGetStarted.value = true;
        }, welcomeText.length * 100 + 500);
    });


</script>