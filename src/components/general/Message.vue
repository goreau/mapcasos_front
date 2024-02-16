<template>
    <article class="message" :class="style">
    <div class="message-header">
      <p>{{ caption }}</p>
      <button class="delete" @click="$emit('doClose')" aria-label="delete"></button>
    </div>
    <div class="message-body">
      {{ msg }}
    </div>
  </article>
  </template>
  
  <script>
  export default {
      name: 'Message',
      props: {
          msg: '',
          caption: '',
          type: ''
      },
      emits: ['doClose'],
      data() {
          return {
              style: ''
          }
      },
      methods: {
  
      },
      mounted() {
          this.style = this.type == 'alert' ? 'is-danger' : (this.type == 'success' ? 'is-success' : 'is-info');
      }
  }
  </script>
  
  <style>
  
  </style>