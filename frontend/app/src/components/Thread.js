import React from "react";
import { Link } from "react-router-dom";
import "../css/thread.css";

export default function Thread(props) {
  return (
    <Link className="thread-link"/* onClick={openThread(id)} */>
      <div className="thread-container">
        <p>{props.user}</p>
        <p>{props.time}</p>
      </div>
    </Link>
  );
};
