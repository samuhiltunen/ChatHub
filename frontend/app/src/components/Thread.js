import React from "react";
import { Link } from "react-router-dom";
import "../css/thread.css";

export default function Thread(props) {
  console.log("rending single thread");
  return (
    <Link className="thread-link"/* onClick={openThread(id)} */>
      <div className="thread-container">
        <p>Title: {props.title}</p>
      </div>
    </Link>
  );
};
