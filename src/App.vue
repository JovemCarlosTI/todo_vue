<script setup>
import { reactive, ref, watch } from 'vue'

import TaskView from './components/TaskView.vue'

const taskName = ref("")
const searchTaskName = ref("")
const tasks = reactive([])
const inputTaskName = ref(null)
const hasTask = ref(false)
const qtdDones = ref(0)

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
    
    if(this.done) qtdDones.value++
    else qtdDones.value--
  }
}

watch(searchTaskName, () => {
  hasTask.value = false
  tasks.forEach(task => {
    if(searchTaskName == "") task.show = true
    else if (task.name.toLowerCase().includes(searchTaskName.value.toLowerCase())) {
      task.show = true
      hasTask.value = true
    } else task.show = false
  })
})

function addTask() {
  if(taskName.value != "") {
    const newTask = new Task(taskName.value)
    tasks.push(newTask)

    const name = taskName.value.length > 75
      ? taskName.value.substring(0, 75) + "..."
      : taskName.value

    showAlertDiv(
      `Tarefa '${name}' criada com sucesso!`,
      'alert-success'
    )
    taskName.value = ""
    hasTask.value = true
  }

  if(inputTaskName) inputTaskName.value.focus()
}

function wantToDeleteTask(taskName) {
  const name = taskName.length > 75
    ? taskName.substring(0, 75) + "..."
    : taskName
  showAlertDiv(
    `Tem certeza que deseja apagar a tarefa '${name}'? Clique novamente para apagar!`,
    'alert-danger'
  )
}

function removeTask(taskToRemove) {
  if(taskToRemove.done) qtdDones.value--

  const taskIndex = tasks.findIndex(task => task == taskToRemove)
  this.tasks.splice(taskIndex, 1)

  const name = taskToRemove.name.length > 75
    ? taskToRemove.name.substring(0, 75) + "..."
    : taskToRemove.name

  showAlertDiv(`Tarefa '${name}' removida com sucesso!`, 'alert-danger')
  if(this.tasks.length == 0) hasTask.value = false
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
    </div>
    <input type="text" class="form-control" v-model="searchTaskName" placeholder="Filtrar tarefas">
  <div class="alert" ref="alertDiv" role="alert" v-show="showAlert" v-text="textAlert"></div>
  <div v-show="hasTask" class="d-flex align-items-center m-3">
    <span class="material-symbols-outlined">
      check_circle
    </span>
    {{ qtdDones }} / {{ tasks.length }}
  </div>
  <div id="tasks" v-if="hasTask">
    <TaskView v-for="task in tasks"
      :name="task.getName()"
      :done="task.getDone()"
      :show="task.getShow()"
      @dblclick="task.toggleDone()"
      @toggleDone="task.toggleDone()"
      @deleteTask="removeTask(task)"
      @wantToDeleteTask="wantToDeleteTask"
    />
  </div>
  <div id="no-tasks-info" class="d-flex flex-column" v-else>
    <h2 class="text-center">Nenhuma tarefa encontrada!</h2>
    <p class="--bs-light-bg-subtle text-center">Crie uma nova tarefa {{ searchTaskName != "" ? "ou procure por outro nome" : "" }}</p>
  </div>
</template>

<style scoped>
  #criar-tarefa > * {
    margin-right: 8px;
  }

  #criar-tarefa, #tasks {
    margin-bottom: 8px;
    display: flex;
  }

  #tasks {
    display: flex;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  #no-tasks-info {
    margin-top: 6rem;
  }
</style>
