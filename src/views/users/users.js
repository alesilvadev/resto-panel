import React, { useEffect, useState } from "react";
import "./users.scss";
import firebase from "../../modules/firebase/firebase";
import Skeleton from "react-loading-skeleton";
import utils from "../../utils/utils";

import { Row, Col, ListGroup, ListGroupItem, Input } from "reactstrap";

const Users = (props) => {
  const [modules] = useState(["login", "logout", "overview", "catalogo", "qr", "stats", "audit"]);
  const [audits, setaudits] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAudit();
  }, []);

  async function getAudit() {
    setCollaborators(await firebase.getUsersPlatform());
    setLoading(false);
  }

  console.log(collaborators)

  return (
    <Container-fluid id="audit">
      <Row className="sub-menu">
        <Col className="col-12 col-lg-2">
          <h3 className="panel-box-title">Usuarios</h3>
          <p className="panel-box-description">Manejo de usuarios de la plataforma</p>
        </Col>
      </Row>
      <Row>
        <Col className="col-12 col-lg-3 panel-box-left">
          <Col className="col-12 panel-box">
            <h5>Filtrar</h5>
            <label className="panel-box-left-label">Filtrar por nombre</label>
            <Input type="select" name="selectStatus" id="selectCollaborator">
              <option value="all">Todos</option>
              {collaborators.map((item, index) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </Input>
            <label className="panel-box-left-label">Filtrar por Modulo</label>
            <Input type="select" name="selectStatus" id="selectModule">
              <option value="all">Todos</option>
              {modules.map((item, index) => (
                <option value={item}>{item}</option>
              ))}
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
              collaborators.map((user, index) => (
                <ListGroupItem className="col-12 panel-box">
                  <Col className="list-box">
                    <Col className="col-12">
                      <Row>
                        <Col className="col-12 col-lg-5 audit-info">
                          <span className="list-box-title audit-title">{user.data.user_name}</span>
                          <span className="list-box-title audit-time">{user.data.user_email}</span>
                          <span className="list-box-title audit-user">{user.data.rol}</span>
                        </Col>
                        <Col className="col-12 audit-description-container">
                          <span className="list-box-title">{user.user_email}</span>
                        </Col>
                      </Row>
                    </Col>
                  </Col>
                </ListGroupItem>
              ))}
          </ListGroup>
        </Col>
        <Col className="col-12"></Col>
      </Row>
    </Container-fluid>
  );
};

export default Users;