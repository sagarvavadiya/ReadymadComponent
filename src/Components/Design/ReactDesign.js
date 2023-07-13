import React from "react";
import { Link } from "react-router-dom";

const ReactDesign = () => {
  return (
    <div>
      <Link to={"/muigrid"}>
        <button className="btn btn-outline-dark">muigrid</button>
      </Link>
      <Link to={"/DropDown"}>
        <button className="btn btn-outline-dark">DropDown</button>
      </Link>
      <Link to={"/AllRegulations"}>
        <button className="btn btn-outline-dark">ReactDataTable</button>
      </Link>
      <Link to={"/Pagination"}>
        <button className="btn btn-outline-dark">Pagination</button>
      </Link>
    </div>
  );
};

export default ReactDesign;
