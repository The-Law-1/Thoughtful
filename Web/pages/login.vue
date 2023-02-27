<template>
    <div class="flex justify-center w-full">
        <!-- basically an input bar saying password in the middle of the page -->
        <form class="w-full flex justify-center" @submit="(evt) => submitPassword(evt)" autocomplete="off">
            <input
                class="text-lg mt-[25vh] p-2 h-12 w-[25%] transition ease-in-out duration-300 text-white focus:border-b-white bg-transparent border-b-2 border-b-gray-500 rounded-md focus:outline-none "
                type="password" placeholder="Password" v-model="password"/>
        </form>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';

    let password = ref("")

    let submitPassword = ref((e:any) => {
        e.preventDefault();
        // redirect to tools page maybe but definitely don't refresh my page
        alert("You submitted password " + password.value);
    });

</script>