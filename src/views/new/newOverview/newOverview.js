import React from "react";
import { Row, Col, Spinner, Container } from "reactstrap";
import firebase from "../../../modules/firebase/firebase";
import "./newOverview.scss";
import { useState, useEffect } from "react";
import { CartesianGrid, XAxis, YAxis, BarChart, Tooltip, Bar } from "recharts";
import { AiFillFire, AiOutlineArrowDown, AiFillCar, AiFillBank, AiFillFileText, AiFillGold, AiFillHome, AiFillStar, AiFillTag, AiFillInfoCircle } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import exchange from "../../../../src/modules/exchange/exchange";
import Slider from "react-slick";

const NewOverview = (props) => {
  const [stats, setStats] = useState({});
  const [load, setLoad] = useState(false);
  const [currency, setCurrency] = useState("UYU");
  const [currencyValue, setCurrencyValue] = useState(1);
  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    autoplaySpeed: 5000,

    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  useEffect(() => {
    async function getCatalogos() {
      processStats();
      //getExchange()
    }
    getCatalogos();
  }, []);

  const getExchange = async () => {
    const currencyResult = await exchange.getExchange();
    setCurrencyValue(currencyResult);
  };

  const processStats = async () => {
    let branchesSells = {};
    let branchesAmount = 0;
    let totalSold = 0;
    let totalTicket = 0;
    let totalDelivery = 0;
    let faina = 0;
    let muzza = 0;
    let muzzaGusto = 0;
    let pizza = 0;
    let pizzetaConMuzza = 0;
    let pizzetaConGusto = 0;
    let pizzetaPremium = 0;
    let refresco600 = 0;
    let smallBeers = 0;
    let bigBeers = 0;
    let agua = 0;
    let frenchfries = 0;
    let burguer = 0;
    let chivito = 0;
    let milanesa = 0;

    const data = await firebase.getBranchesFinances();
    branchesAmount = data.length;

    for (let key in data) {
      const branch = data[key]["finances"];
      const name = data[key]["id"];

      for (let keyBranch in branch) {
        const year = branch[keyBranch];

        for (let keyYear in year) {
          const month = year[keyYear];

          for (let keyMonth in month) {
            const day = month[keyMonth];
            totalSold += parseInt(day["z"]);

            if (branchesSells[name] == null || branchesSells[name] == undefined) {
              branchesSells[name] = 0;
            }
            branchesSells[name] += parseInt(day["z"]);

            totalTicket += parseInt(day["ticket"]);
            //delivery
            if (day["delivery"] != "" && day["delivery"] != undefined && day["delivery"] != null) {
              totalDelivery += parseInt(day["delivery"]);
              branchesSells[name] += parseInt(day["delivery"]);
            }

            //products details
            faina += checkItem("FAINA", day);
            faina += checkItem("FAINA_C_MUZZARELLA", day);
            pizza += checkItem("PIZZA", day);
            muzza += checkItem("MUZZARELLA", day);
            muzzaGusto += checkItem("MUZZARELLA_1_G", day);
            muzzaGusto += checkItem("MUZZARELLA_2_G", day);

            //pizzetas
            pizzetaConMuzza += checkItem("PIZZETA_CON_MUZZA", day);
            pizzetaConMuzza += checkItem("PIZZETA_C_MUZZARELLA", day);
            pizzetaConGusto += checkItem("PIZZETA_C_GUSTO", day);
            pizzetaConGusto += checkItem("HAWAIANA", day);
            pizzetaConGusto += checkItem("CRIOLLA", day);
            pizzetaConGusto += checkItem("CLASICA", day);
            pizzetaConGusto += checkItem("CAPRESSE", day);
            pizzetaConGusto += checkItem("A_CABALLO", day);
            pizzetaConGusto += checkItem("Personalizada", day);
            pizzetaPremium += checkItem("PIZZETA_PREMIUN", day);
            pizzetaPremium += checkItem("CANADIENSE", day);
            pizzetaPremium += checkItem("VEGETARIANA", day);
            pizzetaPremium += checkItem("HORNO_DE_JUAN", day);
            pizzetaPremium += checkItem("ESPAÃ‘OLA", day);

            //beverages
            refresco600 += checkItem("REFRESCOS_600_ML", day);
            refresco600 += checkItem("REFRESCO_500cc", day);
            agua += checkItem("AGUA_600ML", day);
            agua += checkItem("AGUA", day);

            //beers
            smallBeers += checkItem("CERVEZA_330cc", day);
            smallBeers += checkItem("CERVEZA_3_4_Ltro", day);
            smallBeers += checkItem("CORONA_330ML", day);
            smallBeers += checkItem("ZILLERTAL_330ML", day);
            smallBeers += checkItem("PATRICIA_330ML", day);
            smallBeers += checkItem("PILSEN_330_ML", day);
            smallBeers += checkItem("CERVEZA_PREMIUN_330cc", day);
            smallBeers += checkItem("STELLA_ARTOIS_330ML", day);

            //bigBeers
            bigBeers += checkItem("CERVEZA_PREMIUN_1_Ltro", day);
            bigBeers += checkItem("CERVEZA_1_Ltro", day);
            bigBeers += checkItem("ZILLERTAL_1L", day);
            bigBeers += checkItem("PATRICIA_1L", day);
            bigBeers += checkItem("STELLA_ARTOIS_1L", day);

            //fastfood
            frenchfries += checkItem("PAPAS_FRITAS", day);
            frenchfries += checkItem("PAPAS_FRITAS_C__Q_Y_P", day);
            frenchfries += checkItem("CHEDDAR", day);

            burguer += checkItem("HAMBURGUESA_COMPLETA_C_FRITAS", day);
            burguer += checkItem("HAMBURGUESA_C_FRITAS", day);
            burguer += checkItem("HAMBURGUESA_HORNO_DE_JUAN", day);

            chivito += checkItem("CHIVITO_HORNO_DE_JUAN", day);
            chivito += checkItem("CHIVITO_CANADIENSE_C_FRITAS", day);
            chivito += checkItem("CHIVITO_COMUN_C_FRITAS", day);

            milanesa += checkItem("MILANESA_EN_2_PANES_COMPLETA_C_FRIT", day);
            milanesa += checkItem("MILANESA_C_FRITAS", day);
            milanesa += checkItem("MILANESA_NAPOLITANA", day);
            milanesa += checkItem("MILANESA_CHEDDAR_C_FRITAS", day);
            milanesa += checkItem("MILANESA_EN_2_PANES_COMUN", day);
          }
        }
      }
    }
    const bestBranch = calculateBranchSales(branchesSells);
    setStats({
      branchesAmount: branchesAmount,
      faina: faina.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      pizza: pizza.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      muzza: muzza.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      muzzaGusto: muzzaGusto.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      pizzetaConMuzza: pizzetaConMuzza.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      pizzetaConGusto: pizzetaConGusto.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      pizzetaPremium: pizzetaPremium.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      refresco600: refresco600.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      smallBeers: smallBeers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      bigBeers: bigBeers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      agua: agua.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      frenchfries: frenchfries.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      burguer: burguer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      chivito: chivito.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      milanesa: milanesa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      bestBranch: bestBranch,

      totalSold: (totalSold + totalDelivery).toLocaleString("es-UY", {
        style: "currency",
        currency: "UYU",
      }),
      totalTicket: totalTicket.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      ticketAverage: (totalSold / totalTicket).toLocaleString("es-UY", {
        style: "currency",
        currency: "UYU",
      }),
      totalDelivery: totalDelivery.toLocaleString("es-UY", {
        style: "currency",
        currency: "UYU",
      }),
      totalLocal: totalSold.toLocaleString("es-UY", {
        style: "currency",
        currency: "UYU",
      }),
    });
    setLoad(true);
  };

  const checkItem = (item, day) => {
    let amount = 0;
    if (day[item] != null && day[item] != "" && day[item] != undefined) {
      amount += parseInt(day[item]);
    }
    return amount;
  };

  const calculateBranchSales = (branches) => {
    let auxMax = 0;
    let nameMax = "";
    let auxMin = Number.POSITIVE_INFINITY;
    let nameMin = "";
    for (let keyBranch in branches) {
      const sells = branches[keyBranch];
      if (sells > auxMax) {
        auxMax = branches[keyBranch];
        nameMax = keyBranch;
      }
      if (sells < auxMin) {
        auxMin = branches[keyBranch];
        nameMin = keyBranch;
      }
    }
    return {
      sellsMax: auxMax.toLocaleString("es-UY", {
        style: "currency",
        currency: "UYU",
      }),
      nameMax: nameMax.toUpperCase(),
      sellsMin: auxMin.toLocaleString("es-UY", {
        style: "currency",
        currency: "UYU",
      }),
      nameMin: nameMin.toUpperCase(),
    };
  };

  return (
    <>
      <div className="header-home">
        <>
          <h4>El Horno de Juan</h4>
          <h2>Resumen General</h2>
        </>
      </div>
      <Container>
        <Slider {...settings} className="list-info">
          <div className="container-box">
            <div className="info-button">
              <AiFillInfoCircle />
              <h4>Cambiar el orden de tus secciones puede mejorar tus ventas</h4>
            </div>
          </div>
          <div className="container-box">
            <div className="info-button">
              <AiFillInfoCircle />
              <h4>Recuerda agregar fotos a los productos para aumentar las ventas de un producto</h4>
            </div>
          </div>
        </Slider>
      </Container>
      <Container-fluid id="overview">
        <Row>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillBank /> Sucursales
                </h5>
                <h1>{stats.branchesAmount}</h1>
                <label className="panel-box-left-label text-center">Total de Sucursales hasta la Fecha</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillGold /> Ventas
                </h5>
                <h1>{currency == "UYU" ? stats.totalSold : stats.totalSoldUsd}</h1>
                <label className="panel-box-left-label text-center">Total Vendido</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillHome /> Ventas en Local
                </h5>
                <h1>{stats.totalLocal}</h1>
                <label className="panel-box-left-label text-center">Total de ventas en local</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillCar /> Ventas por delivery
                </h5>
                <h1>{stats.totalDelivery}</h1>
                <label className="panel-box-left-label text-center">Ventas por Delivery</label>
              </Col>
            )}
          </Col>

          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillFileText /> Ticket Emitidos
                </h5>
                <h1>{stats.totalTicket}</h1>
                <label className="panel-box-left-label text-center">Total de tickets emitidos</label>
              </Col>
            )}
          </Col>

          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillFileText /> Costo Ticket Promedio
                </h5>
                <h1>{stats.ticketAverage}</h1>
                <label className="panel-box-left-label text-center">Costo de Ticket Promedio </label>
              </Col>
            )}
          </Col>

          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillFire /> Sucursal Mayor Ventas
                </h5>
                <h1>{stats.bestBranch.nameMax}</h1>
                <label className="panel-box-left-label text-center">cantidad de ventas {stats.bestBranch.sellsMax}</label>
              </Col>
            )}
          </Col>

          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiOutlineArrowDown /> Sucursal Menor Ventas
                </h5>
                <h1>{stats.bestBranch.nameMin}</h1>
                <label className="panel-box-left-label text-center">cantidad de ventas {stats.bestBranch.sellsMin}</label>
              </Col>
            )}
          </Col>
        </Row>
        <Row>
          <h5 className="title-dashboard">Productos Principales</h5>
        </Row>
        <Row>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillStar /> Faina
                </h5>
                <h1>{stats.faina}</h1>
                <label className="panel-box-left-label text-center">Cantidad de fainás vendidos</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillStar /> Pizza
                </h5>
                <h1>{stats.pizza}</h1>
                <label className="panel-box-left-label text-center">Cantidad de pizza vendidos</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillStar /> Muzzarella
                </h5>
                <h1>{stats.muzza}</h1>
                <label className="panel-box-left-label text-center">Cantidad de muzzarella vendidos</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillStar /> Muzzarella con Gusto
                </h5>
                <h1>{stats.muzzaGusto}</h1>
                <label className="panel-box-left-label text-center">Cantidad de muzzarella con Gusto</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillStar /> Pizzeta con Muzzarella
                </h5>
                <h1>{stats.pizzetaConMuzza}</h1>
                <label className="panel-box-left-label text-center">Cantidad de pizzetas con muzzarella</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillStar /> Pizzeta con Gusto
                </h5>
                <h1>{stats.pizzetaConGusto}</h1>
                <label className="panel-box-left-label text-center">Cantidad de pizzetas con gusto</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillStar /> Pizzeta Premium
                </h5>
                <h1>{stats.pizzetaPremium}</h1>
                <label className="panel-box-left-label text-center">Cantidad de pizzetas Premium</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillStar /> Refrescos 600ml
                </h5>
                <h1>{stats.refresco600}</h1>
                <label className="panel-box-left-label text-center">Cantidad de refrescos de 600ml</label>
              </Col>
            )}
          </Col>
        </Row>
        <Row>
          <h5 className="title-dashboard">Productos Secundarios</h5>
        </Row>
        <Row>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillTag /> Agua
                </h5>
                <h1>{stats.agua}</h1>
                <label className="panel-box-left-label text-center">Cantidad de agua vendidas</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillTag /> Cerveza 330ml
                </h5>
                <h1>{stats.smallBeers}</h1>
                <label className="panel-box-left-label text-center">Cantidad de cerveza de 300 vendida</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillTag /> Cerveza 1L
                </h5>
                <h1>{stats.bigBeers}</h1>
                <label className="panel-box-left-label text-center">Cantidad de cerveza de 1L vendidas</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillTag /> Papas Fritas
                </h5>
                <h1>{stats.frenchfries}</h1>
                <label className="panel-box-left-label text-center">Cantidad de papas fritas vendidas</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillTag />
                  Chivitos
                </h5>
                <h1>{stats.chivito}</h1>
                <label className="panel-box-left-label text-center">Cantidad de chivitos vendidas</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillTag />
                  Hamburguesas
                </h5>
                <h1>{stats.burguer}</h1>
                <label className="panel-box-left-label text-center">Cantidad de Hamburguesas vendidas</label>
              </Col>
            )}
          </Col>
          <Col className="col-12 col-lg-3 panel-box-left">
            {load == false && <Skeleton height={170} className="skeleton-list" />}
            {load == true && (
              <Col className="col-12 panel-box">
                <h5>
                  <AiFillTag />
                  Milanesa
                </h5>
                <h1>{stats.milanesa}</h1>
                <label className="panel-box-left-label text-center">Cantidad de Milanesa vendidas</label>
              </Col>
            )}
          </Col>
        </Row>
      </Container-fluid>
    </>
  );
};

export default NewOverview;
