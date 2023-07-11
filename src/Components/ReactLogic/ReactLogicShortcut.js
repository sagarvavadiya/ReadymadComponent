import React from "react";
import { Link } from "react-router-dom";

const ReactLogicShortcut = () => {
  return (
    <div>
      <Link to={"/usereducer"}>
        <button className="btn btn-outline-dark">useReducer</button>
      </Link>
      <Link to={"/usecontext"}>
        <button className="btn btn-outline-dark">useContext</button>
      </Link>
      <Link to={"/Firebase"}>
        <button className="btn btn-outline-dark">Firebase</button>
      </Link>
    </div>
  );
};

export default ReactLogicShortcut;
