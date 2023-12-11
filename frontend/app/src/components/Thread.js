import React from "react";
import { Link } from "react-router-dom";
import "../css/thread.css";

export default function Thread(props) {
  console.log("rending single thread");
  return (
    <Link to={`/threads/${props.utid}`} className="thread-link">
      <div className="thread-container">
        <p>Title: {props.title}</p>
        <p>utid: {props.utid}</p>
      </div>
    </Link>
  );
};
