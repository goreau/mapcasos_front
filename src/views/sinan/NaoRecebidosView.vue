<template>
    <div class="main-container">
        <div class="columns is-centered">
            <div class="column">
                <Loader v-if="isLoading" />
                <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title is-centered">Casos Não Recebidos</p>
                    </header>
                    <div class="card-content">
                        <MyTable :tableData="dataTable" :columns="columns" :filtered="true" />
                    </div>
                </div>
                <div style="display: none;">
                    <span class="icon is-small is-left" name="coisa">
                        <font-awesome-icon icon="fa-solid fa-info" />
                    </span>
                </div>
            </div>
        </div>
        <div class="modal" id="modalSinan">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Detalhes</p>
                    <button class="delete" aria-label="close" @click="closeModal"></button>
                </header>
                <section class="modal-card-body" id="detail">
                
                </section>
                <footer class="modal-card-foot">
                    <div id="nm_sinan"  style="display: none;"></div>
                    <div class="column is-full">
                        <div class="columns is-centered">
                            <div class="column is-4">
                                <button class="button is-danger" @click="removeSinan">
                                    <span class="btico"><font-awesome-icon icon="fa-solid fa-trash" /></span>
                                    Excluir Registro
                                </button>
                            </div>
                            <div class="column is-4">
                                <button class="button is-warning" @click="retrySinan">
                                    <span class="btico"><font-awesome-icon icon="fa-solid fa-repeat" /></span>
                                    Tentar Novamente
                                </button>
                            </div>
                        </div>    
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import Message from "@/components/general/Message.vue";
import Loader from "@/components/general/Loader.vue";
import MyTable from "@/components/mapas/MyTable.vue";
import SinanService from '@/services/sinan.service';

export default {
    components: {
        Message,
        Loader,
        MyTable,
    },
    data() {
        return {
            dataTable: [],
            columns: [],
            myspan: null,
            hasDetail: false,
            user: '',
            isLoading: false,
            message: "",
            caption: "",
            type: "",
            showMessage: false,
        }
    },
    methods: {
        removeSinan(){
            this.closeModal();

            var nm_sinan = document.getElementById("nm_sinan").innerHTML;

            SinanService.removerNR(nm_sinan)
            .then((res) => {
                this.loadData();
            })
            .catch((err) => {
                this.showMessage = true;
                this.message = err.message;
                this.type = "alert";
                this.caption = "SINAN";
                setTimeout(() => {
                    this.showMessage = false;
                }, 3000);
            })
            .finally(() => this.isLoading = false);
        },
        loadData(){
            this.isLoading = true;
            
            SinanService.getNaoRecebidos(this.user)
                .then((res) => {
                    this.dataTable = res.data;
                })
                .catch((err) => {
                    console.log(err.response);
                    this.tableData = [];
                })
                .finally(() => this.isLoading = false);
        },
        retrySinan(){
            this.closeModal();
            var nm_sinan = document.getElementById("nm_sinan").innerHTML;
            this.isLoading = true;
            
            SinanService.insertUnico(nm_sinan)
                .then((res) => {
                    this.showMessage = true;
                    this.message = 'Caso recebido';
                    this.type = "success";
                    this.caption = "SINAN";
                    setTimeout(() => {
                        this.showMessage = false;
                        this.loadData();
                    }, 3000);
                })
                .catch((err) => {
                    this.showMessage = true;
                    this.message = err.message;
                    this.type = "alert";
                    this.caption = "SINAN";
                    setTimeout(() => {
                        this.showMessage = false;
                    }, 3000);
                    })
                    .finally(() => this.isLoading = false);

        },
        closeModal(){
            var modal = document.getElementById("modalSinan");
            modal.classList.remove('is-active');
        },
        showDetails(row) {
            this.hasDetail = true;
            let cloned = { ... row }
            var output = '';
            for (var property in cloned) {
                output += property + ': ' + cloned[property]+'<br>';
            }

            document.getElementById("nm_sinan").innerHTML = cloned.nu_notific;

            document.getElementById("detail").innerHTML = output;
            var modal = document.getElementById("modalSinan");
            modal.classList.add('is-active');

        },       
    },
    mounted() {
        let cUser = this.currentUser;
        this.myspan = document.getElementsByName('coisa')[0];

        if (cUser) {
            if (cUser.nivel == 9) {
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

        this.isLoading = true;
            
        SinanService.getNaoRecebidos(this.user)
            .then((res) => {
                this.dataTable = res.data;
            })
            .catch((err) => {
                console.log(err.response);
                this.tableData = [];
            })
            .finally(() => this.isLoading = false);

        this.columns = [
            { title: "Agravo", field: "id_agravo", type: "string" },
            { title: "Município", field: "municipio", type: "string" },
            { title: "SINAN", field: "nu_notific", type: "string" },
            { title: "Nome", field: "nm_pacient", type: "string" },
            { title: "Logradouro", field: "nm_logrado", type: "string" },
            { title: "Munic Res", field: "id_mn_resi", type: "string" },
            { title: "Data Not", field: "dt_notific", type: "string" },
            { title: "Semana", field: "sem_pri", type: "string" },
            { title: "Observação", field: "motivo", type: "string" },
            {title: 'Ações',  
                formatter: (cell, formatterParams) =>{
                    const row = cell.getRow().getData();
                
                    const btEdit = document.createElement('button');
                    btEdit.type = 'button';
                    btEdit.title = 'Detalhes';
                    btEdit.style.cssText = 'height: fit-content; margin-left: 1rem;';
                    btEdit.classList.add('button', 'is-primary', 'is-outlined');
                    btEdit.innerHTML = this.myspan.innerHTML;
                    btEdit.addEventListener('click', () => {
                        this.showDetails(row);
                    });

                    const buttonHolder = document.createElement('span');
                    buttonHolder.appendChild(btEdit);

                    return buttonHolder;
            }}
        ]
    },
    computed: {
        currentUser() {
            return this.$store.getters["auth/loggedUser"];
        },
    },

}
</script>

<style></style>