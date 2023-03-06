<template>
    <div
        contenteditable="true"
        ref="currentThought"
        placeholder="Start typing something..."
        @click="(evt:any) => setEndOfContenteditable(evt.target)"
        @dblclick="(evt:any) => highlightThought(evt)"
        @input="(evt:any) => handleInput(evt)"
        @keypress="(evt:any) => handleKeyPress(evt)"
        @keydown="(evt:any) => handleKeyDown(evt)"
        class="caret-white outline-none shadow-none"
        v-html="currentVal">
    </div>
</template>

<style>
    [contentEditable=true]:empty:focus::after {
        content:attr(placeholder);
        color: rgba(255, 255, 255, 0.8);
    }
</style>

<script setup lang="ts">
    import { useNoteStore } from "@/stores/notes";
    import { ref, computed, watch, defineComponent, nextTick, onMounted } from 'vue';

    let noteStore = ref(useNoteStore());

    const props = defineProps({
        initialVal: {
            type: String,
            default: "",
        },
        focusTrigger: {
            type: Number,
            default: 0,
        },
        thoughtId: {
            type: String,
            required: true,
        },
        thoughtIndex: {
            type: Number,
            required: true,
        },
        noteName: {
            type: String,
            required: true,
        }
    });

    const emit = defineEmits<{
        (event: 'focusThought', idx:number): void
    }>();

    let currentVal = ref(props.initialVal);

    let currentThought = ref(null);

    let saveTimeout = null as any;
    let currentSaveID = "";

    let handleInput = ref((evt:any) => {
        let newVal = evt.target.innerText;

        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        currentSaveID = props.thoughtId;
        saveTimeout = setTimeout(() => {
            // * only update if we're sure it's the same thought, no glitching
            if (currentSaveID === props.thoughtId) {
                // noteStore.value.updateThought(props.noteName, props.thoughtIndex, newVal);
            }
        }, 500);
    });

    let handleKeyDown = ref((evt:any) => {

        // left key, and right key can navigate thoughts

        // * pressed backspace
        if (evt.key === "Backspace" && evt.target.innerText.length === 0) {
            evt.preventDefault();
            console.log("Removing thought at index: ", props.thoughtIndex);
            // noteStore.value.removeThought(props.noteName, props.thoughtIndex);

            // * tell notes to focus their last thought
            emit("focusThought", props.thoughtIndex - 1);
            return;
        }
    });

    let handleKeyPress = ref((evt:any) => {

        // * enter key
        if (evt.keyCode === 13) {
            evt.preventDefault();
            evt.focus = false;
            // remove trailing newline
            
            let val = evt.target.innerText.trim();

            currentVal.value = val;

            evt.target.innerText = val;
            if (val.length > 0) {
                // noteStore.value.updateThought(props.noteName, props.thoughtIndex, val);
            }
            console.log("Inserting thought at index: ", props.thoughtIndex + 1);
            // noteStore.value.insertThought(props.noteName, props.thoughtIndex + 1, "");

            // * wait for new thought to appear
            nextTick(() => {
                emit("focusThought", props.thoughtIndex + 1);
            });
            // noteStore.value.addThought(props.noteName, '');
            return;
        }
    });

    let highlightThought = ref((evt:any) => {
        document.getSelection()?.selectAllChildren(evt.target);
        // document.getSelection().selectAllChildren(event.target)
    });

    let setEndOfContenteditable = (contentEditableElement: HTMLElement) => {
        var range,selection;
        if (document.createRange())//Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection() as Selection;//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
    }

    let focusThought = () => {
        let myInput = currentThought as HTMLElement;

        if (myInput.innerText.length > 0) {
            setEndOfContenteditable(myInput);
        }
        myInput.focus();
    }

    onMounted(() => {
        if (props.initialVal.length === 0) {
            nextTick(() => {
                // console.log("On created: focusing thought at index: ", this.thoughtIndex);
                // this.focusThought();
            });
        }
    }),

    watch(() => props.focusTrigger, (newVal) => {
        if (newVal > 0)
            focusThought();
    });


</script>