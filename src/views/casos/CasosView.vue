<template>
    <div class="columns">
        <div class="column" style="padding: 2rem;">
            <MapContainer ref="myMap" v-if="tipo==1" 
            :feats="features" 
            :rem="removes" 
            :revis="revis"
            :hasLegenda="legend"
            :lTitle="legTitle"
            @onPoligon="onPoligon = $event" ></MapContainer>
            <ClusterContainer v-if="tipo==2" :arrData="arrData"></ClusterContainer>
            <div class="actionBar">
                <div class="columns">
                    <div class="column box is-4 is-offset-4 has-text-centered ctrlBar">
                        <span class="btCont">
                            <button class="button" title="Limpar Mapa" @click="$refs.myMap.limpaMap()">
                                <span class="btico"><font-awesome-icon icon="fa-solid fa-power-off" /></span>      
                            </button>
                        </span>
                        <span class="btCont">
                            <button class="button" title="Criar Raio" @click="$refs.myMap.raiar()">
                                <span class="btico"><font-awesome-icon icon="fa-solid fa-circle" /></span>      
                            </button>
                        </span>
                        <span class="btCont">
                            <button class="button" title="Criar Polígono" @click="$refs.myMap.doPoligono()">
                            <span class="btico"><font-awesome-icon icon="fa-solid fa-draw-polygon" /></span>      
                            </button>
                            <button class="button" title="Carregar Polígono" @click="$refs.myMap.loadPoligono()">
                                <span class="btico"><font-awesome-icon icon="fa-solid fa-file-import" /></span>      
                            </button>
                            <button class="button" title="Limpar Polígonos" @click="$refs.myMap.limpaPol()">
                                <span class="btico"><font-awesome-icon icon="fa-solid fa-broom" /></span>      
                            </button>
                        </span>
                        <span class="btCont">
                            <button class="button" title="Legenda" @click="legendar()">
                                <span class="btico"><font-awesome-icon icon="fa-solid fa-tag" /></span>      
                            </button>
                            <button class="button" title="Exportar Mapa" @click="$refs.myMap.exportMap()">
                                <span class="btico"><font-awesome-icon icon="fa-solid fa-file-pdf" /></span>      
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="column is-2 box" v-if="tipo==1">
            <fieldset class="fieldset">
                <legend>Semanas</legend>
                <div class="column">
                    <div class="columns" v-for="sem in semanas" :key="sem.semana">
                        <label for="" class="checkbox">
                            <input type="checkbox" @change="getCasos($event)" :true-value="[]" :value="sem.semana">
                            {{ sem.semana }}
                        </label>
                    </div>
                </div>
            </fieldset>
        </div>
    </div>
</template>
  
<script>
// @ is an alias to /src
import MapContainer from '@/components/mapas/MapContainer.vue';
import ClusterContainer from '@/components/mapas/ClusterContainer.vue';
import CasosService from "@/services/casos.service.js";
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';

export default {
    data() {
        return {
            arrData: [],
            semanas: [],
            previous: [],
            features: null,
            removes: null,
            revis: null,
            tipo: 0,
            onPoligon: 0,
            legend: false,
            legTitle: 'teste'
        }
    },
    name: 'HomeView',
    components: {
        MapContainer,
        ClusterContainer,
    },
    mounted() { 
        this.tipo = this.$route.query.tipo;
        if (this.tipo == 1){
            this.semanas = JSON.parse(this.$route.query.semanas);
            this.legTitle = this.$route.query.filter;
            this.features = [];
        } else {
            this.arrData = JSON.parse(this.$route.query.arrData);
        }
        
    },
    methods: {
        legendar(){
            this.legend = !this.legend;
        },
        raiar(){
            $refs.myMap.raiar();
        },
        getCasos(ev){
            this.clearContr(); 
            var radio = ev.target;
            var sem = radio.value;
            if(radio.checked){
                var exists = this.previous.some(function(field) {
                    return field === sem
                });

                if (!exists) {
                    this.previous.push(sem);
                    //this.fields.push(this.field);
                    var filtro = JSON.parse(localStorage.getItem('filter'));
                    filtro.semana = sem;
                    var filt = JSON.stringify(filtro);

                    CasosService.getCasos(filt)
                        .then((res) => {
                            this.arrData = res.data;
                            this.features = this.generateFeatures();
                        })
                        .catch((err) => {
                            console.log(err.response);
                            this.arrData = [];
                        })
                } else {
                    this.revis = sem;
                }
            } else {
                this.removes = sem;
            }
            
        },
        clearContr(){
            this.removes = '';
            this.revis = '';
        },
        generateFeatures() {
            var feats = [];

            this.arrData.map(el => {
                var feat = {
                    // if the next line is commented out you get: Unsupported GeoJSON type: undefined
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [el.latitude, el.longitude],
                    },
                    properties: {
                        nome: el.nome,
                        status: el.id_resultado,
                        semana: el.semana,
                        sinan: el.id_sinan,
                        agravo: el.id_agravo,
                    }
                }
                feats.push(feat);
            });
            return feats
        },
        generateClusterFeatures() {
            var feats = [];

            this.arrData.map(el => {
                var feat = new Feature( new Point([el.latitude, el.longitude]))
                feats.push(feat);
            });
            return feats
        }
    }
}
</script>

<style>
.ctrlBar{
    border:#8c8b8b double;
}
.actionBar{
    padding: 1rem;
}
.actionBar .button{
    margin: .2rem;
}
.btCont{
    padding-right: 1rem;
}
.fieldset {
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .02);
  color: #4a4a4a;
  display: block;
  padding: 1.25rem;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
  max-height: 80%;
}

.fieldset>legend {
  color: #363636;
  display: block;
  font-size: 1rem;
  font-weight: 700;
  background-color: #fff;
  padding: 0 5px;
  width: max-content;
  border: 0 none
}
</style>