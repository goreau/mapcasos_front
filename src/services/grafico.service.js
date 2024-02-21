import axios from "@/services/api.js";

class GraficoService {
  getDiagrama(data) {
    return axios.post("/graficodiagrama", data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getHisto(data) {
    return axios.post("/graficohisto", data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getAnos(filter) {
    return axios.post("/graficoanos", filter)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }
}

export default new GraficoService();