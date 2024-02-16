<template>
    <div class="main-container">
        <div class="columns is-centered">
            <div class="column is-three-fifths">
                <Loader v-if="isLoading" />
                <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title is-centered">Relatórios</p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <section class="section">
                                <div class="dvTipo">
                                    <div class="tile is-ancestor">
                                        <div class="tile is-horizontal">
                                            <div class="tile is-parent">
                                                <div class="tile is-child box">
                                                    <fieldset class="fieldset">
                                                        <legend>Tipo de Relatório</legend>
                                                        <div class="columns ">
                                                            <div class="column is-4 is-offset-2">
                                                                <div class="field"><input type="radio" name="tipo"
                                                                v-model="tipo" :value="1">Listagem de Casos</div>
                                                                
                                                            </div>
                                                            <div class="column is-4">
                                                                <div class="field"><input type="radio" name="tipo"
                                                                v-model="tipo" :value="2">Casos por Semana</div>
                                                                
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section class="section">
                                <div class="dvTipo">
                                    <div class="tile is-ancestor">
                                        <div class="tile is-horizontal">
                                            <div class="tile is-parent">
                                                <div class="tile is-child box">
                                                    <fieldset class="fieldset">
                                                        <legend>Agravo</legend>
                                                        <div class="column">
                                                            <div class="columns" v-for="agr in lstAgravo" :key="agr.id">
                                                                <label for="" class="radio">
                                                                    <input type="radio" name="agravo"
                                                                        v-model="filter.agravo" :value="agr.id">
                                                                    {{ agr.nome }}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <div class="tile is-parent">
                                                <div class="tile is-child box">
                                                    <fieldset class="fieldset">
                                                        <legend>Resultado</legend>
                                                        <div class="column">
                                                            <div class="columns" v-for="res in lstResult" :key="res.id">
                                                                <label for="" class="checkbox">
                                                                    <input type="checkbox" v-model="filter.status"
                                                                        :true-value="[]" :value="res.id">
                                                                    {{ res.nome }}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tile is-ancestor">
                                        <div class="tile is-horizontal">
                                            <div class="tile is-parent">
                                                <div class="tile is-child box">
                                                    <fieldset class="fieldset">
                                                        <legend>Local</legend>
                                                        <div class="column is-full">
                                                            <div class="field">
                                                                <label class="label">Município</label>
                                                                <div class="control">
                                                                    <CmbTerritorio :id_prop="1" :sel="filter.id_municipio"
                                                                        :tipo="9" @selTerr="filter.id_municipio = $event" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <div class="tile is-parent">
                                                <div class="tile is-child box">
                                                    <fieldset class="fieldset">
                                                        <legend>Período</legend>
                                                        <div class="columns">
                                                            <div class="column">
                                                                <label class="label">Início</label>
                                                                <div class="field">
                                                                    <div class="control">
                                                                        <input type="date" id="dtIni" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="columns">
                                                            <div class="column">
                                                                <label class="label">Término</label>
                                                                <div class="field">
                                                                    <div class="control">
                                                                        <input type="date" id="dtFim" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section class="section">
                                <div class="columns is-centered">
                                    <div class="column is-4">
                                        <div class="control">
                                            <button class="button is-link submit-btn is-fullwidth" id="login"
                                                @click="doProcessar">
                                                <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
                                                Processar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <footerCard @submit="create" @cancel="null" @aux="details" :cFooter="cFooter" />
                    </footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CasosService from "@/services/casos.service.js";
import Message from "@/components/general/Message.vue";
import Loader from "@/components/general/Loader.vue";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import moment from 'moment';
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';
import "bulma-calendar/dist/css/bulma-calendar.min.css";

import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $route = useRoute();
const $router = useRouter();

export default {
    data() {
        return {
            tipo: 0,
            filter: {
                status: 0,
                agravo: 1,
                id_municipio: 0,
                dt_inicio: "",
                dt_final: "",
            },
            dataTable: [],
            lstAgravo: [],
            lstResult: [],
            ini_date: '',
            fim_date: '',
            isLoading: false,
            message: "",
            caption: "",
            type: "",
            showMessage: false,
        };
    },
    computed: {

    },
    components: {
        Message,
        Loader,
        CmbTerritorio,
    },
    methods: {
        doProcessar() {
            CasosService.getRelat(this.tipo, JSON.stringify(this.filter))
                .then((res) => {
                    this.dataTable = res.data;
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log(err.response);
                    this.casos = [];
                })
        },
        getAgravoList() {
            CasosService.getAgravos()
                .then((res) => {
                    this.lstAgravo = res.data;
                })
                .catch((err) => {
                    console.log(err.response);
                    this.lstAgravo = [];
                })
        },
        getResultList() {
            CasosService.getResultado()
                .then((res) => {
                    this.lstResult = res.data;
                })
                .catch((err) => {
                    console.log(err.response);
                    this.lstResult = [];
                })
        }
    },
    mounted() {
        var obj = localStorage.getItem('filter');
        if (obj) {
            this.filter = JSON.parse(obj);

            this.ini_date = this.filter.dt_inicio == '' ? null : moment(String(this.filter.dt_inicio)).format('DD/MM/YYYY');
            this.fim_date = this.filter.dt_final == '' ? null : moment(String(this.filter.dt_final)).format('DD/MM/YYYY');
        }

        const element = document.querySelector('#dtIni');

        if (element.type == 'text') {
            return true;
        }

        var options = {
            type: "date",
            dateFormat: "dd/MM/yyyy",
            startDate: this.ini_date,
            showHeader: false,
            color: "primary"
        };

        var calini = bulmaCalendar.attach('#dtIni', options);

        if (element) {
            // bulmaCalendar instance is available as element.bulmaCalendar
            element.bulmaCalendar.on('select', datepicker => {
                this.filter.dt_inicio = moment(datepicker.data.startDate).format('YYYY-MM-DD');
            });
        }

        options = {
            type: "date",
            dateFormat: "dd/MM/yyyy",
            startDate: this.fim_date,
            showHeader: false,
            color: "primary"
        };

        var calfim = bulmaCalendar.attach('#dtFim', options);

        const element2 = document.querySelector('#dtFim');


        if (element2) {
            // bulmaCalendar instance is available as element.bulmaCalendar
            element2.bulmaCalendar.on('select', datepicker => {
                this.filter.dt_final = moment(datepicker.data.startDate).format('YYYY-MM-DD');
            });
        }
    },
    created() {
        this.getAgravoList();
        this.getResultList();
    },
    watch: {

    },
};
</script>

<style scoped>
.submit-btn {
    background-color: #4f52a3;
    color: #e6e2db;
    font-weight: bold;
    border: 2px solid #13156e;
    padding: 1rem;
    font-size: 1rem;
    margin: 0 auto;
    cursor: pointer;
    transition: 0.5s;
}

.submit-btn:hover {
    background-color: transparent;
    color: #13156e;
    border: 2px solid #4f52a3;
}

.btico {
    padding-right: 2rem;
    margin-left: -2rem;
}

section {
    padding: .5rem;
}

.radio {
    margin-left: 1rem !important;
    width: 100%;
}

.flatpickr-input {
    width: auto;
}

.flatpickr-input[readonly] {
    width: auto;
}

.dvTipo {
    border: 1px solid #aaa;
    border-radius: 4px;
    position: relative;
    padding: 1.25rem 2.5rem 1.25rem 1.5rem;
    width: 100%;
}

label.radio {
    margin-left: 1rem;
    margin-top: .5rem;
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
}</style>
