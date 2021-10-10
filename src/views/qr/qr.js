import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, ListGroupItem, Input, FormGroup, Label, CustomInput } from "reactstrap";
import { AiOutlineLink, AiOutlineDownload } from "react-icons/ai";
import firebase from "../../modules/firebase/firebase";
import Skeleton from "react-loading-skeleton";
import QrPreview from "./qr-preview/qr-preview";
import "./qr.scss";

const Qr = (props) => {
  const [activeTab, setActiveTab] = useState("all");
  const [qrUrl, setQrUrl] = useState("");
  const svgToDataURL = require("svg-to-dataurl");
  const [qrData, setQrData] = useState({
    backgroundColor: "#fff",
    qrColor: "black",
    margin: true,
    width: 50,
    height: 50,
    errorLevel: "L",
    url: "http://severusit.com/",
    includeImage: false,
    image: null,
  });
  const [auxqr, setAuxqr] = useState([]);
  const [qr, setqr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [button, setButton] = useState("none");

  const changeProperty = (field) => {
    if (field != null && field != undefined && field != "") {
      let dataField = document.getElementById(field).value;

      if (field == "includeImage") {
        dataField = document.getElementById(field).checked;
        if (dataField) {
          setQrData({
            ...qrData,
            [field]: dataField,
            image: {
              center: true,
            },
          });
        } else {
          setQrData({
            ...qrData,
            [field]: dataField,
            image: null,
          });
        }
      } else {
        if (field == "margin") {
          dataField = document.getElementById(field).checked;
        }
        setQrData({
          ...qrData,
          [field]: dataField,
        });
      }
    }
  };

  const changePropertyImage = (field) => {
    let dataField = document.getElementById(field).value;
    if (field == "center") {
      dataField = document.getElementById(field).checked;
      let x = null;
      let y = null;
      if (!dataField) {
        if (qrData.margin) {
          x = 80;
          y = 80;
        } else {
          x = 110;
          y = 110;
        }
      }
      setQrData({
        ...qrData,
        image: {
          ...qrData.image,
          [field]: dataField,
          x: x,
          y: y,
        },
      });
    } else {
      if (field == "excavate") {
        dataField = document.getElementById(field).checked;
      }
      setQrData({
        ...qrData,
        image: {
          ...qrData.image,
          [field]: dataField,
        },
      });
    }
  };

  const saveQr = async () => {
    setButton("pending");
    const svg = document.getElementById("qrGenerated");
    const serializedSVG = new XMLSerializer().serializeToString(svg);
    const base64Data = window.btoa(serializedSVG);
    const dataUrl = svgToDataURL(base64Data);
    const result = "data:image/svg+xml;base64," + base64Data;
    setQrUrl(result);
    const response = await firebase.saveQr(qrData.id, qrData.url, result);
    if (response) {
      setButton("complete");
      setActiveTab("all");
      getQr();
    } else {
      setButton("error");
    }
  };

  useEffect(() => {
    getQr();
  }, []);

  async function getQr() {
    const data = await firebase.getQr();
    setqr(data);
    setAuxqr(data);
    setLoading(false);
  }
    
  const searchCatalogo = () => {
    const text = document.getElementById("searchText").value;
    const status = document.getElementById("selectStatus").value;

    let filteredCatalogo = [];

    if (text == "" && status == "") {
      filteredCatalogo = auxqr;
    } else {
      if (text != "") {
        filteredCatalogo = auxqr.filter((option) => {
          return text != "" && containText(option.id, text);
        });
      }

      if (status != "") {
        if (filteredCatalogo.length < 1) {
          filteredCatalogo = auxqr.filter((option) => {
            return status != "" && containText(option.status, status);
          });
        } else {
          filteredCatalogo = filteredCatalogo.filter((option) => {
            return status != "" && containText(option.status, status);
          });
        }
      }
    }
    setqr(filteredCatalogo);
  };

  const updateQrStatus = (id, label, doc, index) => {
    const status = document.getElementById(label).checked;
    const statusFormat = status == true ? "enabled" : "disabled";
    firebase.updateQrStatus(id, statusFormat, doc);
    let con = qr;
    con[index].status = statusFormat;
    setqr(qr);
    setTimeout(() => {
      getQr();
    }, 1000);
  };

  const containText = (text1, text2) => {
    const dict = { á: "a", é: "e", í: "i", ó: "o", ú: "u" };
    text1 = text1.trim().toLowerCase();
    text1 = text1.replace(/[^\w ]/g, (char) => dict[char] || char);
    text2 = text2.trim().toLowerCase();
    text2 = text2.replace(/[^\w ]/g, (char) => dict[char] || char);
    return text1.indexOf(text2) != -1;
  };

  return (
    <>
      <Container-fluid>
        <Row className="sub-menu">
          <Col className="col-12 col-lg-2">
            <h3 className="panel-box-title">Motor Qr</h3>
            <p className="panel-box-description">Crear y administra codigos QR.</p>
          </Col>
          <Col className="col-12 col-lg-4 sub-menu-item">
            <a onClick={() => setActiveTab("all")} className={activeTab == "all" ? "active-tab" : ""}>
              Ver Todo
            </a>
            <a onClick={() => setActiveTab("create")} className={activeTab == "create" ? "active-tab" : ""}>
              Crear Qr
            </a>
          </Col>
        </Row>
      </Container-fluid>
      <Row>
        {activeTab == "all" && (
          <>
            <Col className="col-12 col-lg-3 panel-box-left">
              <Col className="col-12 panel-box">
                <h5>Filtrar</h5>
                <label className="panel-box-left-label">Filtrar por nombre</label>
                <Input type="text" name="searchText" id="searchText" placeholder="Buscar por nombre" onChange={() => searchCatalogo()} />
                <label className="panel-box-left-label">Filtrar por estado</label>
                <Input type="select" name="selectStatus" id="selectStatus" onChange={() => searchCatalogo()}>
                  <option value="">Todos</option>
                  <option value="enabled">Habilitado</option>
                  <option value="disabled">Deshabilitado</option>
                </Input>
              </Col>
            </Col>

            <Col className="col-12 col-lg-8 panel-box-container">
              <ListGroup>
                {loading == true && (
                  <>
                    <Skeleton height={78} className="skeleton-list" />
                    <Skeleton height={78} className="skeleton-list" />
                    <Skeleton height={78} className="skeleton-list" />
                    <Skeleton height={78} className="skeleton-list" />
                    <Skeleton height={78} className="skeleton-list" />
                    <Skeleton height={78} className="skeleton-list" />
                    <Skeleton height={78} className="skeleton-list" />
                    <Skeleton height={78} className="skeleton-list" />

                    <Skeleton height={78} className="skeleton-list" />
                  </>
                )}
                {loading == false &&
                  qr.map((cat, index) => (
                    <ListGroupItem className="col-12 panel-box">
                      <Col className="list-box">
                        <Col className="col-6 col-lg-9">
                          <span className="list-box-title">{cat.id}</span>
                        </Col>
                        <Col className="col-1">
                          <a href={cat.url} target="_blank" rel="noopener noreferrer">
                            <AiOutlineLink />
                          </a>
                        </Col>
                        <Col className="col-1">
                          <a href={cat.qr} download>
                            <AiOutlineDownload />
                          </a>
                        </Col>
                        <Col className="col-1">
                          <label class="switch">
                            <input
                              type="checkbox"
                              checked={cat.status === "enabled" ? true : false}
                              onClick={() => updateQrStatus(cat.id, "statusOption" + index, cat.doc, index)}
                              id={"statusOption" + index}
                              name={"statusOption" + index}
                            />
                            <div>
                              <span></span>
                            </div>
                          </label>
                        </Col>
                      </Col>
                    </ListGroupItem>
                  ))}
              </ListGroup>
            </Col>
          </>
        )}
        {activeTab == "create" && (
          <>
            <Col className="col-12 col-lg-8 panel-box-left">
              <Col className="col-12 panel-box">
                <h4>Configuración</h4>

                <Row>
                  <Col className="col-12 form-label">
                    <FormGroup className="form-inline-input">
                      <Row>
                        <Col className="col-1">
                          <label>id</label>
                        </Col>
                        <Col className="col-10">
                          <Input className="form-control-alternative" value={qrData.id} onChange={() => changeProperty("id")} placement="right" id="id" name="id" />
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                  <Col className="col-12 form-label">
                    <FormGroup className="form-inline-input">
                      <Row>
                        <Col className="col-1">
                          <label>url</label>
                        </Col>
                        <Col className="col-10">
                          <Input className="form-control-alternative" value={qrData.url} onChange={() => changeProperty("url")} placement="right" id="url" name="url" />
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>

                  <Col className="col-3 form-label">
                    <Row>
                      <Col className="col-3">
                        <label>Fondo:</label>
                      </Col>
                      <Col className="col-8">
                        <input
                          type="color"
                          value={qrData.backgroundColor}
                          onChange={() => changeProperty("backgroundColor")}
                          placement="right"
                          id="backgroundColor"
                          name="backgroundColor"
                          className="input-color"
                        />
                      </Col>
                    </Row>
                  </Col>

                  <Col className="col-3 form-label">
                    <Row>
                      <Col className="col-1">
                        <label>QR:</label>
                      </Col>
                      <Col className="col-10">
                        <input type="color" value={qrData.qrColor} onChange={() => changeProperty("qrColor")} placement="right" id="qrColor" name="qrColor" className="input-color" />
                      </Col>
                    </Row>
                  </Col>
                  <Col className="col-3 form-label">
                    <Row>
                      <Col className="col-4">
                        <Label for="exampleCheckbox">Margen:</Label>
                      </Col>

                      <Col className="col-7">
                        <CustomInput type="switch" checked={qrData.margin} onChange={() => changeProperty("margin")} id="margin" name="margin" />
                      </Col>
                    </Row>
                  </Col>
                  <Col md="3" className="form-label">
                    <Row>
                      <Col className="col-4">
                        <Label for="exampleCheckbox">Imágen</Label>
                      </Col>
                      <Col className="col-7">
                        <CustomInput type="switch" checked={qrData.includeImage} onChange={() => changeProperty("includeImage")} id="includeImage" name="includeImage" />
                      </Col>
                    </Row>
                  </Col>
                  {qrData.includeImage == true && (
                    <>
                      <Col md="3" className="form-label">
                        <Row>
                          <Col className="col-3">
                            <Label for="exampleCheckbox">Merge</Label>
                          </Col>

                          <Col className="col-8">
                            <CustomInput type="switch" checked={qrData.image.excavate} onChange={() => changePropertyImage("excavate")} id="excavate" name="excavate" />
                          </Col>
                        </Row>
                      </Col>
                      <Col md="3" className="form-label">
                        <Row>
                          <Col className="col-3">
                            <Label for="exampleCheckbox">Centrar</Label>
                          </Col>

                          <Col className="col-8">
                            <CustomInput type="switch" checked={qrData.image.center} onChange={() => changePropertyImage("center")} id="center" name="center" />
                          </Col>
                        </Row>
                      </Col>
                      <Col md="12" className="form-label">
                        <FormGroup className="form-inline-input">
                          <Row>
                            <Col md="1">
                              <label>src</label>
                            </Col>
                            <Col md="10">
                              <Input className="form-control-alternative" value={qrData.image.src} onChange={() => changePropertyImage("src")} placement="right" id="src" name="src" />
                            </Col>{" "}
                          </Row>
                        </FormGroup>
                      </Col>
                      <Col md="6" className="form-label">
                        <FormGroup className="form-inline-input">
                          <Row>
                            <Col md="2">
                              <label>Ancho</label>
                            </Col>
                            <Col md="8">
                              <Input className="form-control-alternative" value={qrData.image.height} onChange={() => changePropertyImage("height")} placement="right" id="height" name="height" />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                      <Col md="6" className="form-label">
                        <FormGroup className="form-inline-input">
                          <Row>
                            <Col md="2">
                              <label>Largo</label>
                            </Col>
                            <Col md="8">
                              <Input className="form-control-alternative" value={qrData.image.width} onChange={() => changePropertyImage("width")} placement="right" id="width" name="width" />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </>
                  )}
                </Row>
              </Col>
            </Col>
            <Col className="col-12 col-lg-4 panel-box-container-rigth">
              <Col className="col-12 panel-box panel-box-left">
                <h5>Vista Previa</h5>
                <QrPreview data={qrData} />
                <Col className="offset-lg-4 col-12 col-lg-4">
                  {button == "none" && (
                    <a onClick={() => saveQr()} className="btn btn-theme col-12 confirm-card-button loading-btn--pending">
                      Crear código
                    </a>
                  )}
                  {button == "pending" && (
                    <div class="circle-loader">
                      <div class="draw"></div>
                    </div>
                  )}
                  {button == "error" && (
                    <a href={qrUrl} onClick={() => saveQr()} className="btn btn-danger col-12 confirm-card-button loading-btn--pending">
                      Crear código
                    </a>
                  )}
                </Col>
              </Col>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default Qr;
