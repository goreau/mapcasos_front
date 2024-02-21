<template>
    <div class="main-container">
        <div class="columns is-centered">
            <div class="column is-full">
                <Loader v-if="isLoading" />
                <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title is-centered">Histograma</p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <div class="columns">
                                <div class="column">
                                    <fieldset class="fieldset">
                                        <legend>Filtros</legend>
                                        <div class="columns">
                                            <div class="column is-4">
                                                <label class="label">Município</label>
                                                <div class="control">
                                                    <CmbTerritorio :id_prop="1" :sel="filter.id_municipio" :tipo="9"
                                                        @selTerr="filter.id_municipio = $event" />
                                                </div>
                                            </div>
                                            <div class="column is-4">
                                                <label class="label">Ano</label>
                                                <div class="control">
                                                    <input class="input" type="year" v-model="filter.ano">
                                                </div>
                                            </div>
                                            <div class="column is-1">
                                                <label>&nbsp;</label>
                                                <div class="control">
                                                    <label for="" class="checkbox">
                                                        <input type="checkbox" v-model="filter.faixas">
                                                        Faixas
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="column is-3">
                                                <label>&nbsp;</label>
                                                <div class="control">
                                                    <button class="button is-link submit-btn is-fullwidth" id="login" @click="getData">
                                                        <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
                                                        Processar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <div class="columns" v-if="hasData">
                                <div class="column">
                                    <fieldset class="fieldset">
                                        <legend>Dados</legend>
                                            <div class="grafCont">
                                                <GChart
                                                    :settings="{ packages: ['corechart', 'bar'] }"
                                                    type="ColumnChart"
                                                    :data="chartData"
                                                    :options="chartOptions"
                                                />
                                            </div>      
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { GChart } from 'vue-google-charts';
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import GraficoService from "@/services/grafico.service";

export default {
    components:{
        GChart,
        CmbTerritorio
    },
    data () {
        return {
            filter: {
                id_municipio: 0,
                ano:2019,
                faixas: false
            },
            hasData: false,
            // Array will be automatically processed with visualization.arrayToDataTable function
            chartData: [],
            chartOptions: {
                title: 'Histograma de Casos de Dengue',
                subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                hAxis: {
                    title: 'SE de início dos sintomas'
                },
                vAxis: {
                    title: 'CI acumulada'
                },
                bar: { groupWidth: '95%'},
                width: '100%',
                height: 700,
                
            }
        }
    },
    methods:{
        getData(){
            var filt = this.filter;
            GraficoService.getHisto(filt)
                .then((res) => {
                    var ret = res.data;
                    this.chartData = ret.data;
                    this.chartOptions.subtitle = ret.title;
                    this.hasData = true;
                })
                .catch((err) => {
                    console.log(err.response);
                    this.chartData = [];
                });
        }
    }
}
</script>

<style scoped>
.grafCont{
    min-height: 50rem;
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
  height: 100%;
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