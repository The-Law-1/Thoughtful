<template>
    <div
        contenteditable="true"
        ref="currentThought"
        placeholder="Start typing something..."
        @dblclick="(evt:any) => highlightThought(evt)"
        @input="(evt:any) => handleInput(evt)"
        @keypress="(evt:any) => handleKeyPress(evt)"
        @keydown="(evt:any) => handleKeyDown(evt)"
        class="caret-black outline-none shadow-none text-lg">
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
    import { thought } from "@/types/thought";
import { setUncaughtExceptionCaptureCallback } from "process";
    import { ref, computed, watch, defineComponent, nextTick, onMounted } from 'vue';

    let noteStore = ref(useNoteStore());

    const props = defineProps({
        modelValue: {
            type: String,
            default: "",
        },
        focusTrigger: {
            type: Number,
            default: 0,
        },
        // thoughtId: {
        //     type: String,
        //     required: true,
        // },
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
        (event: 'focusThought', idx:number): void,
        (event: "update:modelValue", val:string): void,
        (event: "thoughtUpdated", value:string): void,
        (event: "thoughtDeleted", value:string): void,
        (event: "thoughtInserted", idx:number): void,
    }>();

    let currentThought = ref(null);

    let handleInput = ref((evt:any) => {
        let newVal = evt.target.innerText;

        emit("update:modelValue", newVal);
        emit("thoughtUpdated", newVal);
        // value.value = newVal;
    });

    let handleKeyDown = ref((evt:any) => {

        // down key, and up key can navigate thoughts
        let cursorIndex = cursorPosition();
        // if we are at the end or the start of a though
        // console.log(getPositionInLine());
        let endOfLinePosition = 108; // ugly hack but I can't calculate the end of line position
        if ((evt.keyCode === 40 && cursorIndex >= evt.target.innerText.length - endOfLinePosition) || (evt.keyCode === 38 && cursorIndex <= endOfLinePosition)) {
            // if caret is at end of text
            evt.preventDefault();
            let direction = evt.keyCode === 40 ? 1 : -1;
            let nextThoughtIndex = props.thoughtIndex + direction;

            emit("focusThought", nextThoughtIndex);

            // if (direction === -1)
            //     placeCaretAtEnd(evt.target);
            return;
        }


        // * pressed backspace
        if (evt.key === "Backspace" && evt.target.innerText.length === 0) {
            evt.preventDefault();
            console.log("Removing thought at index: ", props.thoughtIndex);
            // emit("thoughtDeleted", props.thoughtId);
            emit("thoughtDeleted", "");

            // noteStore.value.removeThought(props.noteName, props.thoughtIndex);
            return;
        }
    });

    const getPositionInLine = () => {

        const sel = document.getSelection();
        // select whole line

        sel.modify("extend", "backward", "line");
        const pos = sel.toString().length;
        if (sel.anchorNode != undefined) sel.collapseToEnd();
        return pos;
    }

    const cursorPosition = () => {
        const sel = document.getSelection();
        // lineboundary, wordboundary, documentboundary
        sel.modify("extend", "backward", "documentboundary");
        const pos = sel.toString().length;
        if (sel.anchorNode != undefined) sel.collapseToEnd();
        return pos;
    }

    let handleKeyPress = ref((evt:any) => {
        let cursorIndex = cursorPosition();
        // console.log("Key pressed: ", evt.keyCode, evt.key, evt.target.innerText.length, cursorPosition());
        // if we're at the end of the thought, and enter is pressed, add a new thought
        if (evt.keyCode === 13 && evt.target.innerText.length === cursorIndex) {
            evt.preventDefault();
            evt.focus = false;
            // remove trailing newline

            // emit add thought
            emit("thoughtInserted", props.thoughtIndex + 1);

            return;
        }
    });

    let highlightThought = ref((evt:any) => {
        document.getSelection()?.selectAllChildren(evt.target);
        // document.getSelection().selectAllChildren(event.target)
    });

    let placeCaretAtEnd = (contentEditableElement: HTMLElement) => {
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

    let focusThought = (caretEnd:boolean = false) => {

        // console.log("On created: focusing thought at index: ", this.thoughtIndex);
        // this.focusThought();
        let myInput = (currentThought.value) as HTMLElement;

        if (myInput.innerText && myInput.innerText.length > 0 && caretEnd) {
            placeCaretAtEnd(myInput);
        }
        myInput.focus();
    }

    onMounted(() => {
        currentThought.value.innerText = props.modelValue;
        if (props.modelValue.length === 0) {
            nextTick(() => {
                // console.log("On created: focusing thought at index: ", this.thoughtIndex);
                // this.focusThought();
            });
        }
    }),

    watch(() => props.focusTrigger, (newVal) => {
        // console.log("Watch focus trigger: ", newVal);

        if (newVal > 0)
            focusThought();

        if (newVal < 0) {
            focusThought(true);
            // console.log("Focusing thought at end of string");
        }
    });


</script>