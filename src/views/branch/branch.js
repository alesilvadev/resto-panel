import React from "react";
import { Row, Col, ListGroup, ListGroupItem, Input } from "reactstrap";
import { useState, useEffect } from "react";
import firebase from "../../modules/firebase/firebase";
import { AiOutlineLink, AiOutlineEdit, AiOutlineLeft, AiFillEye, AiFillDelete, AiFillStar } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "./branch.scss";
import ReactPaginate from "react-paginate";
import utils from "../../utils/utils";

const Branch = (props) => {
  const [activeTab, setActiveTab] = useState("team");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState(null);
  const [label, setLabel] = useState("Últimos 7 días");

  useEffect(() => {
    getBranches();
  }, []);

  const getBranches = async () => {
    const data = await firebase.getBranchesList();
    const firstData = data[0];
    setBranches(data);
    setBranch(firstData);
    selectDataToView(firstData);
  };

  const processData = (data) => {
    let statsResult = {
      currentYear: {},
      currentMonth: {},
      lastSevenDays: {},
      years: {},
    };
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() + "";
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    for (let keyYear in data) {
      const year = data[keyYear];
      statsResult.years[year] = 0;
      for (let keyMonth in year) {
        const month = year[keyMonth];
        for (let keyDay in month) {
          const day = month[keyDay];
          statsResult.years[year] = statsResult.years[year] + parseInt(day["z"].replace(".00", ""));
        }
      }
    }
  };

  const processWeekAgo = (data) => {
    let stats = {
      totalSells: 0,
      totalDelivery: 0,
      totalDeliveryPast: 0,
      totalTitcket: 0,
      items: {},
      days: [],
    };

    let currentDate = new Date();
    //FIXME -35
    currentDate.setDate(currentDate.getDate() - 85);
    const pastYear = currentDate.getFullYear() - 1 + "";
    const currentYear = currentDate.getFullYear() + "";

    for (let index = 0; index < 7; index++) {
      currentDate.setDate(currentDate.getDate() - 1);

      let currentMonth = currentDate.getMonth() + 1;

      let currentDay = currentDate.getDate();

      try {
        let dataCurrentDay = data[currentYear][currentMonth][currentDay];
        let pastYearDay = data[pastYear][currentMonth][currentDay];

        const z = parseInt(dataCurrentDay["z"]);
        const zPast = parseInt(pastYearDay["z"]);
        const ticket = parseInt(dataCurrentDay["ticket"]);
        const ticketPast = parseInt(pastYearDay["ticket"]);
        let delivery = 0;
        let deliveryPast = 0;

        stats["totalSells"] = stats["totalSells"] + z;
        stats["totalSellsPast"] = stats["totalSells"] + zPast;
        stats["totalTitcket"] = stats["totalTitcket"] + ticket;
        stats["totalTitcketPast"] = stats["totalTitcket"] + ticketPast;

        if (dataCurrentDay["delivery"] != "" && dataCurrentDay["delivery"] != undefined && dataCurrentDay["delivery"] != null) {
          const deliveryAux = parseInt(dataCurrentDay["delivery"]);
          const deliveryAuxPast = parseInt(pastYearDay["delivery"]);
          stats["totalDelivery"] = stats["totalDelivery"] + deliveryAux;
          stats["totalDeliveryPast"] = stats["totalDeliveryPast"] + deliveryAuxPast;
          delivery = deliveryAux;
          deliveryPast = deliveryAuxPast;
        }
        stats["days"].push({
          totalSells: z,
          totalDelivery: delivery,
          totalTitcket: ticket,
          currentMonth: currentMonth,
          currentDay: currentDay,
          totalSellsPast: zPast,
          totalTitcketPast: ticketPast,
          totalDeliveryPast: deliveryPast,
        });
        const itemsOrdered = utils.orderItems(dataCurrentDay);
        for (let field in itemsOrdered) {
          if (field != "z" && field != "ticket" && field != "z" && field != "peya") {
            if (stats["items"][field] == null || stats["items"][field] == undefined) {
              stats["items"][field] = 0;
            }
            stats["items"][field] = stats["items"][field] + itemsOrdered[field];
          }
        }
        //analize items
      } catch {
        console.log("not exist: " + currentDay + "/" + currentMonth);
      }
    }
    stats = {
      ...stats,
      itemsOrdered: utils.convertMapInList(stats["items"]),
    };
    setStats(stats);
    setLoading(true);
  };

  const processcurrentMonth = (data) => {
    let stats = {
      totalSells: 0,
      totalDelivery: 0,
      totalDeliveryPast: 0,
      totalTitcket: 0,
      items: {},
      days: [],
    };

    let currentDate = new Date();
    //FIXME -35
    currentDate.setDate(currentDate.getDate() - 45);

    const currentYear = currentDate.getFullYear() + "";
    const currentMonth = currentDate.getMonth() + 1;

    for (let key in data[currentYear][currentMonth]) {
      const currentDay = key;
      const currentDayData = data[currentYear][currentMonth][key];

      const z = parseInt(currentDayData["z"]);
      const ticket = parseInt(currentDayData["ticket"]);

      let delivery = 0;
      stats["totalSells"] = stats["totalSells"] + z;
      stats["totalTitcket"] = stats["totalTitcket"] + ticket;

      if (currentDayData["delivery"] != "" && currentDayData["delivery"] != undefined && currentDayData["delivery"] != null) {
        const deliveryAux = parseInt(currentDayData["delivery"]);
        stats["totalDelivery"] = stats["totalDelivery"] + deliveryAux;
        delivery = deliveryAux;
      }

      if (z > 0) {
        stats["days"].push({
          totalSells: z,
          totalDelivery: delivery,
          totalTitcket: ticket,
          currentMonth: currentMonth,
          currentDay: currentDay,
        });
      }

      const itemsOrdered = utils.orderItems(currentDayData);
      for (let field in itemsOrdered) {
        if (field != "z" && field != "ticket" && field != "z" && field != "peya") {
          if (stats["items"][field] == null || stats["items"][field] == undefined) {
            stats["items"][field] = 0;
          }
          stats["items"][field] = stats["items"][field] + itemsOrdered[field];
        }
      }
    }
    stats = {
      ...stats,
      itemsOrdered: utils.convertMapInList(stats["items"]),
    };
    console.log(stats);
    setStats(stats);
    setLoading(true);
  };

  const processcurrentYear = (data) => {
    let stats = {
      totalSells: 0,
      totalDelivery: 0,
      totalDeliveryPast: 0,
      totalTitcket: 0,
      items: {},
      days: [],
    };

    let currentDate = new Date();
    //FIXME -35
    currentDate.setDate(currentDate.getDate() - 45);

    const currentYear = currentDate.getFullYear() + "";

    for (let month in data[currentYear]) {
      let zMonth = 0;
      let deliveryMonth = 0;
      let ticketMonth = 0;

      for (let key in data[currentYear][month]) {
        const currentDay = key;
        const currentDayData = data[currentYear][month][key];

        const z = parseInt(currentDayData["z"]);
        zMonth = zMonth + z;
        const ticket = parseInt(currentDayData["ticket"]);
        ticketMonth = ticketMonth + z;

        let delivery = 0;
        stats["totalSells"] = stats["totalSells"] + z;
        stats["totalTitcket"] = stats["totalTitcket"] + ticket;

        if (currentDayData["delivery"] != "" && currentDayData["delivery"] != undefined && currentDayData["delivery"] != null) {
          const deliveryAux = parseInt(currentDayData["delivery"]);
          stats["totalDelivery"] = stats["totalDelivery"] + deliveryAux;
          deliveryMonth = deliveryMonth + deliveryAux;
          delivery = deliveryAux;
        }

        const itemsOrdered = utils.orderItems(currentDayData);
        for (let field in itemsOrdered) {
          if (field != "z" && field != "ticket" && field != "z" && field != "peya") {
            if (stats["items"][field] == null || stats["items"][field] == undefined) {
              stats["items"][field] = 0;
            }
            stats["items"][field] = stats["items"][field] + itemsOrdered[field];
          }
        }
      }

      stats["days"].push({
        totalSells: zMonth,
        totalDelivery: deliveryMonth,
        totalTitcket: ticketMonth,
        currentMonth: month,
        currentDay: currentYear,
      });
    }
    stats = {
      ...stats,
      itemsOrdered: utils.convertMapInList(stats["items"]),
    };
    console.log(stats);
    setStats(stats);
    setLoading(true);
  };

  const processPastYears = (data) => {
    let stats = {
      totalSells: 0,
      totalDelivery: 0,
      totalDeliveryPast: 0,
      totalTitcket: 0,
      items: {},
      days: [],
    };

    let currentDate = new Date();
    //FIXME -35
    currentDate.setDate(currentDate.getDate() - 45);

    for (let year in data) {
      let zMonth = 0;
      let deliveryMonth = 0;
      let ticketMonth = 0;

      for (let month in data[year]) {
        for (let key in data[year][month]) {
          const currentDay = key;
          const currentDayData = data[year][month][key];

          const z = parseInt(currentDayData["z"]);
          zMonth = zMonth + z;
          const ticket = parseInt(currentDayData["ticket"]);
          ticketMonth = ticketMonth + z;

          let delivery = 0;
          stats["totalSells"] = stats["totalSells"] + z;
          stats["totalTitcket"] = stats["totalTitcket"] + ticket;

          if (currentDayData["delivery"] != "" && currentDayData["delivery"] != undefined && currentDayData["delivery"] != null) {
            const deliveryAux = parseInt(currentDayData["delivery"]);
            stats["totalDelivery"] = stats["totalDelivery"] + deliveryAux;
            deliveryMonth = deliveryMonth + deliveryAux;
            delivery = deliveryAux;
          }

          const itemsOrdered = utils.orderItems(currentDayData);
          for (let field in itemsOrdered) {
            if (field != "z" && field != "ticket" && field != "z" && field != "peya") {
              if (stats["items"][field] == null || stats["items"][field] == undefined) {
                stats["items"][field] = 0;
              }
              stats["items"][field] = stats["items"][field] + itemsOrdered[field];
            }
          }
        }
      }
      stats["days"].push({
        totalSells: zMonth,
        totalDelivery: deliveryMonth,
        totalTitcket: ticketMonth,
        currentMonth: "",
        currentDay: year,
      });
    }

    stats = {
      ...stats,
      itemsOrdered: utils.convertMapInList(stats["items"]),
    };
    console.log(stats);
    setStats(stats);
    setLoading(true);
  };

  const selectDataToView = async (branchSelected) => {
    let myBranch = branch;
    if(branchSelected != null){
      myBranch = branchSelected
    }
    setLoading(false);
    console.log("branch data" + myBranch)
    const finances = await firebase.getBranchFinances(myBranch);
    let filter = document.getElementById("selectFilter").value;
    console.log(filter);
    switch (filter) {
      case "lastWeek":
        setLabel("Últimos 7 días");
        processWeekAgo(finances);
        break;
      case "lastMonth":
        setLabel("Últimos mes");
        processcurrentMonth(finances);
        break;
      case "lastYear":
        setLabel("Últimos año");
        processcurrentYear(finances);
        break;
      case "years":
        setLabel("Anual");
        processPastYears(finances);
        break;

      default:
        break;
    }
  };

  const selectBranch = () => {
    let branchFilter = document.getElementById("selectBranch").value;
    setBranch(branchFilter);
    selectDataToView(branchFilter);
  };

  return (
    <>
      <div id="catalogo">
        <Container-fluid>
          <Row className="sub-menu">
            <Col className="col-12 col-lg-2">
              <h3 className="panel-box-title">Sucursales</h3>
              <p className="panel-box-description">Información de sucursales.</p>
            </Col>
          </Row>
          <Row>
            <Col className="col-12 col-lg-3 panel-box-left">
              <Col className="col-12 panel-box">
                <h5>Filtrar Estadisticas</h5>
                <label className="panel-box-left-label">Sucursal</label>
                <Input type="select" name="selectBranch" id="selectBranch" onChange={() => selectBranch()}>
                  {branches.map((value, index) => (
                    <option value={value}>{value}</option>
                  ))}
                </Input>
                <label className="panel-box-left-label">Filtrar por Fecha</label>
                <Input type="select" name="selectFilter" id="selectFilter" onChange={() => selectDataToView(null)}>
                  <option value="lastWeek">Últimos 7 días</option>
                  <option value="lastMonth">Último mes</option>
                  <option value="lastYear">Último año</option>
                  <option value="years">Anual</option>
                </Input>
              </Col>
            </Col>
            <Col className="col-12 col-lg-9">
              <h5 className="title-dashboard">Estadísticas Generales</h5>

              <Row>
                <Col className="col-12 col-lg-3 panel-box-left">
                  {loading == false && <Skeleton height={170} className="skeleton-list" />}
                  {loading == true && (
                    <Col className="col-12 panel-box">
                      <h5>Ventas Totales</h5>
                      <h1>{utils.formatCurrency(stats.totalSells + stats.totalDelivery)}</h1>
                      <label className="panel-box-left-label text-center">Total Vendido</label>
                    </Col>
                  )}
                </Col>
                <Col className="col-12 col-lg-3 panel-box-left">
                  {loading == false && <Skeleton height={170} className="skeleton-list" />}
                  {loading == true && (
                    <Col className="col-12 panel-box">
                      <h5>Ventas del Local</h5>
                      <h1>{utils.formatCurrency(stats.totalSells)}</h1>
                      <label className="panel-box-left-label text-center">Ventas a través del local</label>
                    </Col>
                  )}
                </Col>
                <Col className="col-12 col-lg-3 panel-box-left">
                  {loading == false && <Skeleton height={170} className="skeleton-list" />}
                  {loading == true && (
                    <Col className="col-12 panel-box">
                      <h5>Ventas del delivery</h5>
                      <h1>{utils.formatCurrency(stats.totalDelivery)}</h1>
                      <label className="panel-box-left-label text-center">Ventas a través del delivery</label>
                    </Col>
                  )}
                </Col>
                <Col className="col-12 col-lg-3 panel-box-left">
                  {loading == false && <Skeleton height={170} className="skeleton-list" />}
                  {loading == true && (
                    <Col className="col-12 panel-box">
                      <h5>Cantidad de tickets</h5>
                      <h1>{utils.formatNumber(stats.totalTitcket)}</h1>
                      <label className="panel-box-left-label text-center">Total de tickets emitidos</label>
                    </Col>
                  )}
                </Col>
                <Col className="col-12 col-lg-3 panel-box-left">
                  {loading == false && <Skeleton height={170} className="skeleton-list" />}
                  {loading == true && (
                    <Col className="col-12 panel-box">
                      <h5>Ticket Promedio</h5>
                      <h1>{utils.formatCurrency(stats.totalSells / stats.totalTitcket)}</h1>
                      <label className="panel-box-left-label text-center">Valor de ticket promedio</label>
                    </Col>
                  )}
                </Col>
                <Col className="col-12 col-lg-3 panel-box-left">
                  {loading == false && <Skeleton height={170} className="skeleton-list" />}
                  {stats != null && stats["itemsOrdered"] != null && stats["itemsOrdered"][0] != null && loading == true && (
                    <Col className="col-12 panel-box">
                      <h5>Producto más Vendido</h5>
                      <h1>{stats["itemsOrdered"][0]["key"]}</h1>
                      <label className="panel-box-left-label text-center">{utils.formatNumber(stats["itemsOrdered"][0]["value"])}</label>
                    </Col>
                  )}
                </Col>
              </Row>

              <h5 className="title-dashboard">{label}</h5>
              <Row>
                {loading == false && (
                  <>
                    <Col className="col-12 col-lg-3 panel-box-left">
                      {" "}
                      <Skeleton height={237} className="skeleton-list" />{" "}
                    </Col>
                    <Col className="col-12 col-lg-3 panel-box-left">
                      {" "}
                      <Skeleton height={237} className="skeleton-list" />{" "}
                    </Col>
                    <Col className="col-12 col-lg-3 panel-box-left">
                      {" "}
                      <Skeleton height={237} className="skeleton-list" />{" "}
                    </Col>
                    <Col className="col-12 col-lg-3 panel-box-left">
                      {" "}
                      <Skeleton height={237} className="skeleton-list" />{" "}
                    </Col>
                    <Col className="col-12 col-lg-3 panel-box-left">
                      {" "}
                      <Skeleton height={237} className="skeleton-list" />{" "}
                    </Col>
                    <Col className="col-12 col-lg-3 panel-box-left">
                      {" "}
                      <Skeleton height={237} className="skeleton-list" />{" "}
                    </Col>
                    <Col className="col-12 col-lg-3 panel-box-left">
                      {" "}
                      <Skeleton height={237} className="skeleton-list" />{" "}
                    </Col>
                  </>
                )}
                {stats != null &&
                  stats.days.map((day, index) => (
                    <Col className="col-12 col-lg-3 panel-box-left">
                      <Col className="col-12 panel-box more-info-sells">
                        <h5>Ventas</h5>
                        <h1>{utils.formatCurrency(day.totalSells)}</h1>
                        <h5>Delivery</h5>
                        <h1>{utils.formatCurrency(day.totalDelivery)}</h1>
                        <label className="panel-box-left-label text-center">
                          {day.currentDay} / {day.currentMonth}
                        </label>
                      </Col>
                    </Col>
                  ))}
              </Row>
              <h5 className="title-dashboard">Productos más vendidos</h5>
              <Row>
                <>
                  {loading == false && (
                    <>
                      <Col className="col-12 col-lg-3 panel-box-left">
                        {" "}
                        <Skeleton height={148} className="skeleton-list" />{" "}
                      </Col>
                      <Col className="col-12 col-lg-3 panel-box-left">
                        {" "}
                        <Skeleton height={148} className="skeleton-list" />{" "}
                      </Col>
                      <Col className="col-12 col-lg-3 panel-box-left">
                        {" "}
                        <Skeleton height={148} className="skeleton-list" />{" "}
                      </Col>
                      <Col className="col-12 col-lg-3 panel-box-left">
                        {" "}
                        <Skeleton height={148} className="skeleton-list" />{" "}
                      </Col>
                      <Col className="col-12 col-lg-3 panel-box-left">
                        {" "}
                        <Skeleton height={148} className="skeleton-list" />{" "}
                      </Col>
                      <Col className="col-12 col-lg-3 panel-box-left">
                        {" "}
                        <Skeleton height={148} className="skeleton-list" />{" "}
                      </Col>
                      <Col className="col-12 col-lg-3 panel-box-left">
                        {" "}
                        <Skeleton height={148} className="skeleton-list" />{" "}
                      </Col>
                    </>
                  )}
                  {stats != null &&
                    stats.itemsOrdered.map((item, index) => (
                      <>
                        {index < 8 && (
                          <Col className="col-12 col-lg-3 panel-box-left">
                            <Col className="col-12 panel-box more-info-sells">
                              <h5>{utils.formatVarToShow(item.key)}</h5>
                              <h1>{utils.formatNumber(item.value)}</h1>
                              <label className="panel-box-left-label text-center">Top {index + 1}</label>
                            </Col>
                          </Col>
                        )}
                      </>
                    ))}
                </>
              </Row>
            </Col>
          </Row>
        </Container-fluid>
      </div>
    </>
  );
};

export default Branch;
