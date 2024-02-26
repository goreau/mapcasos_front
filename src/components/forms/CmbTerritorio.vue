<template>
  <div class="control">
    <div class="select">
      <select @change="onChange($event)" class="input" ref="ddl" :class="errclass">
        <option value="0">-- Selecione --</option>
        <option
          v-for="loc in territorios"
          :key="loc.id"
          :value="loc.id"
          :selected="loc.id == sel"
        >
          {{ loc.nome }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import TerritorioService from "@/services/territorio.service.js";

export default {
  name: "CmbTerritorio",
  data() {
    return {
      territorios: [],
    };
  },
  props: ['id_prop', 'sel', 'errclass','tipo'],
  methods: {
    onChange(event) {
      this.$emit('selTerr',event.target.value);
      this.getNomemun(event.target.value);
    },
    getNomemun(val){
      var arr = this.territorios.filter(reg => reg.id == val);
      if (arr.length>0){
        var text = arr[0].nome;
        this.$emit('selText', text);
      }
    },
    loadData() {
     // var user = JSON.stringify(this.id_prop);
     if (this.id_prop == undefined || this.tipo == undefined){
      return false;
     }
      TerritorioService.getCombo(this.tipo, this.id_prop)
      .then((res) => {
        this.territorios = res.data;
      })
      .catch((err) => {
        console.log(err.response);
        this.territorios = [];
      })
    }
  },
  watch: {
    tipo(value) {
      this.loadData();
    },
    id_prop(value){
      this.loadData();
    },
    sel(value){
      this.getNomemun(value);
    }
  },
  mounted() {
  
  },
};
</script>

<style scoped>
  
</style>
