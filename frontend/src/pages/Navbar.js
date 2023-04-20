import { FaBars } from "react-icons/fa";
import { Input } from "reactstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { UserContext } from "../UserContext";
import { useContext } from "react";
import "../CSS/navbar.css";
import logo from "../Images/logo.svg";

const Navbar = () => {
  const user = useContext(UserContext);
  const [showLinks, setShowLinks] = useState(false);
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);

  let links = [
    {
      id: 1,
      url: "/",
      text: "home",
    },
    {
      id: 2,
      url: "/create-post",
      text: "Create Event",
      flag: "society",
    },
    {
      id: 3,
      url: "/my-favorites",
      text: "My Favorites",
      flag: "student",
    },
    {
      id: 4,
      url: "/profile",
      text: "profile",
    },
  ];

  if (user) {
    links = links.filter((link) => !link.flag || link.flag == user.accountType);
  }

  console.log(user);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };
  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (showLinks) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = "0px";
    }
  }, [showLinks]);
  return (
    <nav>
      <div className="nav-center">
        <div className="nav-header">
          <NavLink to="/">
            <img src={logo} className="logo" alt="logo" />
          </NavLink>
          <button className="nav-toggle" onClick={toggleLinks}>
            <FaBars />
          </button>
        </div>
        <div className="links-container" ref={linksContainerRef}>
          <ul className="links" ref={linksRef}>
            {links.map((link) => {
              const { id, url, text } = link;
              return (
                <li key={id}>
                  <NavLink to={url}>{text}</NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <form className="form-inline search-form">
          <Input
            className="search-field"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0 search-button"
            type="submit"
          >
            <AiOutlineSearch />
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
