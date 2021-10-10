import React from "react";
import { Row, Col, ListGroup, ListGroupItem, Input } from "reactstrap";
import { useState, useEffect } from "react";
import firebase from "../../modules/firebase/firebase";
import { AiOutlineLink, AiOutlineEdit, AiOutlineLeft, AiFillEye, AiFillDelete, AiFillStar } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "./employee.scss";
import ReactPaginate from "react-paginate";

const EmployeeTeam = (props) => {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [employees, setEmployess] = useState([]);
  const [limit, setLimit] = useState(0);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [stats, setStats] = useState({});
  const [branchesList, setBranchesList] = useState([]);
  const [branchSelected, setBranchSelected] = useState("all")

  useEffect(() => {
    getTeam(null);
    getBranchesList();
  }, [offset]);

  const getTeam = async (filter) => {
    setLoading(true);
    let data = await firebase.getTeam(filter);
    data = orderTeam(data);
    setLimit(data.length);
    setPageCount(Math.ceil(data.length / perPage));
    const slice = data.slice(offset, offset + perPage);
    const postData = slice.map((pd) => (
      <ListGroupItem className="col-12 col-lg-11 panel-box">
        <Col className="list-box">
          <Col className="col-6 col-lg-10">
            <p className="list-box-title">{pd.fullName}</p> <span className="list-box-rol">{pd.rol}</span> <span className="list-box-salary">${pd.salary}</span>
            <span className="list-box-branch">{pd.branch}</span> <span className="list-box-years"> Antiguedad {pd.years} años</span>
            <p>{pd.joinTeamText}</p>
          </Col>
        </Col>
      </ListGroupItem>
    ));
    setEmployess(postData);
    setLoading(false);
  };

  const orderTeam = (data) => {
    let result = [];
    let statsResult = {
      salary: 0,
      amount: 0,
      moreEmployee: 0,
      highestSalary: 0,
      highestSalaryName: "",
    };
    for (let index = 0; index < data.length; index++) {
      const element = data[index].info;
      Object.keys(element).forEach(function (key) {
        let value = element[key];
        const dateStarted = value.started.toDate();
        let currentTime = new Date().getTime();
        let startedTime = new Date(dateStarted).getTime();
        let difference = currentTime - startedTime;
        var years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
        statsResult = {
          ...statsResult,
          salary: statsResult.salary + parseInt(value.salary),
          amount: statsResult.amount + 1,
          highestSalary: parseInt(value.salary) > statsResult.highestSalary ? parseInt(value.salary) : statsResult.highestSalary,
          highestSalaryName: parseInt(value.salary) > statsResult.highestSalary ? value.fullName : statsResult.highestSalaryName,
        };
        result.push({ ...value, branch: data[index].id, years: years });
        //var ageDifMs = Date.now() - dateStarted;
        //var ageDate = new Date(ageDifMs); // miliseconds from epoch
        //console.log(Math.abs(ageDate.getUTCFullYear() - 1970));
      });
    }
    setStats({
      amount: statsResult.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      salary: statsResult.salary.toLocaleString("es-UY", {
        style: "currency",
        currency: "UYU",
      }),
      highestSalary: statsResult.highestSalary.toLocaleString("es-UY", {
        style: "currency",
        currency: "UYU",
      }),
      highestSalaryName: statsResult.highestSalaryName,
      averageSalary: (statsResult.salary / statsResult.amount).toLocaleString("es-UY", {
        style: "currency",
        currency: "UYU",
      }),
    });
    return result;
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1);
  };

  const getBranchesList = async () => {
    const data = await firebase.getBranchesList()
    setBranchesList(data);
  };

  const filterBranch = () => {
    let filter = document.getElementById("filter").value;
    setBranchSelected(filter)
    setPageCount(0);
    setOffset(0);
    getTeam(filter);
  };

  return (
    <>
      <div id="catalogo">
        <Container-fluid>
          <Row>
            <Col className="col-12 col-lg-3 panel-box-left">
              {loading == true && <Skeleton height={170} className="skeleton-list" />}
              {loading == false && (
                <Col className="col-12 panel-box">
                  <h5>Empleados</h5>
                  <h1>{stats.amount}</h1>
                  <label className="panel-box-left-label text-center">Total de Empleados hasta la Fecha</label>
                </Col>
              )}
            </Col>
            <Col className="col-12 col-lg-3 panel-box-left">
              {loading == true && <Skeleton height={170} className="skeleton-list" />}
              {loading == false && (
                <Col className="col-12 panel-box">
                  <h5>Salarios</h5>
                  <h1>{stats.salary}</h1>
                  <label className="panel-box-left-label text-center">Suma total de salarios</label>
                </Col>
              )}
            </Col>
            <Col className="col-12 col-lg-3 panel-box-left">
              {loading == true && <Skeleton height={170} className="skeleton-list" />}
              {loading == false && (
                <Col className="col-12 panel-box">
                  <h5>Mayor sueldo</h5>
                  <h1>{stats.highestSalary}</h1>
                  <label className="panel-box-left-label text-center">{stats.highestSalaryName}</label>
                </Col>
              )}
            </Col>
            <Col className="col-12 col-lg-3 panel-box-left">
              {loading == true && <Skeleton height={170} className="skeleton-list" />}
              {loading == false && (
                <Col className="col-12 panel-box">
                  <h5>Salario Promedio</h5>
                  <h1>{stats.averageSalary}</h1>
                  <label className="panel-box-left-label text-center">Salario Promedio</label>
                </Col>
              )}
            </Col>
          </Row>
          <Row>
              <Col className="col-12 col-lg-3 panel-box-left">
                <Col className="col-12 panel-box">
                  <h5>Filtrar</h5>
                  <label className="panel-box-left-label">Filtrar por Sucursal</label>
                  <Input type="select" name="selectStatus" id="selectStatus" onChange={() => filterBranch()} id="filter">
                    <option value="all">Todos</option>
                    {branchesList.map((value, index) => (
                      <option value={value} checked={branchSelected == value}>{value}</option>
                    ))}
                  </Input>
                </Col>
              </Col>
          
            <Col className="col-12 col-lg-9 panel-box-container">
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
                {loading == false && (
                  <>
                    {employees}
                    <ReactPaginate
                      previousLabel={"Anterior"}
                      nextLabel={"Siguiente"}
                      breakLabel={"..."}
                      breakClassName={"break-me"}
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={2}
                      onPageChange={handlePageClick}
                      containerClassName={"pagination"}
                      subContainerClassName={"pages pagination"}
                      activeClassName={"active"}
                    />
                  </>
                )}
              </ListGroup>
            </Col>
          </Row>
        </Container-fluid>
      </div>
    </>
  );
};

export default EmployeeTeam;
