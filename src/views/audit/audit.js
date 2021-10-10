import React, { useEffect, useState } from "react";
import "./audit.scss";
import firebase from "../../modules/firebase/firebase";
import Skeleton from "react-loading-skeleton";
import utils from "../../utils/utils";

import { Row, Col, ListGroup, ListGroupItem, Input } from "reactstrap";

const Audit = (props) => {
  const [modules] = useState(["login", "logout", "overview", "catalogo", "qr", "stats", "audit"]);
  const [audits, setaudits] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAudit();
  }, []);

  async function getAudit() {
    setCollaborators(await firebase.getCollaborators());
    setaudits(await firebase.getAudits());
    setLoading(false);
  }

  return (
    <Container-fluid id="audit">
      <Row className="sub-menu">
        <Col className="col-12 col-lg-2">
          <h3 className="panel-box-title">Auditoria</h3>
          <p className="panel-box-description">Seguimiento de usuarios</p>
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
              audits.reverse().map((aud, index) => (
                <ListGroupItem className="col-12 panel-box">
                  <Col className="list-box">
                    <Col className="col-12">
                      <Row>
                        <Col className="col-12 col-lg-5 audit-info">
                          <span className="list-box-title audit-title">{aud.module}</span>
                          <span className="list-box-title audit-time">{utils.formatDateTime(aud.time)}</span>
                          <span className="list-box-title audit-user">{aud.user}</span>
                        </Col>
                        <Col className="col-12 audit-description-container">
                          <span className="list-box-title">{aud.action}</span>
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

export default Audit;
