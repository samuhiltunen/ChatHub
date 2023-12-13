import React from "react";
import { Link } from "react-router-dom";
import "../css/main.css";
import { faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {TokenRefresh} from "./TokenRefresh";

export default function Thread(props) {
   /*  let token = localStorage.getItem('token');

    const options = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({utid: props.utid})
    };

    const deleteThread =  async () => {
        try {
            const response = await fetch('https://api.chathub.kontra.tel/threads/del', options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else if (response.status === 401) {
                console.error("Unauthorized, refreshing token...");
                await TokenRefresh();
                token = localStorage.getItem('token');
                await deleteThread();
            }
            const data = await response.json();
            console.log(data);

        } catch (err) {
            console.error(err);
        }
    }; */

    return (
      <div className="thread-container">
        <Link to={`/threads/${props.utid}`} className="thread-link">
          <div>
            <p> {props.title}</p>
            <p> ID: {props.utid}</p>
          </div>
        </Link>
        <button /* onClick={deleteThread} */> <FontAwesomeIcon icon={ faTrashAlt} size={"xl"}/> </button>
      </div>
    );
};