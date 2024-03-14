<script setup>
import { computed, ref } from 'vue';

    const wantToDelete = ref(false)

    const props = defineProps({
        name: String,
        done: Boolean,
        show: {
            type: Boolean,
            default: true
        }
    })
    
    const emit = defineEmits(['toggleDone', 'deleteTask', 'wantToDeleteTask'])
    
    const toDelete = () => {
        let resetDeleteTimeout
        if(!wantToDelete.value) {
            wantToDelete.value = true
            emit('wantToDeleteTask', props.name)
            resetDeleteTimeout = setTimeout(() => wantToDelete.value = false, "5000")
        } else {
            clearTimeout(resetDeleteTimeout)
            wantToDelete.value = false
            emit('deleteTask')
        }
    }

    const onClickCheckbox = () => emit('toggleDone')

    const liStyle = computed({
        get() {
            return {
                'align-items': 'center',
                'background-color': wantToDelete.value ? '#fca6a1 !important' : (props.done ? '#cdfc93' : '#fff740'),
                'color': props.done ? 'green' : 'black',
                'list-style': 'none',
                'margin': '0 16px 8px',
                'order': props.done ? '999' : 'inherit',
                'padding': '16px 0 0',
            }; 
        }
    })

</script>

<template>
    <div id="task" v-show="show" :style="liStyle">
        <div class="mt-2 d-flex align-items-center">
            <input id="checkboxInput" type="checkbox" class="form-check-input mx-4" :checked="props.done" @change="onClickCheckbox">
            <span class="mx-4" :style="{'text-decoration-line': props.done ? 'line-through' : 'none', 'user-select': 'none'}">{{ name }}</span>
        </div>
        <button class="btn btn-danger " @click="toDelete">
            <span class="material-symbols-outlined">
                delete_forever
            </span>
        </button>
    </div>
</template>

<style scoped>
    #task {
        width: 25%;
        min-height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    div > * {
        margin-right: 4px;
    }

    #checkboxInput {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }

    button {
        margin: 16px 0 0;
        display: flex;
        width: 100%;
        align-items: center;
        text-decoration-line: none !important;
        justify-content: center;
    }
</style>