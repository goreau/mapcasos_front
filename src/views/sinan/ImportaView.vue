<template>
    <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Importar arquivo</p>
          </header>
          <div class="card-content">
            <div class="content">
              <section class="section">
                <div class="file has-name is-fullwidth">
                <label class="file-label">
                    <input class="file-input" type="file" name="resume" id="resume" accept="application/dbf" @change="fileSelected">
                    <span class="file-cta">
                    <span class="file-icon">
                        <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">
                        Escolha o arquivo…
                    </span>
                    </span>
                    <span class="file-name" id="filename">
                        Nenhum arquivo selecionado....
                    </span>
                </label>
                </div>
                <div id="error" style="display: none">O tipo do arquivo não é permitido (esperado .dbf)!</div>
              </section>
            </div>
          </div>
          <footer class="card-footer">
                
                    <div class="column is-4 is-offset-4">
                        <button v-if="file != ''" @click="sendFile" id="btProcessa" class="button is-danger is-fullwidth is-light is-outlined">Processar o arquivo!</button>
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
import SinanService from '@/services/sinan.service';

export default {
    data() {
        return {
            file: '',
            isLoading: false,
            message: "",
            caption: "",
            type: "",
            showMessage: false,
        };
    },
    components: {
        Message,
        Loader,
    },
    methods: {
        fileSelected(){
            document.getElementById('error').style.display = 'none';

            var oFile = document.getElementById('resume').files[0];

         //   var rFilter = /^(application\/dbf)$/i;
            var name = oFile.name.split('.').pop();

       //     if (! rFilter.test(oFile.type)) {
            if (name.localeCompare('dbf') !== 0){

                document.getElementById('error').style.display = 'block';

                return;

            }

            document.getElementById('filename').innerHTML = oFile.name;

            this.file = oFile;
        },
        sendFile(){
            document.getElementById('btProcessa').classList.add('is-loading');
            let dataForm = new FormData();

            dataForm.append('fileSinan', this.file);

            SinanService.sendFile(dataForm)
            .then((res) => {
                this.showMessage = true;
                this.message = "Arquivo enviado!! Foram recebidos " + res.quant + " registros.";
                this.type = "success";
                this.caption = "SINAN";
                setTimeout(() => (this.showMessage = false), 3000);
            })
            .catch((err) => {
                console.log(err.response);
                this.casos = [];
            })
            .finally(()=> document.getElementById('btProcessa').classList.remove('is-loading'));
        }
    },
    computed: {
        currentUser() {
            return this.$store.getters["auth/loggedUser"];
        },
    },
    mounted() {
        let cUser = this.currentUser;
    
        if (cUser) {
            if (cUser.nivel > 1){
                this.showMessage = true;
                this.message = "Você não tem permissão para importar arquivos!";
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
    }
}
</script>

<style>
#error{
    color: red;
    font-weight: bold;
    padding: 2rem;
}

</style>