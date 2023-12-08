
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import "../css/main.css";

export  default function ProfileInAside(){
    return(
        <div className={"profile-aside"}>
            <Link to="/profile">
            <button className={"fa-btn"}><FontAwesomeIcon icon={faCog} size={"lg"} /></button>
                </Link>

        </div>

    );
};