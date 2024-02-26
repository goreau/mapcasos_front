<template>
    <div class="main-container">
        <div class="columns is-centered">
            <div class="column is-three-fifths">
                <Loader v-if="isLoading" />
                <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title is-centered">Editar Caso</p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <fieldset class="fieldset">
                            <legend>Número do SINAN</legend>
                                <div class="columns is-centered">
                                    <div class="column is-4">
                                        <div class="field has-addons">
                                            <input
                                                type="text"
                                                class="input"
                                                v-model="caso.id_sinan"
                                                placeholder="Identificação do caso"
                                            />
                                            <div class="control">
                                                <a class="button is-info" @click="doBuscarCaso">
                                                    <span class="icon is-small">
                                                    <font-awesome-icon icon="fa-solid fa-search" />
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset class="fieldset">
                            <legend>Dados do Caso</legend>
                                <div class="columns">
                                    <div class="column is-10 is-offset-1">
                                        <div class="field">
                                            <label class="label">Nome</label>
                                            <input type="text" class="input" placeholder="Nome do paciente"
                                                v-model="caso.nome" />
                                        </div>
                                    </div>
                                </div>
                                <div class="columns">
                                    <div class="column is-10 is-offset-1">
                                        <div class="field">
                                            <label class="label">Endereço</label>
                                            <input type="text" class="input" placeholder="Logradouro e Nº do imóvel"
                                                v-model="caso.endereco" />
                                        </div>
                                    </div>
                                </div>
                                <div class="columns">
                                    <div class="column is-5 is-offset-1">
                                        <div class="field">
                                            <label class="label">Bairro</label>
                                            <input type="text" class="input" placeholder="Nome do Bairro"
                                                v-model="caso.bairro" />
                                        </div>
                                    </div>
                                    <div class="column is-5">
                                        <div class="field">
                                            <label class="label">Município</label>
                                            <CmbTerritorio :id_prop="user" :sel="caso.id_municipio" :tipo="9" @selText="nomemun = $event"
                                                @selTerr="caso.id_municipio = $event"  />
                                        </div>
                                    </div>
                                </div>
                                <hr>
                                <div class="columns">
                                    <div class="column is-5 is-offset-1">
                                        <div class="field">
                                            <label class="label">Latitude</label>
                                            <input type="text" class="input" placeholder="Nome do Bairro"
                                                v-model="caso.longitude" />
                                        </div>
                                    </div>
                                    <div class="column is-5">
                                        <div class="field">
                                            <label class="label">Longitude</label>
                                            <input type="text" class="input" placeholder="Nome do Bairro"
                                                v-model="caso.latitude" />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            
                        </div>
                    </div>
                    <footer class="card-footer">
                        <div class="column is-full">
                            <div class="columns is-centered">
                                <div class="column is-4">
                                    <div class="control">
                                        <button class="button is-link submit-btn is-fullwidth" id="salvar" @click="doEdit">
                                        <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="column is-4">
                                    <div class="control" v-if="hasAddress">
                                        <button class="button is-link submit-btn is-fullwidth" id="mapear" @click="doMaps">
                                        <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
                                            Abrir no Google Maps
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Message from "@/components/general/Message.vue";
import Loader from "@/components/general/Loader.vue";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import CasosService from "@/services/casos.service.js";

export default {
    components: {
        Message,
        Loader,
        CmbTerritorio,
    },
    data(){
        return{
            caso: {
                id_sinan: '',
                nome:'',
                endereco: '',
                bairro: '',
                id_municipio: 0,
                latitude:'',
                longitude: ''
            },
            nomemun: '',
            user: '',
            isLoading: false,
            message: "",
            caption: "",
            type: "",
            showMessage: false,
        }
    },
    methods: {
        doMaps(){
            var url = 'https://www.google.com/maps/search/?api=1&hl=pt-br&query='; 
           
            if (this.caso.longitude != 0){
                var point = encodeURIComponent(this.caso.longitude + ', ' + this.caso.latitude);
                url += point;
            } else {
                var address = encodeURIComponent(this.caso.endereco + ', ' + this.nomemun);
                url+= address;
            }

            window.open(url,'_blank');
        },
        doEdit(){
            document.getElementById('salvar').classList.add('is-loading');

                CasosService.update(this.caso).then(
                    (response) => {
                        this.showMessage = true;
                        this.message = "Caso alterado com sucesso!!";
                        this.type = "success";
                        this.caption = "Caso";
                        setTimeout(() => (this.showMessage = false), 3000);
                    },
                    (error) => {
                        this.message = error;
                        this.showMessage = true;
                        this.type = "alert";
                        this.caption = "Caso";
                        setTimeout(() => (this.showMessage = false), 3000);
                    }
                    )
                    .finally(() => {
                        document.getElementById('salvar').classList.remove('is-loading');
                    });
        },
        doBuscarCaso(){
            CasosService.getCaso(this.caso.id_sinan)
                .then((res) => {
                    var res = res.data;
                    this.caso.nome = res.nome;
                    this.caso.endereco = res.endereco;
                    this.caso.bairro = res.bairro;
                    this.caso.id_municipio = res.id_municipio;
                    this.caso.latitude = res.latitude;
                    this.caso.longitude = res.longitude;
                })
                .catch((err) => {
                    console.log(err.response);
                    this.casos = [];
                });
        }
    },
    computed: {
        currentUser() {
            return this.$store.getters["auth/loggedUser"];
        },
        hasAddress(){
            return (this.caso.endereco != '' && this.caso.id_municipio > 0);
        }
    },
    mounted() {
        let cUser = this.currentUser;
    
        if (cUser) {
            if (cUser.nivel == 9){
                this.showMessage = true;
                this.message = "Você não tem permissão para alterar dados!";
                this.type = "alert";
                this.caption = "SINAN";
                setTimeout(() => {
                    this.showMessage = false;
                    this.$router.back();
                }, 3000);
            } else {
                this.user = JSON.stringify(cUser);
            }
            
        }

        var qsin = this.$route.params.sinan;

        if(qsin != 0){
            this.caso.id_sinan = qsin;
            this.doBuscarCaso();
        }
    },
}
</script>

<style scoped>
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