<template>
    <div
        contenteditable="true"
        ref="currentThought"
        placeholder="Start typing something..."
        @keypress="(evt:any) => handleKeyPress(evt)"
        @keydown="(evt:any) => handleKeyDown(evt)"
        class="caret-white outline-none shadow-none">
        {{ currentVal }}
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
    import { ref, computed, watch, defineComponent } from 'vue';

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
        thoughtIndex: {
            type: Number,
            required: true,
        },
        noteName: {
            type: String,
            required: true,
        }
    });

    let handleKeyDown = ref((evt:any) => {

        // left key, and right key can navigate thoughts

        // * pressed backspace
        if (evt.key === "Backspace" && evt.target.innerText.length === 0) {
            evt.preventDefault();
            console.log("Pressed backspace");
            noteStore.value.removeThought(props.noteName, props.thoughtIndex);
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
            evt.target.innerText = val;
            if (val.length > 0) {
                // add the thought to the store
                // add an empty thought
                noteStore.value.updateThought(props.noteName, props.thoughtIndex, val);
            }
            noteStore.value.addThought(props.noteName, '');
            return;
        }
        if (evt.key === '/') {
            // this.$refs.commandList.focus();
            return;
        }

        noteStore.value.updateThought(props.noteName, props.thoughtIndex, evt.target.innerText);
    });

    let currentVal = ref(props.initialVal);

</script>

<script lang="ts">

    export default defineComponent({
        name: "Thought",

        methods: {
            // * https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
            setEndOfContenteditable(contentEditableElement:HTMLElement)
            {
                var range,selection;
                if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
                {
                    range = document.createRange();//Create a range (a range is a like the selection but invisible)
                    range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
                    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
                    selection = window.getSelection() as Selection;//get the selection object (allows you to change selection)
                    selection.removeAllRanges();//remove any selections already made
                    selection.addRange(range);//make the range you have just created the visible selection
                }
            },
            focusThought()
            {
                let myInput = this.$refs.currentThought as HTMLElement;

                if (myInput.innerText.length > 0) {
                    this.setEndOfContenteditable(myInput);
                }
                myInput.focus();
                // place caret at the end of the text
            }
        },
        created: function() {
            console.log("Created thought: ", this.thoughtIndex);
            this.$nextTick(() => {
                this.focusThought();
            })
        },
        watch: {
            focusTrigger: function(newVal) {
                if (newVal > 0)
                    this.focusThought();
            }
        }
    });

</script>