import axios from "@/services/api.js";

class SinanService {
  sendFile(form) {
    return axios.post('/upload',form)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }
}

export default new SinanService();