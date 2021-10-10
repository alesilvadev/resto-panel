import React, { useEffect, useState } from "react";
import "./stats.scss";
import firebase from "../../modules/firebase/firebase";
import Skeleton from "react-loading-skeleton";
import { Row, Col, Input, Spinner } from "reactstrap";

const Stats = (props) => {
  const [catalogos, setCatalogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({});
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const [monthsData, setMonthsData] = useState([]);
  const [lastSevenDays, setLastSevenDays] = useState({});
  const [statsSevenDays, setStatsSevenDays] = useState([]);
  const [bestMonth, setBestMonth] = useState({
    month: 0,
    clicks: 0,
  });

  useEffect(() => {
    getCatalogos();
  }, []);

  const initLastSevenDays = () => {
    var weekday = new Array(7);
    weekday[0] = "Domingo";
    weekday[1] = "Lunes";
    weekday[2] = "Martes";
    weekday[3] = "Miércoles";
    weekday[4] = "Jueves";
    weekday[5] = "Viernes";
    weekday[6] = "Sabado";

    var result = {};
    for (var i = 0; i < 7; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      result[formatDate(d)] = {
        entries: 0,
        day: weekday[d.getDay()],
      };
    }
    return result;
  };

  const formatDate = (date) => {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    date = mm + "/" + dd;
    return date;
  };

  const setApp = () => {
    setLoading(false);
    setTimeout(() => {
      const index = document.getElementById("selectStat").value;
      setSelected(catalogos[index]);
      calculateMonth(catalogos[index]);
      setLoading(true);
    }, 1000);
  };

  async function getCatalogos() {
    setLoading(false);
    const data = await firebase.getCatalogosStats();
    setCatalogos(data);
    setSelected(data[0]);
    calculateMonth(data[0]);

    setLoading(true);
  }

  const calculateMonth = async (data) => {
    const lastWeek = initLastSevenDays();
    const months = [];
    let hours = [];
    const clicks = data && data.times ? data.times : [];
    console.log(clicks[2])
    let moreClicks = {};
    let clicksAux = 0;
    let clicksHourAux = 0;
    console.log(lastWeek);
    let lastSevenDaysAux = lastWeek;
    for (let index = 0; index < clicks.length; index++) {
      const element = new Date(clicks[index] * 1000);
      const formatedDate = formatDate(element);
      if (lastSevenDaysAux[formatedDate] !== undefined) {
        console.log("ahhhhhhhhhhhhh");
        lastSevenDaysAux[formatedDate]["entries"] = lastSevenDaysAux[formatedDate]["entries"] + 1;
      }
      const month = element.getMonth();
      const hour = element.getHours();
      months[month] = months[month] != null && months[month] != undefined ? months[month] + 1 : 0;
      hours[hour] = hours[hour] != null && hours[hour] != undefined ? hours[hour] + 1 : 0;
    }
    setMonthsData(months);
    for (let index = 0; index < months.length; index++) {
      if (months[index] > clicksAux) {
        clicksAux = months[index];
        moreClicks = {
          month: index,
          clicks: months[index],
        };
      }
    }
    for (let index = 0; index < hours.length; index++) {
      if (hours[index] > clicksHourAux) {
        clicksHourAux = hours[index];
        moreClicks = {
          ...moreClicks,
          hour: index,
          clicksHours: hours[index],
        };
      }
    }
    moreClicks = {
      ...moreClicks,
      current: months[new Date().getMonth()],
    };
    let statsLastSevenDaysAux = [];
    Object.keys(lastSevenDaysAux).map((keyName, keyIndex) => {
      const value = lastSevenDaysAux[keyName];
      let auxStatDay = {};
      Object.keys(value).map((keyName, keyIndex) => {
        auxStatDay[keyName] = value[keyName];
      });
      statsLastSevenDaysAux.push(auxStatDay);
      // use keyName to get current key's name
      // and a[keyName] to get its value
    });
    console.log(statsLastSevenDaysAux);
    setStatsSevenDays(statsLastSevenDaysAux);
    setBestMonth(moreClicks);
  };

  return (
    <Container-fluid>
      <Row className="sub-menu">
        <Col className="col-12 col-lg-2">
          <h3 className="panel-box-title">Estadisticas</h3>
          <p className="panel-box-description">Tracking de información por aplicación.</p>
        </Col>
        <Col className="col-12 col-lg-2 sub-menu-item">
          <Input type="select" name="selectStat" id="selectStat" onChange={() => setApp()}>
            {catalogos.map((cat, index) => (
              <option value={index}>{cat.name}</option>
            ))}
          </Input>
        </Col>
      </Row>
      <Row>
        <h1 className="title-stats">Estadisticas Generales</h1>
        <Col className="col-12 col-lg-3 panel-box-left">
          {loading == false && <Skeleton height={170} className="skeleton-list" />}
          {loading == true && (
            <Col className="col-12 panel-box">
              <h5>Entradas</h5>
              <h1>{selected.times != null ? selected.times.length : 0}</h1>
              <label className="panel-box-left-label text-center">Total de entradas hasta la Fecha</label>
            </Col>
          )}
        </Col>
        <Col className="col-12 col-lg-3 panel-box-left">
          {loading == false && <Skeleton height={170} className="skeleton-list" />}
          {loading == true && (
            <Col className="col-12 panel-box">
              <h5>Mes actual</h5>
              <h1>{bestMonth.current}</h1>
              <label className="panel-box-left-label text-center">Entradas del mes actual</label>
            </Col>
          )}
        </Col>

        <Col className="col-12 col-lg-3 panel-box-left">
          {loading == false && <Skeleton height={170} className="skeleton-list" />}
          {loading == true && (
            <Col className="col-12 panel-box">
              <h5>Horario con mayor trafico</h5>
              {bestMonth.hour > 0 && <h1>{bestMonth.hour + ":00 Hs -" + (bestMonth.hour + 1) + ":00 Hs"}</h1>}
              {bestMonth.hour == undefined && <h1>N/A</h1>}
              <label className="panel-box-left-label text-center">{bestMonth.clicksHours} Entradas Aprox.</label>
            </Col>
          )}
        </Col>

        <Col className="col-12 col-lg-3 panel-box-left">
          {loading == false && <Skeleton height={170} className="skeleton-list" />}
          {loading == true && (
            <Col className="col-12 panel-box">
              <h5>Mejor Mes</h5>
              <h1>{monthNames[bestMonth.month]}</h1>
              <label className="panel-box-left-label text-center">{bestMonth.clicks} Entradas</label>
            </Col>
          )}
        </Col>
        <h1 className="title-stats">Estadisticas Ultimos 7 Dias</h1>
        <div id="statsByDay" className="row col">
          <Col className="offset-1 col-1" />
          {loading == false && (
            <>
              <Col className="col-12 col-lg-1 panel-box-left semanalStats">
                <Skeleton height={130} className="skeleton-list" />
              </Col>
              <Col className="col-12 col-lg-1 panel-box-left semanalStats">
                <Skeleton height={130} className="skeleton-list" />
              </Col>
              <Col className="col-12 col-lg-1 panel-box-left semanalStats">
                <Skeleton height={130} className="skeleton-list" />
              </Col>
              <Col className="col-12 col-lg-1 panel-box-left semanalStats">
                <Skeleton height={130} className="skeleton-list" />
              </Col>
              <Col className="col-12 col-lg-1 panel-box-left semanalStats">
                <Skeleton height={130} className="skeleton-list" />
              </Col>
              <Col className="col-12 col-lg-1 panel-box-left semanalStats">
                <Skeleton height={130} className="skeleton-list" />
              </Col>
              <Col className="col-12 col-lg-1 panel-box-left semanalStats">
                <Skeleton height={130} className="skeleton-list" />
              </Col>
            </>
          )}
          {loading == true > 0 &&
            statsSevenDays.reverse().map((item, index) => (
              <Col className="col-12 col-lg-1 panel-box-left semanalStats">
                {loading == false && <Skeleton height={130} className="skeleton-list" />}
                {loading == true && (
                  <Col className="col-12 panel-box">
                    <h5>{item.day}</h5>
                    <h1>{item.entries}</h1>
                  </Col>
                )}
              </Col>
            ))}
        </div>
        <h1 className="title-stats">Estadisticas Anuales</h1>

        {monthNames.map((item, index) => (
          <Col className="col-12 col-lg-2 panel-box-left">
            {loading == false && <Skeleton height={108} className="skeleton-list" />}
            {loading == true && (
              <Col className="col-12 panel-box">
                <h5>{item}</h5>
                <h1>{monthsData[index] != null && monthsData[index] != undefined ? monthsData[index] : 0}</h1>
              </Col>
            )}
          </Col>
        ))}
      </Row>
    </Container-fluid>
  );
};
export default Stats;
