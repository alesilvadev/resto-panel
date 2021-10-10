import React, { Component, useEffect, useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io";
import { WhatsappShareButton } from "react-share";
import "./modal.scss";
import Slide from "react-reveal/Fade";


const Modal = (props) => {
  const [showModal, setShowModal] = useState(true);

  const toggleModal = () => {
    if (showModal === true) {
      setShowModal(!showModal);
    }
  };

  return (
    <>
      <>
        {showModal == true && (
          <>
            <div className="cover-box" onClick={() => toggleModal()}></div>
            <div className="cover-background" onClick={() => toggleModal()} />
            <div className={showModal == true ? "modal" : "modal fade hide-element"} id="modal" tabIndex="-1" role="dialog" aria-labelledby="modal">
              <div className="fix-bottom-box" onClick={() => toggleModal()} />
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" aria-hidden="true" onClick={() => toggleModal()}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <div className="modal-body mb-0 p-0">
                    <img src={props.promotion_img} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </>
  );
};
export default Modal;
