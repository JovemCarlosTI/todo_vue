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
                'padding': '16px',
                'text-decoration-line': props.done ? 'line-through' : 'none',
            }; 
        }
    })

</script>

<template>
    <div v-show="show" :style="liStyle">
      <input type="checkbox" class="form-check-input" :checked="props.done" @change="onClickCheckbox">
      <span>{{ name }}</span>
      <button class="btn btn-danger" @click="toDelete">Apagar</button>
    </div>
</template>

<style scoped>
    div > * {
        margin-right: 4px;
    }

    button {
        margin-left: 8px;
    }
</style>