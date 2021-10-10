import React from "react";
import { Row, Col, ListGroup, ListGroupItem, Input } from "reactstrap";
import { useState, useEffect } from "react";
import firebase from "../../modules/firebase/firebase";
import { AiOutlineLink, AiOutlineEdit, AiOutlineLeft, AiFillEye, AiFillDelete, AiFillStar } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "./employee.scss";
import ReactPaginate from "react-paginate";

import EmployeeRequest from "./employeeRequest";
import EmployeeTeam from "./employeeTeam";

const Employee = (props) => {
  const [activeTab, setActiveTab] = useState("team");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div id="catalogo">
        <Container-fluid>
          <Row className="sub-menu">
            <Col className="col-12 col-lg-2">
              <h3 className="panel-box-title">Listado de Personal</h3>
              <p className="panel-box-description">información de cada empleado .</p>
            </Col>
            <Col className="col-12 col-lg-4 sub-menu-item">
              <a onClick={() => setActiveTab("team")} className={activeTab == "team" ? "active-tab" : ""}>
                Empleados
              </a>
              <a onClick={() => setActiveTab("news")} className={activeTab == "news" ? "active-tab" : ""}>
                Solicitudes
              </a>
            </Col>
          </Row>
          {activeTab === "team" && <EmployeeTeam />}
          
          {activeTab === "news" && <EmployeeRequest />}
        </Container-fluid>
      </div>
    </>
  );
};

export default Employee;
