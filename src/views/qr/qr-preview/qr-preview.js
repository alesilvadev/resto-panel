import React, { useState, useEffect,useRef } from "react";
import { Col } from "reactstrap";

import "./qr-preview.scss";

const QrPreview = (props) => {
  const qrUrl = "https://www.scan-spot.com/";
  let QRCode = require("qrcode.react");

  return (
    <Col>
      <Col className="qr-canvas">
        <QRCode
          value={qrUrl + props.data.id}
          bgColor={props.data.backgroundColor}
          fgColor={props.data.qrColor}
          includeMargin={props.data.margin}
          renderAs="svg"
          level={props.data.errorLevel}
          imageSettings={props.data.image}
          id="qrGenerated"
          name="qrGenerated"
          version="1.1" xmlns="http://www.w3.org/2000/svg"
        />
      </Col>
    </Col>
  );
};


export default QrPreview;
