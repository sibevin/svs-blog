<template lang="slm">
div id="app"
  img src="./images/logo.png"
  h1
    | {{ msg }}
  h2 Essential Links
  ul
    li
      a href="https://vuejs.org" target="_blank" Core Docs
    li
      a href="https://forum.vuejs.org" target="_blank" Forum
    li
      a href="https://gitter.im/vuejs/vue" target="_blank" Gitter Chat
    li
      a href="https://twitter.com/vuejs" target="_blank" Twitter
  p v-for="todo in todos" :key="todo.id"
    | {{ todo.name }} (
    button type="button" name="button" v-on:click="removeTodo(todo)"
      | x
    |)
  div
    input type="text" name="" value="" v-model="newTodo.name"
    button type="button" name="button" v-on:click="addTodo"
      | Create
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      todos: [{
        id: 1,
        name: '002'
      }, {
        id: 2,
        name: '002'
      }],
      newTodo: {
        name: ''
      }
    }
  },
  methods: {
    addTodo: function() {
      let nextId = this.todos[this.todos.length - 1].id + 1
      this.todos.push({
        id: nextId,
        name: this.newTodo.name
      })
      this.newTodo.name = ''
    },
    removeTodo: function(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
