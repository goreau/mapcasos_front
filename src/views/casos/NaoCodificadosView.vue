<template>
    <div class="main-container">
        <div class="columns is-centered">
            <div class="column">
                <Loader v-if="isLoading" />
                <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title is-centered">Casos Não Geocodificados</p>
                    </header>
                    <div class="card-content">
                        <MyTable :tableData="dataTable" :columns="columns" :filtered="true" />
                    </div>
                </div>
                <div style="display: none;">
                    <span class="icon is-small is-left" name="coisa">
                        <font-awesome-icon icon="fa-solid fa-edit" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Message from "@/components/general/Message.vue";
import Loader from "@/components/general/Loader.vue";
import MyTable from "@/components/mapas/MyTable.vue";
import CasosService from '@/services/casos.service';

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
        editSinan(nm_sinan){
            this.$router.push({
            name: 'editcaso',
            params: {
              sinan: nm_sinan
            },
          })
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
            
        CasosService.getNaoCodificados(this.user)
            .then((res) => {
                this.dataTable = res.data;
            })
            .catch((err) => {
                console.log(err.response);
                this.tableData = [];
            })
            .finally(() => this.isLoading = false);

        this.columns = [
            { title: "Agravo", field: "agravo", type: "string" },
            { title: "Município", field: "municipio", type: "string" },
            { title: "SINAN", field: "id_sinan", type: "string" },
            { title: "Nome", field: "nome", type: "string" },
            { title: "Endereço", field: "endereco", type: "string" },
            { title: "Munic Res", field: "id_mn_resi", type: "string" },
            { title: "Sintomas", field: "dt_sintomas", type: "string" },
            { title: "Recebido", field: "dt_recebe", type: "string" },
            { title: "Semana", field: "sem_pri", type: "string" },
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
                        this.editSinan(row.id_sinan);
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