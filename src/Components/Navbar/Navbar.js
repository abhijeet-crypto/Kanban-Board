import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import "../DarkMode/DarkMode";
import { ChevronDown, ChevronUp } from "react-feather";
import DarkMode from "../DarkMode/DarkMode";

const Navbar = ({
  sortingOption,
  onSortingChange,
  groupingOption,
  onGroupingChange,
}) => {
  // const [dropdownOpen, setDropdownOpen] = useState(false);

  // const toggleDropdown = () => {
  //   setDropdownOpen(!dropdownOpen);
  // };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const dropdownOptionsRef = useRef(null);
  React.useEffect(() => {
    const handleDocumentClick = (event) => {
      const dropdownContainer = dropdownRef.current;
      const dropdownOptions = dropdownOptionsRef.current;

      if (
        dropdownOpen &&
        dropdownContainer &&
        dropdownOptions &&
        !dropdownContainer.contains(event.target) &&
        !dropdownOptions.contains(event.target)
      ) {
        // Close the dropdown only if clicking outside and not inside the options
        setDropdownOpen(false);
      }
    };

    // Attach the event listener when the dropdown is open
    if (dropdownOpen) {
      document.addEventListener("click", handleDocumentClick);
    }

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [dropdownOpen]);

  return (
    <div className="navbar">
      <div className="nav-bar">
        <div className="drop-down" onClick={toggleDropdown} ref={dropdownRef}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/8017/8017760.png"
            className="icon"
            alt="Menu"
          />
          <p className="bold">Display</p>
          {dropdownOpen ? (
            <ChevronUp className="icon" />
          ) : (
            <ChevronDown className="icon" />
          )}
        </div>
        {dropdownOpen && (
          <div className="dropdown-options" ref={dropdownOptionsRef}>
            <DropdownOption
              label="Grouping"
              value={groupingOption}
              onChange={onGroupingChange}
            >
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </DropdownOption>
            <DropdownOption
              label="Ordering"
              value={sortingOption}
              onChange={onSortingChange}
            >
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </DropdownOption>
          </div>
        )}
      </div>

      <div className="toggle">
        <DarkMode></DarkMode>
      </div>
    </div>
  );
};

const DropdownOption = ({ label, value, onChange, children }) => {
  return (
    <div className="dd-option">
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        {children}
      </select>
    </div>
  );
};

export default Navbar;
