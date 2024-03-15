import { ref } from 'vue'

export default class Task {
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