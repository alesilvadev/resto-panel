import utils from "../../utils/utils";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios'

class Exchange {
  async getExchange() {
    let exchange = 1;
    //BROU
    const res = await axios({
      method: "get",
      url: "https://cotizaciones-brou.herokuapp.com/api/currency/latest",
      headers: {
        Accept: "application/json",
      },
    }).catch(() => {
      return "error";
    });
    // if (res != null || res != undefined) { 
    //   exchange = res.data["rates"]["USD"]["sell"];
    // }
    return exchange;
  }
}

const exchange = new Exchange();

export default exchange;
