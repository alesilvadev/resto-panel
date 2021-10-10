import React, { Component, useEffect, useState } from "react";
import "./loading.scss";

const Loading = (props) => {
  const [url, setUrl] = useState(require("../../assets/horno/logo-01-mobile.png"));

  return (
    <div id="load">
      <img alt="..." src={url} className="logo-loader" />
    </div>
  );
};
export default Loading;
