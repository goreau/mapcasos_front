<template>         
    <div class="loader-wrapper is-active">
      <div class="loader is-loading"></div>
    </div>     
  </template>
  
  <script>
  export default {
  
  }
  </script>
  
  <style scoped>
  .loader-wrapper {
    position: absolute;
    top: 10rem;
    left: 0;
    height: 90%;
    width: 100%;
    background: #fff;
    opacity: 1;
    z-index: 10;
    transition: opacity .3s;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
  }
    
  .loader {
      animation: spinAround 500ms infinite linear;
      border: 12px solid rgb(72, 96, 201);
      border-radius: 9999px;
      border-right-color: transparent;
      border-top-color: transparent;
      content: "";
      display: block;
      height: 10em;
      position: relative;
      width: 10em;
      margin-top: -15rem;
  }
  
  .is-loading {
    position: relative;
  }
  </style>