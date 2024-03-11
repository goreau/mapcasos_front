import axios from "@/services/api.js";

class SinanService {
  sendFile(form) {
    return axios.post('/upload',form)
    .then(response => {
      return {quant: response.data.regs};
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getNaoRecebidos(user){
    return axios.get(`/naorecebidos/${user}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }

  removerNR(sinan){
    return axios.delete(`/removenr/${sinan}`)
    .then(response => {
        return {data: response.data};
    })
    .catch(error => {
      throw new Error(error.data.msg);
    })
  }

  insertUnico(sinan){
    return axios.post(`/insertunico/${sinan}`)
    .then(response => {
        return {data: response.data};
    })
    .catch(error => {
      throw new Error(error.data.msg);
    })
  }
}

export default new SinanService();