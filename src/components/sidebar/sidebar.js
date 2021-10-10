import React, { Component, Fragment, useState } from "react";
import { connect } from "react-redux";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavbarText } from "reactstrap";
import "./sidebar.scss";

const Sidebar = (props) => {
  const [selected, setSelected] = useState("overview");
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <div id="navbar">
        <Nav>
          <NavItem>
            <img src={require("../../assets/global/logpot.png")} className="logo-navbar" />
          </NavItem>

          <NavItem className={selected === "overview" ? "active-item" : ""}>
            <NavLink className={selected === "overview" ? "active-a" : ""} onClick={() => setSelected("overview")}>
              Overview
            </NavLink>
          </NavItem>
          <NavItem className={selected === "catalogo" ? "active-item" : ""}>
            <NavLink className={selected === "catalogo" ? "active-a" : ""} onClick={() => setSelected("catalogo")}>
              Catalogo
            </NavLink>
          </NavItem>
          <NavItem className={selected === "codigo" ? "active-item" : ""}>
            <NavLink className={selected === "codigo" ? "active-a" : ""} onClick={() => setSelected("codigo")}>
              Codigo QR
            </NavLink>
          </NavItem>
          <NavItem className={selected === "stats" ? "active-item" : ""}>
            <NavLink className={selected === "stats" ? "active-a" : ""} onClick={() => setSelected("stats")}>
              Estadisticas
            </NavLink>
          </NavItem>
          <NavItem className={selected === "audit" ? "active-item" : ""}>
            <NavLink className={selected === "audit" ? "active-a" : ""} onClick={() => setSelected("audit")}>
              Auditoria
            </NavLink>
          </NavItem>
          <NavItem className={selected === "clients" ? "active-item" : ""}>
            <NavLink className={selected === "clients" ? "active-a" : ""} onClick={() => setSelected("clients")}>
              Clientes
            </NavLink>
          </NavItem>
          <NavItem>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink href="/components/">Components</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Options
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Option 1</DropdownItem>
                    <DropdownItem>Option 2</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Reset</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
              <NavbarText>Simple Text</NavbarText>
            </Collapse>
          </NavItem>
        </Nav>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  status: state.status,
  user: state.user,
});

export default connect(mapStateToProps)(Sidebar);
