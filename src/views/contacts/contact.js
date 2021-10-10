import React from "react";
import { Row, Col } from "reactstrap";
import "./contact.scss";
import ContactInfo from "./contactInfo";

const Contact = (props) => {
  return (
    <>
      <div id="catalogo">
        <Container-fluid>
          <Row className="sub-menu">
            <Col className="col-12 col-lg-2">
              <h3 className="panel-box-title">Listado de Mensajes</h3>
              <p className="panel-box-description">Inbox.</p>
            </Col>
          </Row>
          <ContactInfo />
        </Container-fluid>
      </div>
    </>
  );
};

export default Contact;
