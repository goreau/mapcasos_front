import axios from "axios";
import router from '../router'

const api = axios.create({
 baseURL: process.env.VUE_APP_BACK_API,
});

api.interceptors.request.use(
  config => {
    console.log(process.env.VUE_APP_BACK_API);
    let user =  process.env.VUE_APP_KEY_API;
    if (user ) {
      config.headers.Authorization = `${user}`;
    } 

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 400:
          break;
        case 401:
          router.replace({
            path: "/home",
            query: { redirect: router.currentRoute.fullPath }
          });
          break;
        case 403:
          router.replace({
            path: "/home",
            query: { redirect: router.currentRoute.fullPath }
          });
           break;
        case 404:
          alert('page not exist');
          break;
        case 502:
         setTimeout(() => {
          router.replace({
              path: "/home",
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }, 1000);
      }
      return Promise.reject(error.response);
      
    }
  }
);

export default api;