import axios from "@/services/api.js";

class TerritorioService {
  create(data) {
    return axios.post("/territorio", data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getTerritorio(id) {
    return axios.get(`/territorio/${id}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error;
    })
  } 

  update(data) {
    return axios.put("/territorio", data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  delete(id) {
    return axios.delete(`/territorio/${id}`)
    .then(response => {
      return response;
    },
    (error) => {
      return error.response.data;
    })
  }  

  getTerritorios(filter){
    return axios.get(`/territorios/${filter}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }

  getCombo(tipo, id_prop){
    return axios.get(`/territorios/${tipo}/${id_prop}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }

  getComboMov(tipo, id_prop){
    return axios.get(`/movcombo/${tipo}/${id_prop}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }
  
}

export default new TerritorioService();