import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
function Footer() {
    const date = new Date().getFullYear();
    return (
        <footer className="footer">
                    <div className="footer-content">
                        <p className="m-b-0">Copyright © {date} Atik Faisal Emon</p>
                        <span>
                            <Link to="" className="text-gray m-r-15">Term &amp; Conditions</Link>
                            <Link to="" className="text-gray">Privacy &amp; Policy</Link>
                        </span>
                    </div>
                </footer>
    );
}


export default Footer;

