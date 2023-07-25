import React from "react";
import { Link } from "react-router-dom";

const ComponentTestNavbar = () => {
  return (
    <div className="styleFont">
      <Link to={"/ReactDesign"}>
        <button className="btn btn-outline-dark">Design</button>
      </Link>
      <Link to={"/ReactLogic"}>
        <button className="btn btn-outline-dark">Logic</button>
      </Link>
      <Link to={"/TestComponent"}>
        <button className="btn btn-outline-dark">TestComponent</button>
      </Link>
    </div>
  );
};

export default ComponentTestNavbar;
