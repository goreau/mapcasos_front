<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader v-if="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">{{ title }}</p>
          </header>
          <div class="card-content">
            <span class="filter">{{ strFiltro }}</span>
            <MyTable :tableData="dataTable" :columns="columns" :is-filtered="false" :has-exports="true" v-if="id > 0"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/general/Loader.vue";
import MyTable from "@/components/forms/MyTable.vue";
import reportService from "@/services/report.service";

export default {
  name: "Relatórios",
  data() {
    return {
      id: 0,
      filter: {},
      dataTable: [],
      isLoading: false,
      columns: [],
      title: 'Relatórios',
      strFiltro: '',
    };
  },
  components: {
    Loader,
    MyTable,
  },
  methods: {
    createColumns(){
      switch (this.id) {
        case '1':
          this.title = 'Resumo de Atividades';
          this.columns = [
                        { title: "Município", field: "municipio", type: "string" },
                        { title: "Programa", field: "programa", type: "string" },
                        { title: "Atividade", field: "atividade", type: "string" },
                        { title: "Módulo", field: "modulo", type: "string" },
                        { title: "Quantidade", field: "quantidade", type: "string" },
                        { title: "Dias", field: "dias", type: "string" },
                        { title: "Profissionais", field: "profissionais", type: "string" },
                        { title: "Participantes", field: "participantes", type: "string" },
                      ];
          break;
        case '2':
          this.title = 'Resumo de Instituições';
          this.columns = [
                        { title: "Município", field: "municipio", type: "string" },
                        { title: "Programa", field: "programa", type: "string" },
                        { title: "Módulo", field: "modulo", type: "string" },
                        { title: "Instituição", field: "instituicao", type: "string" },
                        { title: "Tipo", field: "tipo", type: "string" },                        
                      ];
          break;
        case '3':
          this.title = 'Resumo de Treinamentos';
          this.columns = [
                        { title: "Município", field: "municipio", type: "string" },
                        { title: "Programa", field: "programa", type: "string" },
                        { title: "Módulo", field: "modulo", type: "string" },
                        { title: "Dias", field: "dias", type: "string" },
                        { title: "Profissionais", field: "profissionais", type: "string" },
                        { title: "Participantes", field: "participantes", type: "string" },                     
          ];
          break;
        case '4':
          this.title = 'Resumo de Projetos';
          this.columns = [
                        { title: "Município", field: "municipio", type: "string" },
                        { title: "Projeto", field: "nome", type: "string" },
                        { title: "Programa", field: "programa", type: "string" },
                        { title: "Responsável", field: "responsavel", type: "string" },
                        { title: "Data Criação", field: "data", type: "string" },
                     
          ];
          break;
        case '5':
          this.title = 'Atividades por Projeto';
          this.columns = [
                        { title: "Município", field: "municipio", type: "string" },
                        { title: "Projeto", field: "nome", type: "string" },
                        { title: "Fase", field: "fase", type: "string" },
                        { title: "Atividade", field: "atividade", type: "string" },
                        { title: "Módulo", field: "modulo", type: "string" },
                     
          ];
          break;
        default:
          break;
      }
    }
  },
  mounted() {
    this.isLoading = true;
  
    reportService.getRelat(this.id,this.filter)
      .then((response) => {
        var data = response.data;
        this.dataTable = data.data;
        this.strFiltro = data.filter;
        this.isLoading = false;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => (this.isLoading = false));
    
    this.createColumns();
    this.isLoading = false;
  },
  created() {
    this.id = this.$route.params.id;
    this.filter = localStorage.getItem('filter');
  },
};
</script>

<style scoped>
.visible {
  display: none !important;
}
.filter{
  font-size: small;
  font-weight: 600;
}
</style>
