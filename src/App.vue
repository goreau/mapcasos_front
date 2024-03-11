<template>
  <Header />
  <div class="cont_total">
    <div class="cont_menu">
      <sidebar-menu
        :menu="menu"
        :relative="true"
        @update:collapsed="onToggleCollapse"
        :showOneChild="true"
      />
    </div>
    <div class="main" id="main">      
      <router-view />
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/general/Header.vue";
import Footer from "@/components/general/Footer.vue";
import { SidebarMenu } from "vue-sidebar-menu";

import "vue-sidebar-menu/dist/vue-sidebar-menu.css";

export default {
  components: {
    Header,
    SidebarMenu,
    Footer,
    
  },
  methods: {
    onToggleCollapse(collapsed) {
      var dv = document.getElementById("main");
      if (collapsed) {
        dv.className = "main_colapsed";
      } else {
        dv.className = "main";
      }
    },
  },
  mounted() {
    if (this.hide) {
      this.onToggleCollapse(true);
    }
  },
  computed: {
    showMenu() {
      this.hide = this.$route.path === "/"  || this.$route.path === "/login";
      return !this.hide;
    },
  },
  data() {
    return {
      hide: false,
      menu: [
        {
          hiddenOnCollapse: true,
        },
        {
          href: "/",
          title: "Home",
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "fa-solid fa-house",
              size: "lg",
              transform: "shrink-8",
            },
          },
          child: [
            {
              href: "/convencoes",
              title: "Convenções",
            },
            {
              href: "/preferences",
              title: "Configurações",
            },
            {
              href: "/",
              title: "Sair",
            },
          ],
        },
        {
          href: "",
          title: "Casos",
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "fa-solid fa-users",
              size: "lg",
              transform: "shrink-8",
            },
          },
          child: [
            {
              href: "/casos/1",
              title: "Por Semana",
            },
            {
              href: "/casos/2",
              title: "Cluster",
            },
            {
              href: "/editcaso/0",
              title: "Editar",
            },
            {
              href: "/filtrorelat",
              title: "Relatórios",
            },
          ],
        },
        {
          href: "",
          title: "Gráficos",
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "fa-solid fa-chart-simple",
              size: "lg",
              transform: "shrink-8",
            },
          },
          child: [
            {
              href: "/diagrama",
              title: "Diagrama de Controle",
            },
            {
              href: "/histograma",
              title: "Histograma",
            },
          ],
        },
        {
          href: "",
          title: "Sinan",
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "fa-solid fa-chart-simple",
              size: "lg",
              transform: "shrink-8",
            },
          },
          child: [
            {
              href: "/importa",
              title: "Importar arquivo",
            },
            {
              href: "/naorecebidos",
              title: "Casos Não Recebidos",
            },
            {
              href: "/naocodificados",
              title: "Casos Não Geocodificados",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss">
@import "@/components/general/css/custom-var";
@import "vue-sidebar-menu/src/scss/vue-sidebar-menu.scss";

* {
  font-family: Helvetica;
  font-size: medium;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.main-container {
  margin: 5rem;
  min-height: 40rem;
}

html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
}
#app {
  height: 100%;
}
.main {
  margin-left: 290px;
  width: calc(100% - 290px);
  height: calc(100% - 7rem);
  margin-top: 4rem;
}
.main_colapsed {
  margin-left: 65px;
  width: calc(100% - 65px);
  height: calc(100% - 7rem);
  //   border:1px solid green;
}
.cont_total {
  width: 100%;
  height: calc(100%);

  ///  border:1px solid red;
}
.cont_menu {
  position: fixed;
  height: calc(100% - 7rem);
  width: 290px;
  overflow: auto;
  top: 4rem;
  bottom: 1rem;
}

.card {
  border: 0.5px solid #ccc;
  padding-top: 1rem;
}

.card-header p {
  color: rgb(23, 24, 102);
  font-size: larger;
}

.select {
  width: 100%;
}

.is-error {
  font-size: smaller;
  color: red;
  padding-left: 1rem;
}
.vsm--child {
  padding-left: 2rem;
  color:bisque;
}
</style>
