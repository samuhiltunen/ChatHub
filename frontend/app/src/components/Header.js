import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars, faUserPlus} from '@fortawesome/free-solid-svg-icons';

const Header = ({ toggleAside }) => {
    return (
        <header className="header">
            <a className="header-icon" onClick={toggleAside}>
                <FontAwesomeIcon icon={faBars} size="lg" />
            </a>
            <div className="title">
                <h1>ChatHub</h1>
            </div>
            <div></div>
        </header>
    );
};

export default Header;