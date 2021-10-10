import React, { useEffect, useState } from "react";
import { AiFillSave, AiOutlineUpload } from "react-icons/ai";
import firebase from "../../modules/firebase/firebase";
import "./menuOption.scss";
import Slide from "react-reveal/Fade";
import { Spinner } from "reactstrap";

const MenuOption = (props) => {
  const [taskButton, setTaskButton] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const saveDeployProduct = async (type) => {
    setLoading(true);
    setTimeout(async () => {
      let product = props.product;
      if (props.action == "create") {
        let status = "disabled";
        if (type == "deploy") {
          status = "enabled";
        }
        product = {
          ...product,
          status: status,
        };
        await firebase.createCatalogo(product);
      }
      if (props.action == "update") {
        await firebase.updateCatalogo(product);
      }
      props.clean();
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {loading == true && (
        <div className="loading-container">
          <Spinner />
        </div>
      )}
      <Slide bottom>
        <nav className="menu shake">
          <input type="checkbox" href="#" className="menu-open" name="menu-open" id="menu-open" onClick={() => setTaskButton(!taskButton)} />
          <label className="menu-open-button" htmlFor="menu-open">
            <span className="lines line-1"></span>
            <span className="lines line-2"></span>
            <span className="lines line-3"></span>
          </label>
          <>
            <a href={props.website} className="menu-item blue" onClick={() => saveDeployProduct("save")}>
              {taskButton === true && (
                <>
                  <span className="text-visit-button">Guardar</span>
                  <AiFillSave className="svg-menu-option" />
                </>
              )}
              {taskButton === false && <i className="fa fa-globe"></i>}
            </a>

            <a href={props.social} className="menu-item red" onClick={() => saveDeployProduct("deploy")}>
              {taskButton === true && (
                <>
                  <span className="text-follow-button">Deployar</span>
                  <AiOutlineUpload className="svg-menu-option" />
                </>
              )}
              {taskButton === false && <i className="fa fa-share-alt"></i>}
            </a>
          </>
        </nav>
      </Slide>
    </>
  );
};
export default MenuOption;
