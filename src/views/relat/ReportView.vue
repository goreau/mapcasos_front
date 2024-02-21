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
            <MyTable :tableData="dataTable" :columns="columns" :filtered="true" v-if="tipo > 0"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/general/Loader.vue";
import MyTable from "@/components/mapas/MyTable.vue";

export default {
  name: "Relatórios",
  data() {
    return {
      tipo: 0,
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
      switch (this.tipo) {
        case '1':
          this.title = 'Listagem de Casos';
          this.columns = [
                        { title: "Agravo", field: "agravo", type: "string" },
                        { title: "Município", field: "municipio", type: "string" },
                        { title: "SINAN", field: "sinan", type: "string" },
                        { title: "Nome", field: "nome", type: "string" },
                        { title: "Endereço", field: "endereco", type: "string" },
                        { title: "Semana", field: "semana", type: "string" },
                        { title: "Observação", field: "observacao", type: "string" },
                        { title: "Resultado", field: "resultado", type: "string", formatter:function(cell, formatterParams){
                            var value = cell.getValue();
                              if(value == 'Conf'){
                                  return "<span style='color:#ff0000; font-weight:bold;'>" + value + "</span>";
                              } else if(value == 'Desc'){
                                  return "<span style='color:#009900; font-weight:bold;'>" + value + "</span>";
                              } else {
                                return "<span style='color:ff9933; font-weight:bold;'>" + value + "</span>";
                              }
                          }
                        }, 
                        { title: "Coordenadas", field: "coordenadas", type: "string" },
                      ];
          break;
        case '2':
          this.title = 'Casos por semana';
          var keyNames = Object.keys(this.dataTable[0]);
          var mycolumns = [
                        { title: "Município", field: "municipio", type: "string" },                       
                      ];
          keyNames.map(col =>{
            if (col !== 'municipio'){
              var obj = { title: col, field: col, type: "number" };
              mycolumns.push(obj);
            };
          })
          this.columns = mycolumns;
          break;
        default:
          break;
      }
    }
  },
  mounted() {
    this.isLoading = true;
  
    this.tipo = this.$route.query.tipo;
    var data = JSON.parse(this.$route.query.arrData);
    this.dataTable = data.data;
    this.filter = data.filter;
    
    this.createColumns();
    this.isLoading = false;
  },
  created() {
    
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
