<template>
  <div class="home">
    <MapContainer></MapContainer>
  </div>
</template>

<script>
// @ is an alias to /src
//import MapaView from  '@/components/MapaView.vue';

import MapContainer from '@/components/mapas/MapContainer.vue';
import moment from 'moment';

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
    var texp = Date.now() + (30 * 60 * 1000); //moment().add(20, 'm').toString();
  
    if (this.user == undefined){
      var logged = JSON.parse(localStorage.getItem('usermap'));
      
      if (logged && logged.exp > Date.now()){
        logged.exp = texp;
        logged = JSON.stringify(logged);
        var obj = JSON.parse(JSON.stringify(logged));
      } else {
        var obj = "{\"id\": 9999, \"mun\": 999, \"nivel\": 9, \"sys\": 1, \"exp\": " + texp + "}";
      }
    } else {
      var parc = JSON.parse(this.user);
      parc.exp = texp;
      this.user = JSON.stringify(parc);
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
