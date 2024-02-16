import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
//import store from './store'
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/styles.css";
import '../node_modules/bulma/css/bulma.css'
import { library } from '@fortawesome/fontawesome-svg-core'
//import '../node_modules/tabulator-tables/dist/css/tabulator_bulma.min.css'


/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faTrash, faEdit, faCheck, faUser, faUsers, faHouse,  faSearch, faLocationDot, faChartSimple, faDrawPolygon} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faTrash, faEdit, faCheck, faUser, faUsers, faHouse, faSearch, faLocationDot, faChartSimple, faDrawPolygon);


createApp(App)
 //   .use(store)
    .use(OpenLayersMap /* options */)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
.mount('#app');
