import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import icons from "./Asset/SVG/svgIcons";

import LoadingBar from 'react-top-loading-bar'
import ContactInfo from "./components/contactComponents/ContactInfo";
import About from "./components/aboutComponents/About";
import Popup from "./components/Popup";
import Dashboard from "./components/dashboard";
import BloodBank from "./components/bloodBank";
import Donor from "./components/donor";
import Donation from "./components/donations";
import Hospital from "./components/hospital";


function activate(svgId) {
  for (let i = 1; i < 8; i++) {
    document.querySelector(`#svg${i}`).classList.remove("nav-icon-active");
  }
  document.querySelector(`#${svgId}`).classList.add("nav-icon-active");
}


function App() {
  const location = useLocation();
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');
  const [progress, setProgress] = useState(0);
  const [navName, setNavName] = useState("🏠 Home");
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname === "/") {
      activate("svg1");
      setNavName("🏠 Home");
    } else if (location.pathname === '/bloodbank') {
      activate("svg2");
      setNavName("Blood Bank");
    } else if (location.pathname === '/donors') {
      activate("svg3");
      setNavName("Donors");
    } else if (location.pathname === '/donations') {
      activate("svg4");
      setNavName("Donations");
    } else if (location.pathname === '/bloodbanks') {
      activate("svg5");
      setNavName("Blood Banks");
    } else if (location.pathname === '/contact') {
      activate("svg6");
      setNavName("☎️ Contact");
    } else if (location.pathname === '/about') {
      activate("svg7");
      setNavName("📝 About");
    }

  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.getElementById("body").className = 'body-dark';
    } else {
      document.getElementById("body").className = 'body-light';

    }
  }, [theme]);

  return (
    <div className="App" data-theme={theme}>
      <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)} />
      <div className="bg"></div>
      <Popup />
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="logo">
            <a href="#" className="nav-link">
              <span style={{ letterSpacing: '0.13rem' }} className="link-text logo-text">Help Giving Org</span>
              {icons.hgo}
            </a>
          </li>
          <li className="nav-item" onClick={() => { activate("svg1"); setNavName("🏠 Home"); }}>
            <Link className="nav-link" to="/">
              {icons.home}
              <span className="link-text">Home</span>
            </Link>
          </li>

          <li className="nav-item" onClick={() => { activate("svg2"); setNavName("Blood Bank"); }}>
            <Link className="nav-link" to="/bloodbank">
              {icons.pollution}
              <span className="link-text">Blood Bank</span>
            </Link>
          </li>

          <li className="nav-item" onClick={() => { activate("svg3"); setNavName("Donors"); }}>
            <Link className="nav-link" to="/donors">
              {icons.hourlyWeather}
              <span style={{ marginLeft: "0.7rem" }} className="link-text">Donors</span>
            </Link>
          </li>

          <li className="nav-item" onClick={() => { activate("svg4"); setNavName("Donations"); }}>
            <Link className="nav-link" to="/donations">
              {icons.dailyWeather}
              <span style={{ marginLeft: "0.7rem" }} className="link-text">Donations</span>
            </Link>
          </li>

          <li className="nav-item" onClick={() => { activate("svg5"); setNavName("Blood Banks"); }}>
            <Link className="nav-link" to="/bloodbanks">
              {icons.news}
              <span className="link-text">Blood Banks</span>
            </Link>
          </li>

          <li className="nav-item" onClick={() => { activate("svg6"); setNavName("☎️ Contact"); }}>
            <Link className="nav-link" to="/contact">
              {icons.contact}
              <span className="link-text">Contact</span>
            </Link>
          </li>

          <li className="nav-item" onClick={() => { activate("svg7"); setNavName("📝 About"); }}>
            <Link className="nav-link" to="/about">
              {icons.aboutUs}
              <span className="link-text">About</span>
            </Link>
          </li>

          <li className="nav-item" onClick={() => { const newTheme = theme === 'light' ? 'dark' : 'light'; setTheme(newTheme); }}>
            <div className="nav-link">
              {icons.darkMode}
              <span className="link-text">Theme</span>
            </div>
          </li>
        </ul>
      </nav>
      <div className="AppDiv">
        <h1 className="App-h1" style={{ borderRadius: "2rem", padding: "1.2rem" }}><span style={{ display: 'block' }}>{icons.hgo}</span>Blood Bank Management</h1>
        <h2 id="abc" className="App-h1" style={{ padding: "0.8rem" }}>{navName}</h2>
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/bloodbank" element={<BloodBank />}></Route>
          <Route path="/donors" element={<Donor />}></Route>
          <Route path="/donations" element={<Donation />}></Route>
          <Route path="/bloodbanks" element={<Hospital />}></Route>
          <Route path="/contact" element={<ContactInfo />}></Route>
          <Route path="/about" element={<About />}></Route>
        </Routes>
      </div>
      <footer>
        {icons.hgo}
        <p style={{ color: "var(--nav-text)", fontSize: "1.25rem" }} className="info-p">HELP GIVING</p>
        <p style={{ letterSpacing: "0.31rem" }} className="info-p">ORGANIZATION</p>
      </footer>
    </div>

  );
}

export default App;
