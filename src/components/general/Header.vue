<template>
  <div class="conteudo">
    <div class="tile is-ancestor">
      <div class="tile is-3">
        <nav>
          <router-link to="/home" id="logo_url">
            <img src="@/assets/home.png" alt="img" id="logo" />
          </router-link>
        </nav>
        <p class="title">Mapeamento de Casos</p>
      </div>
    </div>
  </div>
</template>

<script>
// import Name from '@/components/Name.vue';

export default {
  name: "Header",
  components: {
   
  },
};
</script>

<style scoped lang="scss">
  @import "@/components/general/css/custom-var";
.conteudo {
  height: 4rem;
  background-color: $primary-color;
  border-bottom: 8px solid $item-color;
  padding: 1rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}
nav {
  
  padding: 1px 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

nav #logo_url {
  margin: auto;
  margin-left: 0;
}

#logo {
  width: 40px;
  height: 40px;
}

.title {
  color: darkgoldenrod;
}
</style>
