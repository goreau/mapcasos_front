import { createStore } from 'vuex'
import { auth } from './modules/auth.module'


export default createStore({
  modules: {
    auth,
  },
  state: {
    back_api: process.env.VUE_APP_BACK_API //'http://localhost:4001/'
  }
})
