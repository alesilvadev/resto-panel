import { store } from "react-notifications-component";

class Utils {
  formatDateTime(date) {
    if (date != null) {
      let changeDate = new Date(date);
      date = new Intl.DateTimeFormat("en-UY", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(changeDate);
    }
    return date;
  }

  formatCurrency(value) {
    const formatter = new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      minimumFractionDigits: 2,
    });
    if (value !== null && value !== undefined && value !== "" && !isNaN(value)) {
      return formatter.format(value);
    }
    if (isNaN(value)) {
      return formatter.format(0);
    }
    return value;
  }

  formatNumber(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  sendNotification(title, message, type) {
    store.addNotification({
      title: title,
      message: message,
      type: type,
      insert: "bottom",
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 2000,
        onScreen: true,
        click: true,
        touch: true,
        showIcon: true,
      },
    });
  }

  orderItems(day) {
    let muzza = 0;
    let faina = 0;
    let pizza = 0;
    let muzzaGusto = 0;
    let pizzetaConMuzza = 0;
    let pizzeta = 0;
    let pizzetaConGusto = 0;
    let pizzetaPremium = 0;
    let refresco600 = 0;
    let agua = 0;
    let smallBeers = 0;
    let bigBeers = 0;
    let frenchfries = 0;
    let burguer = 0;
    let chivito = 0;
    let milanesa = 0;

    //products details
    faina += this.checkItem("FAINA", day);
    faina += this.checkItem("FAINA_C_MUZZARELLA", day);
    pizza += this.checkItem("PIZZA", day);
    muzza += this.checkItem("MUZZARELLA", day);
    muzzaGusto += this.checkItem("MUZZARELLA_1_G", day);
    muzzaGusto += this.checkItem("MUZZARELLA_2_G", day);

    //pizzetas
    pizzetaConMuzza += this.checkItem("PIZZETA_CON_MUZZA", day);
    pizzetaConMuzza += this.checkItem("PIZZETA_C_MUZZARELLA", day);
    pizzetaConGusto += this.checkItem("PIZZETA_C_GUSTO", day);
    pizzetaConGusto += this.checkItem("HAWAIANA", day);
    pizzetaConGusto += this.checkItem("CRIOLLA", day);
    pizzetaConGusto += this.checkItem("CLASICA", day);
    pizzetaConGusto += this.checkItem("CAPRESSE", day);
    pizzetaConGusto += this.checkItem("A_CABALLO", day);
    pizzetaConGusto += this.checkItem("Personalizada", day);
    pizzetaPremium += this.checkItem("PIZZETA_PREMIUN", day);
    pizzetaPremium += this.checkItem("CANADIENSE", day);
    pizzetaPremium += this.checkItem("VEGETARIANA", day);
    pizzetaPremium += this.checkItem("HORNO_DE_JUAN", day);
    pizzetaPremium += this.checkItem("ESPAÃ‘OLA", day);

    //beverages
    refresco600 += this.checkItem("REFRESCOS_600_ML", day);
    refresco600 += this.checkItem("REFRESCO_500cc", day);
    agua += this.checkItem("AGUA_600ML", day);
    agua += this.checkItem("AGUA", day);

    //beers
    smallBeers += this.checkItem("CERVEZA_330cc", day);
    smallBeers += this.checkItem("CERVEZA_3_4_Ltro", day);
    smallBeers += this.checkItem("CORONA_330ML", day);
    smallBeers += this.checkItem("ZILLERTAL_330ML", day);
    smallBeers += this.checkItem("PATRICIA_330ML", day);
    smallBeers += this.checkItem("PILSEN_330_ML", day);
    smallBeers += this.checkItem("CERVEZA_PREMIUN_330cc", day);
    smallBeers += this.checkItem("STELLA_ARTOIS_330ML", day);

    //bigBeers
    bigBeers += this.checkItem("CERVEZA_PREMIUN_1_Ltro", day);
    bigBeers += this.checkItem("CERVEZA_1_Ltro", day);
    bigBeers += this.checkItem("ZILLERTAL_1L", day);
    bigBeers += this.checkItem("PATRICIA_1L", day);
    bigBeers += this.checkItem("STELLA_ARTOIS_1L", day);

    //fastfood
    frenchfries += this.checkItem("PAPAS_FRITAS", day);
    frenchfries += this.checkItem("PAPAS_FRITAS_C__Q_Y_P", day);
    frenchfries += this.checkItem("CHEDDAR", day);

    burguer += this.checkItem("HAMBURGUESA_COMPLETA_C_FRITAS", day);
    burguer += this.checkItem("HAMBURGUESA_C_FRITAS", day);
    burguer += this.checkItem("HAMBURGUESA_HORNO_DE_JUAN", day);

    chivito += this.checkItem("CHIVITO_HORNO_DE_JUAN", day);
    chivito += this.checkItem("CHIVITO_CANADIENSE_C_FRITAS", day);
    chivito += this.checkItem("CHIVITO_COMUN_C_FRITAS", day);

    milanesa += this.checkItem("MILANESA_EN_2_PANES_COMPLETA_C_FRIT", day);
    milanesa += this.checkItem("MILANESA_C_FRITAS", day);
    milanesa += this.checkItem("MILANESA_NAPOLITANA", day);
    milanesa += this.checkItem("MILANESA_CHEDDAR_C_FRITAS", day);
    milanesa += this.checkItem("MILANESA_EN_2_PANES_COMUN", day);

    let items = {
      faina: faina,
      pizza: pizza,
      muzzarella: muzza,
      muzzarellaConGusto: muzzaGusto,
      pizzetaConMuzza: pizzetaConMuzza,
      pizzetaConGusto: pizzetaConGusto,
      pizzetaPremium: pizzetaPremium,
      refresco600: smallBeers,
      agua: agua,
      cervezaChica: smallBeers,
      cervezaGrandes: bigBeers,
      papasFritas: frenchfries,
      burguer: burguer, 
      chivito: chivito,
      milanesa: milanesa,
    };
    return items;
  }

  convertMapInList(map) {
    let data = [];
    for (let keyItems in map) {
      let position = -1;

      if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          const element = data[index];

          if (map[keyItems] < element["value"]) {
            position = index;
            break;
          }
          if (index == data.length - 1) {
            position = index;
          }
        }
      }
      const item = { key: keyItems, value: map[keyItems] };
      if (position < 0) {
        data.splice(0, 0, item);
      } else {
        data.splice(position, 0, item);
      }
    }
    return data.reverse();
  }

  checkItem(item, day) {
    let amount = 0;
    if (day[item] != null && day[item] != "" && day[item] != undefined) {
      amount += parseInt(day[item]);
    }
    return amount;
  }

  formatVarToShow(text) {
    text = text.replace(/\b(\w)/g, s => s.toUpperCase());
    let auxText = [];
    auxText = text.match(/[A-Z][a-z]+|[0-9]+/g);
    if (auxText != null && auxText.length > 1) {
      text = auxText.join(" ");
    }
    return text;
  }
}

const utils = new Utils();

export default utils;
