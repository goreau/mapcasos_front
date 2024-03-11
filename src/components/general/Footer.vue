<template>
    <div id="footer">
          <p>Coordenadoria de Controle de Doenças &copy; 2024</p>
      </div> 
  </template>
  
  <script>
  export default {
      name: 'Footer'
  }
  </script>
  
  <style scoped lang="scss">
  @import "@/components/general/css/custom-var";
      #footer{
          background-color: $primary-color;
          border-top: 6px solid $item-color;
          
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          color: rgb(6, 11, 78);
          height: 3rem;
          z-index: 98;
          position:fixed;
          margin-bottom:0px;
      }
  </style>