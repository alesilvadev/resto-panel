import React from "react";
import { Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { connect } from "react-redux";
import firebase from "../../modules/firebase/firebase";
import "./home.scss";
import Employee from "../employee/employee";
import Branch from "../branch/branch";
import Overview from "../overview/overview";
import NewOverview from "../new/newOverview/newOverview";
import Loading from "../../components/loading/loading";
import Subscribers from "../subscribers/subscribers";
import Contact from "../contacts/contact";

import Qr from "../qr/qr";
import Audit from "../audit/audit";
import Stats from "../stats/stats";
import Users from "../users/users";
import { AiFillStar, AiFillGift, AiFillBook, AiFillShop, AiOutlineBarChart, AiFillSetting, AiFillInfoCircle, AiFillSave, AiFillCreditCard } from "react-icons/ai";

import { useState } from "react";

const Home = (props) => {
  const [selected, setSelected] = useState("overview");
  const [redirect, setRedirect] = useState(false);
  const [view, setView] = useState("overview");

  const logout = () => {
    setRedirect(true);
    setTimeout(() => {
      firebase.logout();
    }, 1000);
  };

  if (redirect) {
    return <Loading />;
  }

  return (
    <>
      <div id="navbar">
        <div className="navbar-container">
          <ul className="navbar-horizontal">
            <li onClick={() => setSelected("home", "Bienvenido,", "")}>
              <AiFillShop className={selected == "home" ? "active" : ""} />
            </li>
            <li onClick={() => setSelected("stats", "", "Estadísticas")}>
              <AiOutlineBarChart className={view == "stats" ? "active" : ""} />
            </li>
            <li onClick={() => setSelected("menu", "", "Menú")}>
              <AiFillBook className={view == "menu" ? "active" : ""} />
            </li>
            <li onClick={() => setSelected("suggestions", "", "Sugerencias")}>
              <AiFillStar className={view == "suggestions" ? "active" : ""} />
            </li>
            <li onClick={() => setSelected("promotions", "", "Promociones")}>
              <AiFillGift className={view == "promotions" ? "active" : ""} />
            </li>
            <li onClick={() => setSelected("mybusiness", "", "Configuración")}>
              <AiFillSetting className={view == "mybusiness" ? "active" : ""} />
            </li>
            <li onClick={() => setSelected("billing", "Mi perfil", "Facturación")}>
              <AiFillCreditCard className={view == "billing" ? "active" : ""} />
            </li>
          </ul>
        </div>
      </div>
      {selected == "overview" && <NewOverview />}
      {selected == "employee" && <Employee />}
      {selected == "branch" && <Branch />}
      {selected == "suscriptions" && <Subscribers />}
      {selected == "contacts" && <Contact />}
    </>
  );
};

const mapStateToProps = (state) => ({
  status: state.status,
  user: state.user,
});

export default connect(mapStateToProps)(Home);
