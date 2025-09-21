import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import App from "./App";
import FormsList from "./FormsList";
import AllSubmissions from "./AllSubmissions";
import "./Navbar.css"; 

function Main() {
  return (
    <Router>
      {/* Navigation */}
      <header className="navbar">
        <div className="navbar-logo">Form Builder</div>
        <nav className="navbar-links">
          <NavLink to="/" className="nav-link" end> Create Form </NavLink>
          <NavLink to="/forms" className="nav-link"> Saved Forms </NavLink>
          <NavLink to="/all-submissions" className="nav-link"> All Submissions </NavLink>
        </nav>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<App />} />       
        <Route path="/forms" element={<FormsList />} />    
        <Route path="/all-submissions" element={<AllSubmissions />} /> 
      </Routes>
    </Router>
  );
}

export default Main;
