<template>
  <div class="main-container">
        <div class="columns is-centered">
            <div class="column is-three-fifths">
                <Loader v-if="isLoading" />
                <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title is-centered">Preferências</p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <fieldset class="fieldset">
                            <legend>Raio</legend>
                                <div class="columns">
                                    <div class="column is-4 is-offset-2">
                                      <label class="label">Diâmetro</label>
                                      <input
                                        id="sliderWithValue"
                                        class="slider is-large is-circle has-output"
                                        step="50"
                                        min="100"
                                        max="800"
                                        v-model="prefs.raioD"
                                        type="range"
                                        @change="showValue($event)"
                                      />
                                      <p>Metros: <span id="demo"></span></p>
                                    </div>
                                    <div class="column is-4">
                                      <label class="label">Cor</label>
                                        <input type="color" v-model="prefs.raioC">
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset class="fieldset">
                            <legend>Polígono</legend>
                                <div class="columns is-centered">
                                    <div class="column is-4">
                                      <label class="label">Cor</label>
                                      <input type="color" v-model="prefs.poligC">
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
                                        <button class="button is-link submit-btn is-fullwidth" id="salvar" @click="doStore">
                                        <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
                                            Salvar
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
export default {
  data(){
    return{
      prefs: {
        raioD: 200,
        raioC: '#332245',
        poligC: '#7398C0'
      }
    }
  },
  methods:{
    showValue(ev){
      var output = document.getElementById("demo");
      output.innerHTML = ev.target.value;
    },
    doStore(){
      localStorage.setItem('prefs', JSON.stringify(this.prefs));
    }
  },
  mounted() {
    var obj = JSON.parse(localStorage.getItem('prefs'));
    if (obj){
      this.prefs = obj;
    } 
    var output = document.getElementById("demo");
    output.innerHTML = this.prefs.raioD;
  }
}
</script>

<style scoped>
.fieldset {
  background-color: #ffffff;
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