import React from "react";
import "./login.scss";
import { Button, Input, Row, Col } from "reactstrap";
import firebase from "../../modules/firebase/firebase";
import { useState } from "react";
import Loading from "../../components/loading/loading";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [buttonClass, setButtonClass] = useState("");
  const [redirect, setRedirect] = useState(false);

  const loginMethod = async () => {
    setButtonClass("disabled");
    setError("");
    if (email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      if (email !== "" && password !== "") {
        const login = await firebase.login(email, password);
        if (login != null) {
          if (login.error === "auth/wrong-password") {
            setError("La contraseña y/o email que has ingresado es incorrecto");
          } else if (login.error === "auth/user-not-found") {
            setError("No encontramos un usuario con el email ingresado");
          } else if (login.error === "auth/too-many-requests") {
            setError("Ha ocurrido un error al intentar verificar tu cuenta");
          } else {
            setRedirect(true);
          }
        }
      } else {
        setError("Debes completar todos los campos para poder seguir");
      }
    } else {
      setError("El email ingresado no es válido");
    }
    setButtonClass("");
  };

  const updateEmail = (field) => {
    setEmail(document.getElementById("email").value);
  };

  const updatePassword = (field) => {
    setPassword(document.getElementById("password").value);
  };

  if (redirect) {
    return <Loading />;
  }
  return (
    <Container-fluid>
      <Row>
        <Col className="login-left-side d-none d-lg-block col-lg-6">
          <img src={require("../../assets/horno/logo-01.png")} />
          <p>¡EL SABOR DE LA PIZZA ES MEJOR CUANDO SE COMPARTE!</p>
        </Col>
        <Col className="col-12 col-lg-1" className="login-rigth-side">
          <Col className="col-12 col-lg-8 offset-md-2">
            <h2>Bienvenido a El Horno de Juan</h2>
            <p>{error}</p>
          </Col>
          <Col className="col-12 col-lg-8 offset-md-2">
            <Col class="form-group">
              <Input placeholder="Ingresa tu email" type="email" id="email" name="email" value={email !== "" ? email : ""} onChange={() => updateEmail()} required />
            </Col>
            <Col class="form-group">
              <Input placeholder="Contraseña" type="password" id="password" name="password" value={password !== "" ? password : ""} onChange={() => updatePassword()} required />
            </Col>
          </Col>
          <Col className="col-12 col-lg-4 offset-md-6">
            <Button className={"mt-4 " + buttonClass} color="primary" type="button" onClick={() => loginMethod()}>
              <span>Iniciar Sesión</span>
            </Button>
          </Col>
        </Col>
      </Row>
    </Container-fluid>

    // <div id="back">
    //   <div class="backLeft">
    //     <div></div>
    //     <img src={require("../../assets/global/logpot.png")} />
    //     <p>One Touch, One Sell, Just Share.</p>
    //   </div>
    // </div>
    // <div id="slideBox">
    //   <div class="topLayer">
    //     <div class="right">
    //       <div class="content">
    //         <h2>Login</h2>
    //         <p>{error}</p>
    //         <div class="form-group">
    //           <Input placeholder="Ingresa tu email" type="email" id="email" name="email" value={email !== "" ? email : ""} onChange={() => updateEmail()} required />
    //         </div>
    //         <div class="form-group">
    //           <Input placeholder="Contraseña" type="password" id="password" name="password" value={password !== "" ? password : ""} onChange={() => updatePassword()} required />
    //         </div>
    //         <Button className={"mt-4 " + buttonClass} color="primary" type="button" onClick={() => loginMethod()}>
    //           {buttonClass !== "disabled" && <span>Iniciar Sesión</span>}
    //           {buttonClass === "disabled" && <div className="loadingspinner" />}
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Login;
