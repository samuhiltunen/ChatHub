import React from "react";
import { Link } from "react-router-dom";
import "../css/main.css";
import { faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {TokenRefresh} from "./TokenRefresh";

export default function Thread(props) {

    /*
    const token = localStorage.getItem('token');

    const options = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: `{"utid":"${props.utid}"}` // utid of the thread to be deleted
    };

    const deleteThread =  async () => {
        try {
            const response = await fetch('http://api.chathub.kontra.tel/threads/del', options);

            const data = await response.json();

        } catch (err) {
            console.error(err);
        }
    };
     */

    return (
      <div className="thread-container">
    <Link to={`/threads/${props.utid}`} className="thread-link">
      <div>
        <p> {props.title}</p>
        <p> ID: {props.utid}</p>
      </div>
    </Link>
          <button /*onClick={deleteThread}*/> <FontAwesomeIcon icon={ faTrashAlt} size={"xl"}/> </button>
          </div>
  );
};
