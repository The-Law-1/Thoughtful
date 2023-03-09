<template>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>
  
        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                    Write {{ props.thought }} to...
                </DialogTitle>

                <!-- <DialogDescription>
                    {{ props.thought }}
                </DialogDescription> -->

                <div class="mt-2">
                    <p class="text-sm text-gray-500">
                    </p>
                </div>
                <GenericCombobox
                    :placeholder="'Search notes'"
                    :searchFunction="filterResults"
                    @on-selected="onSelected"
                    :displayValues="(val:note) => (val as note) === null ? '' : val.title"
                    >
                </GenericCombobox>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
</template>
  
  <script setup lang="ts">
    import { ref } from 'vue'
    import {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogPanel,
        DialogDescription,
        DialogTitle,
    } from '@headlessui/vue'
    import NoteSearchBar from './NoteSearchBar.vue';
    import { useNoteStore } from "@/stores/notes";
    import { useSearchStore } from "@/stores/search";
    import { note } from "@/types/note";
    // * this import is not working, FOR NO REASON
    // import { thought } from "@/types/thought";
    import GenericCombobox from "@/components/GenericCombobox.vue";
    import { useThoughtStore } from '@/stores/thoughts';
 
    let searchStore = useSearchStore();
    let noteStore = useNoteStore();
    let thoughtStore = useThoughtStore();

    const isOpen = ref(true);

    const emit = defineEmits<{
        (event: 'close'): void
    }>();

    let props = defineProps({
        thought: {
            type: String,
            default: () => "",
        },
    });
    
    var filterResults = async (searchQuery:string) : Promise<note[]> => {
        console.log("Searching: ", searchQuery);

        var newResults = await searchStore.filterNotes(searchQuery);
        console.log("Got filteredResults: ", newResults);
        return newResults;
    }

    var onSelected = async (newValue:any) => {
        // can be a string or a note object

        console.log("Caught selected from thoughtmodal: ", newValue);

        // id is useless, we only send content and noteId to the server haha
        // but we need it because of type thought
        let thoughtObject = { 
            _id: "",
            content: props.thought,
            noteId: ""};

        if (typeof newValue !== 'string') {
            // id or _id? We'll find out soon enough
            console.log("Got note: ", newValue);
            thoughtObject.noteId = newValue._id;
            console.log("Sending thought: ", thoughtObject);
            await thoughtStore.createThought(thoughtObject);
        } else {
            console.log("Sending thought with note title: ", thoughtObject, newValue);

            await thoughtStore.createThoughtWithNoteTitle(thoughtObject, newValue);
        }

        closeModal();
    }
    
    function closeModal() {
        isOpen.value = false;

        emit("close");
    }
  </script>
  