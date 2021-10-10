import React from "react";
import { Row, Col, ListGroup, ListGroupItem, Input } from "reactstrap";
import { useState, useEffect } from "react";
import firebase from "../../modules/firebase/firebase";
import { AiOutlineLink, AiOutlineEdit, AiOutlineLeft, AiFillEye, AiFillDelete, AiFillStar } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "./employee.scss";
import ReactPaginate from "react-paginate";

const EmployeeRequest = (props) => {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [cvs, setCvs] = useState([]);
  const [limit, setLimit] = useState(0);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    getNewsCvs(null);
  }, [offset]);

  const getNewsCvs = async (filter) => {
    setLoading(true)
    const data = await firebase.getCvs(filter);
    setLimit(data.length);
    setPageCount(Math.ceil(data.length / perPage));
    const slice = data.slice(offset, offset + perPage);
    const postData = slice.map((pd) => (
      <ListGroupItem className="col-12 col-lg-11 panel-box">
        <Col className="list-box">
          <Col className="col-6 col-lg-10">
            <span className="list-box-title">{pd.info.fullName}</span>
            <p>{pd.info.joinTeamText}</p>
          </Col>
          <a onClick={() => getUrl(pd.info.id, pd.id)}>
            <AiFillEye className={pd.info.seen == true ? "list-element-icon" : "list-element-icon icon-active"} />
          </a>
          <Col className="col-2 col-lg-">
            <a onClick={() => updateCv(pd.id, "favorite", true)}>
              <AiFillStar className={pd.info.favorite == true ? "list-element-icon" : "list-element-icon icon-active"} />
            </a>
            <a onClick={() => deleteCv(pd.id)}>
              <AiFillDelete className="list-element-icon" />
            </a>
          </Col>
        </Col>
      </ListGroupItem>
    ));
    setCvs(postData);
    setLoading(false)
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1);
  };

  const getUrl = async (id, docId) => {
    await firebase.updateCv(docId, "seen", true);
    const url = await firebase.getUrl(id);
    window.open(url, "_blank");
  };

  const deleteCv = async (id) => {
    const url = await firebase.deleteCv(id);
    getNewsCvs();
  };

  const updateCv = async (id, field, value) => {
    const url = await firebase.updateCv(id, field, value);
  };

  const filterCvs = () => {
    let filter = document.getElementById("filter").value;
    setPageCount(0);
    setOffset(0);
    getNewsCvs(filter);
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
                <Input type="select" name="selectStatus" id="selectStatus" onChange={() => filterCvs()} id="filter">
                  <option value="">Todos</option>
                  <option value="favorite">Favoritos</option>
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
                    {cvs}
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

export default EmployeeRequest;
