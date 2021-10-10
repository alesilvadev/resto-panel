import React from "react";
import { Row, Col, ListGroup, ListGroupItem, Input } from "reactstrap";
import { useState, useEffect } from "react";
import firebase from "../../modules/firebase/firebase";
import { AiOutlineLink, AiOutlineEdit, AiOutlineLeft, AiFillEye, AiFillDelete, AiFillStar } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "./subscribers.scss";
import ReactPaginate from "react-paginate";

import SubscribersInfo from "./subscribersInfo";

const Subscribers = (props) => {
  const [activeTab, setActiveTab] = useState("team");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div id="catalogo">
        <Container-fluid>
          <Row className="sub-menu">
            <Col className="col-12 col-lg-2">
              <h3 className="panel-box-title">Listado de Suscriptores</h3>
              <p className="panel-box-description">Contacto via mail .</p>
            </Col>
          </Row>
          <SubscribersInfo />
        </Container-fluid>
      </div>
    </>
  );
};

export default Subscribers;
