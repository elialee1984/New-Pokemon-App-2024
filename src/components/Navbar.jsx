import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <Link to="/" className="title">
        Eli's Pokemon App
      </Link>
      <div
        className="menu"
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
            <NavLink to="/pokemon_list">List of Pokemon</NavLink>
        </li>
        <li>
            <NavLink to="/pokemon_evolution_chains">Evolution Chains of Pokemon</NavLink>
        </li>
      </ul>
    </nav>
  );
};
