import axios from "@/services/api.js";

class CasosService {
  getCasos(filter) {
    return axios.get(`/casos/${filter}`)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getCaso(sinan) {
    return axios.get(`/caso/${sinan}`)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getNaoCodificados(user) {
    return axios.get(`/naocodificados/${user}`)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getRelat(id, filter) {
    filter = JSON.parse(filter);
    return axios.post(`/relat/${id}`,filter)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  } 

  update(data) {
    return axios.put("/caso", data)
    .then(response => {
      return response;
    },
    (error) => {
      return error.response.data;
    })
  }

  getSemanas(filter) {
    return axios.get(`/semanas/${filter}`)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getAgravos(){
    return axios.get(`/agravos`)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getResultado(){
    return axios.get(`/resultados`)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

}

export default new CasosService();