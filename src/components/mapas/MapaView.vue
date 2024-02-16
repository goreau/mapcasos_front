<template>
    <div>
        <ol-map
            :loadTilesWhileAnimating="true"
            :loadTilesWhileInteracting="true"
            style="height: 70rem"
        >
            <ol-view
            ref="view"
            :center="center"
            :rotation="rotation"
            :zoom="zoom"
            :projection="projection"
            />
            
            <ol-vector-layer>
                <ol-source-vector
                    ref="vectorsource"
                    :features="features"
                />
            </ol-vector-layer>
            
            <ol-tile-layer>
            <ol-source-osm />
            </ol-tile-layer>

            
        </ol-map>
        {{ feats }}
    </div>  
</template>

<script setup>
import { ref, computed } from "vue";

const center = ref([-45, -23]);
const projection = ref("EPSG:4326");
const zoom = ref(7);
const rotation = ref(0);

const props = defineProps({
  data: [],
})

const features = computed(() => {
    var feats = [];

    this.data.map( el => {
        var feat = new Feature({
            geometry: new Point([el.latitude, el.longitude])
        }) 
        feats.push(feat);
    });
    return feats;
});


</script>

<style>

</style>