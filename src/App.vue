<script setup>
import { reactive, ref, watch } from 'vue'

import TaskView from './components/TaskView.vue'

const taskName = ref("")
const searchTaskName = ref("")
const tasks = reactive([])
const inputTaskName = ref(null)

const showAlert = ref(false)
const textAlert = ref("")
const alertDiv = ref(null)

class Task {
  constructor(name) {
    this.name = name
    this.done = ref(false)
    this.show = ref(true)
  }

  getName() {
    return this.name
  }

  getDone() {
    return this.done
  }

  getShow() {
    return this.show
  }

  toggleDone() {
    this.done = !this.done
  }
}

watch(searchTaskName, () => {
  tasks.forEach(task => {
    if(searchTaskName == "") task.show = true
    else if (task.name.toLowerCase().includes(searchTaskName.value.toLowerCase())) task.show = true
    else task.show = false
  })
})

function addTask() {
  if(taskName.value != "") {
    const newTask = new Task(taskName.value)
    tasks.push(newTask)
    showAlertDiv(
      `Tarefa '${taskName.value}' criada com sucesso!`,
      'alert-success'
    )
    taskName.value = ""

  }

  if(inputTaskName) inputTaskName.value.focus()
}

function wantToDeleteTask(taskName) {
  showAlertDiv(
    `Tem certeza que deseja apagar a tarefa '${taskName}'? Clique novamente para apagar!`,
    'alert-danger'
  )
}

function removeTask(taskToRemove) {
  const taskIndex = tasks.findIndex(task => task == taskToRemove)
  this.tasks.splice(taskIndex, 1)

  showAlertDiv(`Tarefa '${taskToRemove.name}' removida com sucesso!`, 'alert-danger')
}

function showAlertDiv(text, styleClass, time='5000') {
  if (showAlert.value && alertDiv.value.className != `alert ${styleClass}`) {
    alertDiv.value.className = ""
  }

  if(!showAlert.value) {
    setTimeout(() => {
        showAlert.value = false
        alertDiv.value.className = ""
    }, time)
  }
  
  alertDiv.value.classList.add("alert", styleClass)
  textAlert.value = text
  showAlert.value = true

}
</script>

<template>
    <div id="criar-tarefa" class="m-4">
      <input type="text" class="form-control"  ref="inputTaskName" v-model="taskName" placeholder="Nome da tarefa"
      @keyup.enter="addTask">
      <button class="btn btn-primary" @click="addTask">Criar Tarefa</button>
      <input type="text" class="form-control" v-model="searchTaskName" placeholder="Filtrar tarefas">
    </div>
  <div class="alert" ref="alertDiv" role="alert" v-show="showAlert" v-text="textAlert"></div>
  <div id="tasks">
    <TaskView v-for="task in tasks"
      :name="task.getName()"
      :done="task.getDone()"
      :show="task.getShow()"
      @toggleDone="task.toggleDone()"
      @deleteTask="removeTask(task)"
      @wantToDeleteTask="wantToDeleteTask"
    />
  </div>
</template>

<style scoped>
  div > * {
    margin-bottom: 8px;
    display: flex;
  }

  #tasks {
    display: flex;
    flex-wrap: wrap;
  }
</style>
