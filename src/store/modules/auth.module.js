const user = JSON.parse(localStorage.getItem('usermap'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, userstr) {
      let user = JSON.parse(userstr);
          if(user && user.id){
            commit('loginSuccess', user);
            return Promise.resolve(user);
          } else {
            commit('loginFailure');
            return Promise.reject();
          }

    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
  },
  getters: {
    loggedUser(state) {
      return state.user;
    },
    isLogged(state) {
      return state.status.loggedIn;
    }
  }
};