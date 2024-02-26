<template>
  <div class="home">
    <MapContainer></MapContainer>
  </div>
  {{ user }}
</template>

<script>
// @ is an alias to /src
//import MapaView from  '@/components/MapaView.vue';

import MapContainer from '@/components/mapas/MapContainer.vue';

export default {
  data() {
    return {
      user: {}
    }
  },
  name: 'HomeView',
  components: {
    MapContainer,
  },
  mounted(){
    this.user = this.$route.query.user;
    if (this.user == undefined){
      var obj = "{\"id\": 9999, \"mun\": 999, \"nivel\": 9, \"sys\": 1}";
    } else {
      var obj = JSON.parse(JSON.stringify(this.user));
    }
    localStorage.setItem('usermap', obj);
    this.$store.dispatch("auth/login", obj)
          .then(
            () => {
                console.log(obj);
            },
            (error) => {
              console.log('não logado')
            }
          )
  }
}
</script>
