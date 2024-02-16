<template>
  <div class="home">
    <MapContainer></MapContainer>
  </div>
</template>

<script>
// @ is an alias to /src
//import MapaView from  '@/components/MapaView.vue';

import MapContainer from '@/components/mapas/MapContainer.vue';

export default {
  name: 'HomeView',
  components: {
    MapContainer,
  }
}
</script>
