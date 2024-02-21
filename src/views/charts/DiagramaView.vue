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
                                <div class="column is-6">
                                    <fieldset class="fieldset">
                                        <legend>Filtros</legend>
                                        <div class="columns">
                                            <div class="column">
                                                <label class="label">Município</label>
                                                <div class="control">
                                                    <CmbTerritorio :id_prop="1" :sel="filter.id_municipio" :tipo="9"
                                                        @selTerr="filter.id_municipio = $event" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <label class="label">Ano Inicial</label>
                                                <div class="control">
                                                    <input class="input" type="year" v-model="filter.anoini">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <label class="label">Ano Final</label>
                                                <div class="control">
                                                    <input class="input" type="year" v-model="filter.anofim">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <div class="control">
                                                    <button class="button is-link submit-btn is-fullwidth" id="login"
                                                        @click="getAnos">
                                                        <span class="btico"><font-awesome-icon
                                                                icon="fa-solid fa-check" /></span>
                                                        Processar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <div class="column is-6" v-if="hasAnos">
                                    <fieldset class="fieldset">
                                        <legend>Anos</legend>
                                        <div class="columns">
                                            <div class="column is-6">
                                                <div class="columns" v-for="res in anos" :key="res.ano" style="padding-left: 3rem;">
                                                    <label for="" class="checkbox">
                                                        <input type="checkbox" v-model="filter.anos" :true-value="[]"
                                                            :value="res.ano" checked>
                                                        {{ res.ano }} - Incidência: {{ res.s_tt }}
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="column is-6">   
                                                <div class="control">
                                                    <button class="button is-link submit-btn is-fullwidth" id="login" @click="getData">
                                                        <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
                                                        Gerar Diagrama
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
                                            <div class="column has-text-centered"><h4 class="title">{{ title }}</h4></div>
                                            <div class="column has-text-centered"><h5 class="subtitle">{{ subtitle }}</h5></div>
                                            <GChart :settings="{ packages: ['corechart', 'line'] }" type="LineChart"
                                                :data="chartData" :options="chartOptions" />
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
    components: {
        GChart,
        CmbTerritorio
    },
    data() {
        return {
            filter: {
                id_municipio: 0,
                anoini: '',
                anofim: '',
                anos: []
            },
            hasData: false,
            hasAnos: false,
            title: '',
            subtitle: '',
            anos: [],
            // Array will be automatically processed with visualization.arrayToDataTable function
            chartData: [],
            chartOptions: {
                hAxis: {
                    title: 'SE de início dos sintomas'
                },
                vAxis: {
                    title: 'Casos/100 mil habitantes'
                },
                colors: ['#0B811D', '#F5C105', '#F31206','#0A0EE2'],
                series:{ 3: {lineDashStyle: [14, 2, 2, 7] }},
                crosshair: {
                        color: '#000',
                        trigger: 'selection'
                },
                width: '100%',
                height: 700,

            }
        }
    },
    methods: {
        getAnos() {
            var filt = this.filter;
            GraficoService.getAnos(filt)
                .then((res) => {
                    this.anos = res.data;
                    this.hasAnos = true;
                    this.anos.forEach(ano => {
                        this.filter.anos.push(ano.ano);
                    })
                })
                .catch((err) => {
                    console.log(err.response);
                    this.chartData = [];
                });
        },
        getData() {
            var filt = this.filter;
            GraficoService.getDiagrama(filt)
                .then((res) => {
                    var ret = res.data;
                    this.chartData = ret.data;
                    this.subtitle = ret.subt;
                    this.title = 'Histograma de Casos de Dengue - ' + ret.title;
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
.grafCont {
    min-height: 50rem;
}
.title{
    color: #504f4f;
}
.subtitle{
    color: dimgrey;
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