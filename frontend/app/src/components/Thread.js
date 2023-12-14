import React from "react";
import { Link } from "react-router-dom";
import "../css/main.css";
import { faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { deleteThread } from "../functions/deleteThread";

export default function Thread(props) {
    return (
      <div className="thread-container">
        <Link to={`/threads/${props.utid}`} className="thread-link">
          <div>
            <p> {props.title}</p>
            <p> ID: {props.utid}</p>
          </div>
        </Link>
        <button onClick={() => deleteThread(props.utid, props.setThreadsData)}> <FontAwesomeIcon icon={ faTrashAlt} size={"xl"}/> </button>
      </div>
    );
};