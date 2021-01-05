import React from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Modal({ children, show, onClose }) {
  const className = show
    ? "visible opacity-100 inset-0"
    : "invisible opacity-0 inset-10";

  return ReactDOM.createPortal(
    <div
      className={`${className} fixed bg-black bg-opacity-50 transform duration-100 z-30`}
    >
      <a onClick={onClose} className="absolute inset-0 cursor-default" />
      <div className="inset-0 m-0 lg:m-16 p-8 bg-white shadow-lg absolute lg:rounded">
        <a
          onClick={onClose}
          className="absolute top-0 right-0 my-6 mx-8 h-4 w-4"
        >
          <FontAwesomeIcon icon={faTimes} />
        </a>
        {children}
      </div>
    </div>,
    document.body
  );
}
