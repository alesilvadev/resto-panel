import React from "react";
import { Row, Col, ListGroup, ListGroupItem, Input } from "reactstrap";
import { useState, useEffect, useReducer } from "react";
import firebase from "../../modules/firebase/firebase";
import { AiOutlineLink, AiOutlineEdit, AiOutlineLeft, AiFillMail, AiFillDelete, AiFillStar, AiOutlineSend } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";

const ContactInfo = (props) => {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [limit, setLimit] = useState(0);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    getContacts(null);
  }, [offset]);

  const getContacts = async (filter) => {
    setLoading(true);
    const data = await firebase.getContact(filter);
    setLimit(data.length);
    setPageCount(Math.ceil(data.length / perPage));
    const slice = data.slice(offset, offset + perPage);
    const postData = slice.map((pd) => (
      <ListGroupItem className="col-12 col-lg-11 panel-box">
        <Col className="list-box">
          <Col className="col-6 col-lg-8">
            <span className="list-box-title">{pd.info.subject}</span>
            <p>{pd.info.message}</p>
            <span className="list-box-detail">
              {pd.info.name} | {pd.info.email}
            </span>
          </Col>

          <Col className="col-2 col-lg-4 align-buttons">
            <a href={"mailto:" + pd.info.email}>
              <AiOutlineSend className="list-element-icon" />
            </a>
            <a onClick={() => getUrl(pd.info.id, pd.id)}>
              <AiFillMail className={pd.info.answer == true ? "list-element-icon" : "list-element-icon icon-active"} />
            </a>
            <a onClick={() => updateContact(pd.id, "favorite", true)}>
              <AiFillStar className={pd.info.favorite == true ? "list-element-icon" : "list-element-icon icon-active"} />
            </a>
            <a onClick={() => deleteContact(pd.id)}>
              <AiFillDelete className="list-element-icon" />
            </a>
          </Col>
        </Col>
      </ListGroupItem>
    ));
    setContacts(postData);
    setLoading(false);
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1);
  };

  const getUrl = async (id, docId) => {
    await firebase.updateContact(docId, "answer", true);
    const url = await firebase.getUrl(id);
    window.open(url, "_blank");
  };

  const deleteContact = async (id) => {
    const url = await firebase.deleteContact(id);
    getContacts(null);
    refreshPages();
    forceUpdate();
  };

  const updateContact = async (id, field, value) => {
    const url = await firebase.updateContact(id, field, value);
    getContacts(null);
    refreshPages();
    forceUpdate();
  };

  const filtercontacts = () => {
    let filter = document.getElementById("filter").value;
    refreshPages();
    getContacts(filter);
  };

  const refreshPages = () => {
    setPageCount(0);
    setOffset(0);
  };

  return (
    <>
      <div id="catalogo">
        <Container-fluid>
          <Row>
            <Col className="col-12 col-lg-3 panel-box-left">
              <Col className="col-12 panel-box">
                <h5>Filtrar</h5>
                <label className="panel-box-left-label">Filtrar por estado</label>
                <Input type="select" name="selectStatus" id="selectStatus" onChange={() => filtercontacts()} id="filter">
                  <option value="">Todos</option>
                  <option value="answer">Respondidos</option>
                  <option value="seen">Vistos</option>
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
                    {contacts}
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

export default ContactInfo;
