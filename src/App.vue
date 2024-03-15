<script setup>
import { reactive, ref, watch } from 'vue'

import TaskView from './components/TaskView.vue'

import Task from './models/Task.js'

const taskName = ref("")
const searchTaskName = ref("")
const tasks = reactive([])
const inputTaskName = ref(null)
const hasTask = ref(false)
const qtdDones = ref(0)

const showAlert = ref(false)
const textAlert = ref("")
const alertDiv = ref(null)

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

function updateDones(task) {  
  task.toggleDone()

  if(task.done) qtdDones.value++
  else qtdDones.value--
}
</script>

<template>
    <div id="criar-tarefa" class="m-4">
      <input type="text" class="form-control"  ref="inputTaskName" v-model="taskName" placeholder="Nome da tarefa"
      @keyup.enter="addTask">
      <button class="btn btn-primary" @click="addTask">Criar Tarefa</button>
    </div>
    <input type="text" class="form-control m-4" v-model="searchTaskName" placeholder="Filtrar tarefas">
  <div class="alert" ref="alertDiv" role="alert" v-show="showAlert" v-text="textAlert"></div>
  <div v-show="hasTask" class="d-flex align-items-center m-3">
    <span class="material-symbols-outlined">
      check_circle
    </span>
    <span>{{ qtdDones }} / {{ tasks.length }}</span>
  </div>
  <div id="tasks" v-if="hasTask">
    <TaskView v-for="task in tasks"
      :name="task.getName()"
      :done="task.getDone()"
      :show="task.getShow()"
      @toggleDone="() => updateDones(task)"
      @deleteTask="removeTask(task)"
      @wantToDeleteTask="wantToDeleteTask"
    />
  </div>
  <div id="no-tasks-info" class="d-flex flex-column" v-else>
    <div id="kanban-image">
      <img src="/img/kanban.jpg" alt="Quadro kanban de ilustração"/>
      <a href="https://www.freepik.com/free-vector/kanban-method-concept-illustration_28902449.htm#query=kanban&position=1&from_view=keyword&track=sph&uuid=7d595844-9766-45d6-8e5b-98d34cd654be">Image by storyset</a> on Freepik
    </div>
    <h2 class="text-center">Nenhuma tarefa encontrada!</h2>
    <p class="--bs-light-bg-subtle text-center">Crie uma nova tarefa {{ searchTaskName != "" ? "ou procure por outro nome" : "" }}</p>
  </div>
</template>

<style scoped>
  .form-control {
    width: 75vw;
  }

  #criar-tarefa > * {
    margin-right: 8px;
  }

  #kanban-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 16px;
  }

  #kanban-image > img {
    width: 25vw;
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
</style>
